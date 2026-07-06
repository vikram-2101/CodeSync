// src/bootstrap/dependencies.ts

import { DocumentManager } from "@/modules/document/document.manager";
import { RoomRepository } from "@/modules/room/room.repository";
import { RoomService } from "@/modules/room/room.service";
import { SessionManager } from "@/modules/session/session.manager";

export interface AppDependencies {
  roomRepository: RoomRepository;
  sessionManager: SessionManager;
  roomService: RoomService;
  documentManager: DocumentManager;
}

export function createDependencies(): AppDependencies {
  const roomRepository = new RoomRepository();

  const sessionManager = new SessionManager();

  const documentManager = new DocumentManager();

  const roomService = new RoomService(
    roomRepository,
    sessionManager,
    documentManager,
  );

  return {
    roomRepository,
    sessionManager,
    roomService,
    documentManager,
  };
}
