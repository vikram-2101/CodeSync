import { Server, Socket } from "socket.io";
import * as Y from "yjs";

import { AppDependencies } from "@/bootstrap/dependencies";
import { EditorEvents } from "@codesync/shared";

import {
  handleSyncMessage,
  registerDocumentListener,
} from "../editor/editor.sync";

export function registerEditorEvents(
  io: Server,
  socket: Socket,
  dependencies: AppDependencies,
) {
  let cleanupDocumentListener: (() => void) | null = null;

  /**
   * Resolve session helper
   */
  const getSession = () =>
    dependencies.sessionManager.findBySocketId(socket.id);

  /**
   * Resolve document helper
   */
  const getDoc = () => {
    const session = getSession();
    if (!session) return null;
    return dependencies.documentManager.get(session.roomId);
  };

  /**
   * -----------------------------------
   * SYNC (Yjs protocol handshake)
   * -----------------------------------
   */
  socket.on(EditorEvents.SYNC, (message: Uint8Array) => {
    const session = getSession();
    const document = getDoc();

    if (!session || !document) return;

    /**
     * Register listener once per socket
     * (broadcasts LOCAL server doc updates to others)
     */
    if (!cleanupDocumentListener) {
      cleanupDocumentListener = registerDocumentListener(
        socket,
        document,
        session.roomId, // IMPORTANT FIX (you must pass roomId)
      );

      console.log(`[Editor] Document listener registered`, {
        socketId: socket.id,
        roomId: session.roomId,
      });
    }

    handleSyncMessage(socket, document, message);

    console.log(`[Editor] SYNC handled`, {
      socketId: socket.id,
      roomId: session.roomId,
      messageLength: message.byteLength,
    });
  });

  /**
   * -----------------------------------
   * UPDATE (NEW - REALTIME EDITS)
   * -----------------------------------
   */
  socket.on(EditorEvents.UPDATE, (update: Uint8Array) => {
    const session = getSession();
    const document = getDoc();

    if (!session || !document) return;

    console.log(`[Editor] UPDATE received`, {
      socketId: socket.id,
      roomId: session.roomId,
      updateLength: update.byteLength,
    });

    // Apply remote update into server doc.
    // Tag origin as "remote" so registerDocumentListener can
    // identify this update and broadcast it — without echoing it back
    // to the sender. This avoids the double-broadcast that occurred
    // when both this handler and the doc listener emitted UPDATE.
    Y.applyUpdate(document, update, "remote");
  });

  /**
   * -----------------------------------
   * CLEANUP
   * -----------------------------------
   */
  socket.on("disconnect", () => {
    cleanupDocumentListener?.();

    console.log(`[Editor] Socket disconnected`, {
      socketId: socket.id,
    });
  });
}
