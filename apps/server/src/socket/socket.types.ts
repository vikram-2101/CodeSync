export interface CreateRoomPayload {
  username: string;
}

export interface RoomCreatedPayload {
  roomId: string;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}

export interface RoomJoinedPayload {
  roomId: string;
}

export interface ParticipantLeftPayload {
  message: string;
}

export interface ParticipantJoinedPayload {
  message: string;
}
