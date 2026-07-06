import * as Y from "yjs";
import { RoomId } from "@/modules/room/room.types";

export class DocumentManager {
  private readonly documents = new Map<RoomId, Y.Doc>();

  create(roomId: RoomId): Y.Doc {
    if (this.documents.has(roomId)) {
      throw new Error(`Document already exists for room ${roomId}`);
    }
    const doc = new Y.Doc();

    this.documents.set(roomId, doc);

    return doc;
  }

  get(roomId: RoomId): Y.Doc | undefined {
    return this.documents.get(roomId);
  }

  destroy(roomId: RoomId): void {
    const doc = this.documents.get(roomId);

    if (!doc) {
      return;
    }

    doc.destroy();
    this.documents.delete(roomId);
  }
}
