import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useEffect } from "react";

import {
  onRoomCreated,
  onRoomJoined,
  removeRoomListeners,
} from "@/features/room/api/room.socket";

import { useRoom } from "@/features/room/hooks/useRoom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/useUserStore";

const createSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const joinSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  roomId: z.string().min(3, "Room ID is required"),
});

export function RoomEntryCard() {
  const navigate = useNavigate();

  const { createRoom, joinRoom } = useRoom();

  useEffect(() => {
    onRoomCreated((room) => {
      navigate(`/room/${room.roomId}`);
    });

    onRoomJoined((room) => {
      navigate(`/room/${room.roomId}`);
    });

    return () => {
      removeRoomListeners();
    };
  }, [navigate]);

  const { username, setUsername } = useUserStore();

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: username,
    },
  });

  const joinForm = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      name: username,
      roomId: "",
    },
  });

  const onCreate = (data: z.infer<typeof createSchema>) => {
    setUsername(data.name);

    createRoom(data.name);
  };
  // Generate a random 9-character room ID
  // const newRoomId = createRoom(data.name);

  const onJoin = (data: z.infer<typeof joinSchema>) => {
    setUsername(data.name);
    joinRoom(data.roomId, data.name);
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 relative z-10">
      <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-surface/50 backdrop-blur-xl">
        <Tabs defaultValue="create" className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-background/50 border border-border/50">
              <TabsTrigger value="create" className="gap-2 text-sm">
                Create Room
              </TabsTrigger>
              <TabsTrigger value="join" className="gap-2 text-sm">
                Join Room
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="create" className="mt-0">
            <form onSubmit={createForm.handleSubmit(onCreate)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="create-name"
                    className="text-xs uppercase text-muted-foreground font-semibold tracking-wider"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="create-name"
                    placeholder="e.g. Alex"
                    {...createForm.register("name")}
                    className="bg-background/80 h-11 border-border/50 focus-visible:ring-primary/50"
                  />
                  {createForm.formState.errors.name && (
                    <p className="text-[0.8rem] text-destructive">
                      {createForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold shadow-md shadow-primary/20"
                  size="lg"
                >
                  Create Room
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground w-full">
                  <span>No account needed. Just your name.</span>
                </div>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="join" className="mt-0">
            <form onSubmit={joinForm.handleSubmit(onJoin)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="join-name"
                    className="text-xs uppercase text-muted-foreground font-semibold tracking-wider"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="join-name"
                    placeholder="e.g. Alex"
                    {...joinForm.register("name")}
                    className="bg-background/80 h-11 border-border/50 focus-visible:ring-primary/50"
                  />
                  {joinForm.formState.errors.name && (
                    <p className="text-[0.8rem] text-destructive">
                      {joinForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="join-room"
                    className="text-xs uppercase text-muted-foreground font-semibold tracking-wider"
                  >
                    Room ID
                  </Label>
                  <Input
                    id="join-room"
                    placeholder="e.g. room-abc-123"
                    {...joinForm.register("roomId")}
                    className="bg-background/80 h-11 font-mono text-sm border-border/50 focus-visible:ring-primary/50"
                  />
                  {joinForm.formState.errors.roomId && (
                    <p className="text-[0.8rem] text-destructive">
                      {joinForm.formState.errors.roomId.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold border-border/50 hover:bg-background"
                  size="lg"
                  variant="outline"
                >
                  Join Room
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
