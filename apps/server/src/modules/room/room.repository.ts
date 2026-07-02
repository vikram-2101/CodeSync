import { Room, RoomId } from "./room.types";

export class RoomRepository {
  private readonly rooms: Map<RoomId, Room> = new Map();

  create(room: Room): void {
    if (this.rooms.has(room.roomId)) {
      throw new Error(`Room with id ${room.roomId} already exists`);
    }
    this.rooms.set(room.roomId, room);
  }
  findById(roomId: RoomId): Room | null {
    // if(!this.rooms.has(roomId)){
    //     throw new Error(`Room with id ${roomId} does not exist`);
    // }
    // i think we don't need this if condition because we are just checking if the room exists or not, so we can just return the result of the has method and on the basis of that we can decide whether to throw an error or not.
    return this.rooms.get(roomId) ?? null;
  }
  exists(roomId: RoomId): boolean {
    return this.rooms.has(roomId);
  }
  deleteRoom(roomId: RoomId): boolean {
    return this.rooms.delete(roomId);
  }
}
