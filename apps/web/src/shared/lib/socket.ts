import { io } from "socket.io-client";

/**
 * Shared Socket.IO client instance.
 *
 * autoConnect is disabled so that we can decide
 * exactly when to establish the connection.
 */
export const socket = io("http://localhost:3000", {
  autoConnect: false,
  transports: ["websocket"],
});
