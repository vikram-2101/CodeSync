import { useEffect } from "react";
import type { ReactNode } from "react";

import { socket } from "@/shared/lib/socket";
import { SocketContext } from "./SocketContext";

interface SocketProviderProps {
  children: ReactNode;
}

/**
 * Provides a single Socket.IO connection
 * to the entire application.
 */
export function SocketProvider({ children }: SocketProviderProps) {
  useEffect(() => {
    // Connect when the provider mounts.
    socket.connect();

    return () => {
      // Disconnect when the provider unmounts.
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
