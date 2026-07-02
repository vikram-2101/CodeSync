import { Session, SocketId } from "./session.types";

export class SessionManager {
  private readonly sessions: Map<SocketId, Session> = new Map();

  create(session: Session): void {
    if (this.sessions.has(session.socketId)) {
      throw new Error(
        `Session with socketId ${session.socketId} already exists`,
      );
    }
    this.sessions.set(session.socketId, session);
  }

  findBySocketId(socketId: SocketId): Session | null {
    return this.sessions.get(socketId) || null;
  }
  exists(socketId: SocketId): boolean {
    return this.sessions.has(socketId);
  }
  delete(socketId: SocketId): boolean {
    return this.sessions.delete(socketId);
  }
}
