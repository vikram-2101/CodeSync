import { useEffect, useMemo } from "react";
import * as Y from "yjs";

import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

import { EditorEvents } from "@codesync/shared";

import { useSocket } from "@/app/providers/socket/useSocket";

import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";
/**
 * Socket.IO delivers binary data as ArrayBuffer in browsers.
 * Yjs (via lib0) requires Uint8Array — ArrayBuffer has no numeric index
 * access, so lib0's decoder reads `undefined` for every byte and silently
 * produces garbage / no-ops.
 *
 * Every binary payload received from the socket MUST be converted before
 * being passed to any Yjs function.
 */
const toUint8Array = (data: ArrayBuffer | Uint8Array): Uint8Array =>
  data instanceof Uint8Array ? data : new Uint8Array(data);

export function useYjsSync(roomId: string, username: string) {
  const socket = useSocket();

  // One document per room. useMemo is stable across StrictMode's
  // double-invocation — the same Y.Doc instance is reused on remount.
  const doc = useMemo(() => {
    // We intentionally use roomId here so the linter knows this is a dependency
    // and correctly recreates the Y.Doc when the room changes.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    roomId;
    return new Y.Doc();
  }, [roomId]);
  const awareness = useMemo(() => new Awareness(doc), [doc]);
  useEffect(() => {
    // In React 18 Strict Mode, the component will mount, unmount, and remount.
    // The unmount sets localState to null.
    // setLocalStateField silently FAILS if the current state is null!
    // So we must manually spread the existing state (or an empty object)
    // and explicitly call setLocalState instead.
    const currentState = awareness.getLocalState() || {};
    awareness.setLocalState({
      ...currentState,
      user: {
        name: username,
      },
    });

    return () => {
      // Clear local state on unmount to prevent ghost clients in React Strict Mode
      awareness.setLocalState(null);
    };
  }, [awareness, username]);
  useEffect(() => {
    console.log(awareness.getStates());
  }, [awareness]);
  /**
   * ─────────────────────────────────────────
   * WHY THERE IS NO doc.destroy() ANYWHERE
   * ─────────────────────────────────────────
   * React StrictMode (dev) calls every effect cleanup immediately after
   * the first mount, then remounts all effects. If doc.destroy() lives in
   * ANY effect cleanup, the Y.Doc is killed during that fake unmount:
   *
   *   StrictMode fake cleanup → doc.destroy() → doc is dead
   *   StrictMode remount      → doc.on("update") on dead doc → silent no-op
   *
   * Y.Doc holds no OS-level resources (no file handles, no native threads).
   * It is safe to let the GC collect it when the component fully unmounts.
   * We clean up every listener we add, so there are no leaks.
   */

  /**
   * ─────────────────────────────────────────
   * 1. SYNC HANDSHAKE  (client ↔ server)
   * ─────────────────────────────────────────
   */
  useEffect(() => {
    if (!socket) return;

    const handleSync = (data: ArrayBuffer | Uint8Array) => {
      // Convert ArrayBuffer → Uint8Array before lib0 decoding.
      const message = toUint8Array(data);

      const decoder = decoding.createDecoder(message);
      const encoder = encoding.createEncoder();

      syncProtocol.readSyncMessage(decoder, encoder, doc, null);

      const reply = encoding.toUint8Array(encoder);
      if (reply.length > 0) {
        socket.emit(EditorEvents.SYNC, reply);
      }
    };

    socket.on(EditorEvents.SYNC, handleSync);

    return () => {
      socket.off(EditorEvents.SYNC, handleSync);
    };
  }, [socket, doc]);

  /**
   * ─────────────────────────────────────────
   * 2. RECEIVE REMOTE UPDATES
   * ─────────────────────────────────────────
   * Socket.IO delivers binary as ArrayBuffer in the browser.
   * Yjs's lib0 decoder requires Uint8Array — without toUint8Array()
   * every byte reads as `undefined` and applyUpdate silently no-ops,
   * so the remote client's Y.Text / MonacoBinding never updates.
   *
   * Tag the applied update with origin "remote" so the sender effect
   * (effect 3) skips echoing it back to the server.
   */
  useEffect(() => {
    if (!socket) return;

    const handler = (data: ArrayBuffer | Uint8Array) => {
      const update = toUint8Array(data);
      Y.applyUpdate(doc, update, "remote");
    };

    socket.on(EditorEvents.UPDATE, handler);

    return () => {
      socket.off(EditorEvents.UPDATE, handler);
    };
  }, [socket, doc]);

  /**
   * ─────────────────────────────────────────
   * 3. SEND LOCAL UPDATES
   * ─────────────────────────────────────────
   * Only emit updates that originated locally (user typing via
   * MonacoBinding). Updates applied in effect 2 carry origin "remote"
   * and are skipped — this breaks the client-side echo loop:
   *
   *   receive → applyUpdate("remote") → doc fires "update"(origin="remote")
   *   → origin === "remote" → RETURN, do not emit → loop broken ✅
   */
  useEffect(() => {
    if (!socket) return;

    const handler = (update: Uint8Array, origin: unknown) => {
      if (origin === "remote") return; // do not echo server updates back
      socket.emit(EditorEvents.UPDATE, update);
    };

    doc.on("update", handler);

    return () => {
      doc.off("update", handler);
    };
  }, [socket, doc]);

  /**
   * ─────────────────────────────────────────
   * 4. SEND AWARENESS UPDATES
   * ─────────────────────────────────────────
   */
  useEffect(() => {
    if (!socket) return;

    // Broadcast our state when the socket connects so existing users see us
    const initialState = encodeAwarenessUpdate(awareness, [awareness.clientID]);
    socket.emit(EditorEvents.AWARENESS, initialState);

    const handleAwarenessUpdate = (
      {
        added,
        updated,
        removed,
      }: {
        added: number[];
        updated: number[];
        removed: number[];
      },
      origin: unknown,
    ) => {
      // Avoid infinite loop of echoing remote updates back to the server
      if (origin === "remote") {
        // If we just learned about a new user, politely introduce ourselves back
        // (This solves the stateless server problem where the server doesn't hold presence)
        if (added.length > 0) {
          const localState = encodeAwarenessUpdate(awareness, [
            awareness.clientID,
          ]);
          socket.emit(EditorEvents.AWARENESS, localState);
        }
        return;
      }

      const changedClients = [...added, ...updated, ...removed];

      const update = encodeAwarenessUpdate(awareness, changedClients);

      socket.emit(EditorEvents.AWARENESS, update);
    };

    awareness.on("update", handleAwarenessUpdate);

    return () => {
      awareness.off("update", handleAwarenessUpdate);
    };
  }, [socket, awareness]);

  /**
   * ─────────────────────────────────────────
   * 4. RECEIVE AWARENESS UPDATES
   * ─────────────────────────────────────────
   */
  useEffect(() => {
    if (!socket) return;

    const handleAwareness = (data: ArrayBuffer | Uint8Array) => {
      const update = toUint8Array(data);

      console.log("[CLIENT] awareness received", update.byteLength);

      applyAwarenessUpdate(awareness, update, "remote");

      console.log(
        "[CLIENT] states",
        Array.from(awareness.getStates().entries()),
      );
    };

    socket.on(EditorEvents.AWARENESS, handleAwareness);

    return () => {
      socket.off(EditorEvents.AWARENESS, handleAwareness);
    };
  }, [socket, awareness]);

  /**
   * ─────────────────────────────────────────
   * 4. INITIAL SYNC REQUEST
   * ─────────────────────────────────────────
   */
  useEffect(() => {
    if (!socket) return;

    const encoder = encoding.createEncoder();
    syncProtocol.writeSyncStep1(encoder, doc);
    socket.emit(EditorEvents.SYNC, encoding.toUint8Array(encoder));
  }, [socket, doc]);

  return { doc, awareness };
}
