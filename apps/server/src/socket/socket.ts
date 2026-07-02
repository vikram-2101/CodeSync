import { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

import type { AppDependencies } from "@/bootstrap/dependencies";
import { registerConnectionHandler } from "./handlers/connection.handler";

export function registerSocketServer(
  server: HttpServer,
  dependencies: AppDependencies,
) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  registerConnectionHandler(io, dependencies);

  return io;
}
