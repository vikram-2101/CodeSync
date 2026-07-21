import crypto from "node:crypto";

import {
  Participant,
  Room,
  RoomId,
  Session,
  SocketId,
  Username,
} from "./room.types";
import { RoomRepository } from "./room.repository";
import { SessionManager } from "../session/session.manager";
import { DocumentManager } from "../document/document.manager";
const MAX_PARTICIPANTS = 2;
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly sessionManager: SessionManager,
    private readonly documentManager: DocumentManager,
  ) {}

  private generateRoomId(): string {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  createRoom(socketId: SocketId, username: Username): Room {
    const roomId = this.generateRoomId();
    if (this.sessionManager.exists(socketId)) {
      throw new Error("Socket already belongs to a room.");
    }
    const participant: Participant = {
      socketId,
      username,
      joinedAt: new Date(),
    };
    const room: Room = {
      roomId,
      participants: new Map([[socketId, participant]]),
    };
    this.roomRepository.create(room);

    this.documentManager.create(roomId);

    const session: Session = {
      socketId,
      roomId,
    };
    this.sessionManager.create(session);

    console.log(`[RoomService] Room created successfully`, {
      roomId,
      socketId,
      username,
      participantCount: room.participants.size,
    });

    return room;
  }

  joinRoom(roomId: RoomId, socketId: SocketId, username: Username): Room {
    const room = this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error(`Room not found with id ${roomId}`);
    }
    if (room.participants.size >= MAX_PARTICIPANTS) {
      throw new Error(`Room with id ${roomId} is full`);
    }
    const session = this.sessionManager.findBySocketId(socketId);
    if (session) {
      if (session.roomId === roomId) {
        // Idempotent success: the client is already in this room on this socket.
        return room;
      }
      throw new Error(`Session already belongs to a different room.`);
    }
    const participant: Participant = {
      socketId,
      username,
      joinedAt: new Date(),
    };
    room.participants.set(socketId, participant);
    this.sessionManager.create({ socketId, roomId });

    console.log(`[RoomService] User joined room successfully`, {
      roomId,
      socketId,
      username,
      participantCount: room.participants.size,
    });

    return room;
  }

  leaveRoom(socketId: SocketId): Room | null {
    const session = this.sessionManager.findBySocketId(socketId);
    if (!session) {
      throw new Error(`Session not found for socketId ${socketId}`);
    }
    const room = this.roomRepository.findById(session.roomId);
    if (!room) {
      throw new Error(`Room not found with id ${session.roomId}`);
    }
    room.participants.delete(socketId);

    this.sessionManager.delete(socketId);

    if (room.participants.size === 0) {
      this.roomRepository.deleteRoom(room.roomId);
      this.documentManager.destroy(room.roomId);

      console.log(`[RoomService] Room cleaned up after last participant left`, {
        roomId: room.roomId,
        socketId,
      });
    } else {
      console.log(`[RoomService] Participant left room successfully`, {
        roomId: room.roomId,
        socketId,
        remainingParticipants: room.participants.size,
      });
    }

    return room;
  }

  getRoom(roomId: RoomId): Room | null {
    return this.roomRepository.findById(roomId);
  }
}
