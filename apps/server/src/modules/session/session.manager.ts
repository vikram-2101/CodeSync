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

    console.log(`[SessionManager] Session created`, {
      socketId: session.socketId,
      roomId: session.roomId,
    });
  }

  findBySocketId(socketId: SocketId): Session | null {
    return this.sessions.get(socketId) || null;
  }
  exists(socketId: SocketId): boolean {
    return this.sessions.has(socketId);
  }
  delete(socketId: SocketId): boolean {
    const deleted = this.sessions.delete(socketId);

    if (deleted) {
      console.log(`[SessionManager] Session deleted`, { socketId });
    }

    return deleted;
  }
  getAll(): ReadonlyMap<SocketId, Session> {
    return this.sessions;
  }
}
