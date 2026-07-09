import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { CollaborativeEditor } from "@/features/editor/components/CollaborativeEditor";
import { useYjsSync } from "@/features/editor/hooks/useYjsSync";
import { PresenceList } from "@/features/presence/components/PresenceList";
import { leaveRoom } from "@/features/room/api/room.socket";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { username } = useUserStore();
  const { doc, awareness } = useYjsSync(roomId || "", username || "");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-border/50 rounded-xl p-8 shadow-2xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Room Active</h1>
          <p className="text-muted-foreground">
            You have successfully joined the room.
          </p>
        </div>

        <div className="bg-background/50 p-4 rounded-lg border border-border/50 text-left space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Room ID
            </span>
            <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded text-sm">
              {roomId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your Name
            </span>
            {/* <span className="font-medium">{username || "Anonymous"}</span> */}
            <PresenceList awareness={awareness} />
          </div>
        </div>

        {roomId && <CollaborativeEditor roomId={roomId} doc={doc} />}

        <Button asChild className="w-full">
          <Link to="/">Leave Room & Go Back</Link>
        </Button>
      </div>
    </div>
  );
}
