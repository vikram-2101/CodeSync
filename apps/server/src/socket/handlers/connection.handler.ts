import { Server, Socket } from "socket.io";

import type { AppDependencies } from "@/bootstrap/dependencies";
import { registerRoomEvents } from "@/socket/events/room.events";

export function registerConnectionHandler(
  io: Server,
  dependencies: AppDependencies,
) {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    // Register socket events here
    registerRoomEvents(io, socket, dependencies);
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} ${reason}`);
    });
  });
}
