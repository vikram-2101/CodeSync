export type RoomId = string;
export type SocketId = string;
export type Username = string;

export interface Participant {
  socketId: SocketId;
  username: Username;
  joinedAt: Date;
}

export interface Room {
  roomId: RoomId;
  participants: Map<SocketId, Participant>;
}

export interface Session {
  socketId: SocketId;
  roomId: RoomId;
}
