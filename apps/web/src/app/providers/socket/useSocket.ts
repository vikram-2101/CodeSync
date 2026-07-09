import { useContext } from "react";

import { SocketContext } from "./SocketContext";

/**
 * Returns the shared Socket.IO instance.
 */
export function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within SocketProvider.");
  }

  return socket;
}
