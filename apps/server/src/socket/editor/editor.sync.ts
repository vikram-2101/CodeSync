import { Socket } from "socket.io";
import * as Y from "yjs";

import * as syncProtocol from "y-protocols/sync";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";

import { EditorEvents } from "@codesync/shared";

/**
 * Registers a single document update listener for this socket.
 * Returns a cleanup function to unregister the listener.
 */
export function registerDocumentListener(
  socket: Socket,
  document: Y.Doc,
  roomId: string,
) {
  const updateHandler = (update: Uint8Array, origin: unknown) => {
    // Only broadcast updates that arrived from a remote client (origin === "remote").
    // Updates originating locally on the server (e.g. from SyncStep2 replay) have
    // a different or undefined origin and should NOT be broadcast.
    if (origin !== "remote") return;
    socket.to(roomId).emit(EditorEvents.UPDATE, update);
  };

  document.on("update", updateHandler);

  return () => {
    document.off("update", updateHandler);
  };
}

export function handleSyncMessage(
  socket: Socket,
  document: Y.Doc,
  message: Uint8Array,
) {
  const decoder = decoding.createDecoder(message);
  const encoder = encoding.createEncoder();

  syncProtocol.readSyncMessage(decoder, encoder, document, null);

  const reply = encoding.toUint8Array(encoder);

  if (reply.length > 0) {
    socket.emit(EditorEvents.SYNC, reply);
  }
}
