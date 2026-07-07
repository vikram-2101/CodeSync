import * as Y from "yjs";
import { Socket } from "socket.io-client";

import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

import { EditorEvents } from "@codesync/shared";

export class SocketProvider {
  private readonly socket: Socket;
  private readonly document: Y.Doc;

  constructor(socket: Socket, document: Y.Doc) {
    this.socket = socket;
    this.document = document;
    this.registerSocketListeners();
    this.registerDocumentListener();
  }

  private registerSocketListeners() {
    // Handle initial sync handshake messages from the server.
    this.socket.on(EditorEvents.SYNC, (message: Uint8Array) => {
      const decoder = decoding.createDecoder(message);
      const encoder = encoding.createEncoder();

      syncProtocol.readSyncMessage(decoder, encoder, this.document, null);

      const reply = encoding.toUint8Array(encoder);

      if (reply.length > 0) {
        this.socket.emit(EditorEvents.SYNC, reply);
      }
    });

    // Handle live UPDATE messages broadcast by the server.
    this.socket.on(EditorEvents.UPDATE, (update: Uint8Array) => {
      Y.applyUpdate(this.document, update);
    });
  }

  private registerDocumentListener() {
    this.document.on("update", (update: Uint8Array) => {
      // Send the raw Yjs binary update on the UPDATE channel.
      // Do NOT wrap in sync-protocol — the server UPDATE handler
      // expects a plain Y.Doc update, not a sync message.
      this.socket.emit(EditorEvents.UPDATE, update);
    });
  }

  destroy() {
    this.socket.off(EditorEvents.SYNC);
    this.socket.off(EditorEvents.UPDATE);
    // this.document.destroy();
  }
}

// What each method does
// registerSocketListeners()
// Receives sync messages from the server.
// Applies them to the local Y.Doc.
// Sends a reply if the Yjs protocol requires one.
// registerDocumentListener()
// Watches for local changes to the Y.Doc.
// Wraps them with writeUpdate().
// Sends them to the server.
// sync()
// Starts the initial synchronization handshake by sending a SyncStep1 message.
// destroy()
// Removes the socket listener and destroys the local Y.Doc.
