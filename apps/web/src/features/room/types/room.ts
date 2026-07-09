/**
 * Represents a participant inside a collaborative room.
 */
export interface Participant {
  socketId: string;
  username: string;
  joinedAt: Date;
}

/**
 * Represents the room state received from the backend.
 */
export interface Room {
  roomId: string;
  participants: Participant[];
}
