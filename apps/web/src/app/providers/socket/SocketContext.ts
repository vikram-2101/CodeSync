import { createContext } from "react";
import { Socket } from "socket.io-client";

/**
 * React context for the shared Socket.IO client.
 */
export const SocketContext = createContext<Socket | null>(null);
