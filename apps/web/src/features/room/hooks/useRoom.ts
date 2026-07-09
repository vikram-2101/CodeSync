import { createRoom, joinRoom } from "../api/room.socket";
import { useCallback } from "react";
/**
 * Encapsulates all room-related actions.
 *
 * Components interact with this hook instead of
 * talking to Socket.IO directly.
 */
export function useRoom() {
  /**
   * Requests the server to create a new room.
   */
  const handleCreateroom = useCallback((username: string) => {
    createRoom(username);
  }, []);
  /**
   * Requests the server to join an existing room.
   */
  const handleJoinRoom = useCallback((roomId: string, username: string) => {
    joinRoom(roomId, username);
  }, []);
  return { createRoom: handleCreateroom, joinRoom: handleJoinRoom };
}
