import { Socket, Server } from "socket.io";
import type { AppDependencies } from "@/bootstrap/dependencies";
import { SocketEvents } from "../socket.events";
import {
  createRoomSchema,
  joinRoomSchema,
} from "@/modules/room/room.validator";
// import {io} from "socket.io"
export function registerRoomEvents(
  io: Server,
  socket: Socket,
  dependencies: AppDependencies,
) {
  const { roomService } = dependencies;
  socket.on(SocketEvents.CREATE_ROOM, (payload) => {
    try {
      const result = createRoomSchema.safeParse(payload);
      if (!result.success) {
        socket.emit(SocketEvents.ERROR, {
          message: result.error.issues[0].message,
        });
        return;
      }
      const room = roomService.createRoom(socket.id, result.data.username);

      socket.join(room.roomId);
      socket.emit(SocketEvents.ROOM_CREATED, {
        room,
      });

      console.log(`[RoomEvents] Room created successfully`, {
        roomId: room.roomId,
        socketId: socket.id,
        username: result.data.username,
      });
    } catch (error) {
      socket.emit("error", {
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while creating the room.",
      });
    }
  });

  socket.on(SocketEvents.JOIN_ROOM, (payload) => {
    try {
      const result = joinRoomSchema.safeParse(payload);
      if (!result.success) {
        socket.emit(SocketEvents.ERROR, {
          message: result.error.issues[0].message,
        });
        return;
      }

      const room = roomService.joinRoom(
        result.data.roomId,
        socket.id,
        result.data.username,
      );

      socket.join(result.data.roomId);
      socket.emit(SocketEvents.ROOM_JOINED, {
        room,
      });
      io.to(result.data.roomId).emit(SocketEvents.PARTICIPANT_JOINED, room);

      console.log(`[RoomEvents] Room joined successfully`, {
        roomId: result.data.roomId,
        socketId: socket.id,
        username: result.data.username,
      });
    } catch (error) {
      socket.emit("error", {
        message:
          error instanceof Error ? error.message : "Failed to join the room.",
      });
    }
  });
  socket.on("disconnect", () => {
    try {
      const session = dependencies.sessionManager.findBySocketId(socket.id);
      if (!session) return;
      const room = roomService.leaveRoom(socket.id);
      if (room) {
        io.to(room.roomId).emit(SocketEvents.ROOM_STATE, {
          message: "A participant has left the room.",
          room,
        });

        console.log(`[RoomEvents] Disconnect cleanup completed`, {
          roomId: room.roomId,
          socketId: socket.id,
        });
      }
      // socket.emit("roomLeft", {message: "Successfully left the room."});
      // socket.to(session.roomId).emit("participantLeft", {message: "A participant has left the room."});
    } catch (error) {
      console.error("Failed to cleanup disconnected socket:", error);
    }
  });
}
