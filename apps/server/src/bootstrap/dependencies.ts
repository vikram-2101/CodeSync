// src/bootstrap/dependencies.ts

import { RoomRepository } from "@/modules/room/room.repository";
import { RoomService } from "@/modules/room/room.service";
import { SessionManager } from "@/modules/session/session.manager";

export interface AppDependencies {
  roomRepository: RoomRepository;
  sessionManager: SessionManager;
  roomService: RoomService;
}

export function createDependencies(): AppDependencies {
  const roomRepository = new RoomRepository();

  const sessionManager = new SessionManager();

  const roomService = new RoomService(roomRepository, sessionManager);

  return {
    roomRepository,
    sessionManager,
    roomService,
  };
}
