export type RoomId = string;
export type SocketId = string;

export interface Session {
  readonly socketId: SocketId;
  readonly roomId: RoomId;
}
