import { SocketEvents } from "@codesync/shared";
import { socket } from "@/shared/lib/socket";

import type { Room } from "../types/room";
/**
 * Sends a request to create a new room.
 */
export function createRoom(username: string) {
  socket.emit(SocketEvents.CREATE_ROOM, {
    username,
  });
}

/**
 * Sends a request to join an existing room.
 */
export function joinRoom(roomId: string, username: string) {
  socket.emit(SocketEvents.JOIN_ROOM, {
    roomId,
    username,
  });
}

/**
 * Sends a request to leave the current room.
 */
export function leaveRoom() {
  socket.emit(SocketEvents.LEAVE_ROOM);
}

/**
 * Registers a listener for a successful room creation.
 */
export function onRoomCreated(callback: (room: Room) => void) {
  socket.on(SocketEvents.ROOM_CREATED, ({ room }) => {
    callback(room);
  });
}

/**
 * Registers a listener for joining an existing room.
 */
export function onRoomJoined(callback: (room: Room) => void) {
  socket.on(SocketEvents.ROOM_JOINED, ({ room }) => {
    callback(room);
  });
}

/**
 * Registers a listener for an error event.
 */
export function onRoomError(callback: (error: { message: string }) => void) {
  socket.on(SocketEvents.ERROR, (error) => {
    callback(error);
  });
}

/**
 * Removes all room listeners.
 */
export function removeRoomListeners() {
  socket.off(SocketEvents.ROOM_CREATED);
  socket.off(SocketEvents.ROOM_JOINED);
  socket.off(SocketEvents.ERROR);
}
