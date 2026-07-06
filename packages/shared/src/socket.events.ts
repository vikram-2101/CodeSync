// socket.events.ts

export const SocketEvents = {
  CREATE_ROOM: "createRoom",
  ROOM_CREATED: "roomCreated",

  JOIN_ROOM: "joinRoom",
  ROOM_JOINED: "roomJoined",

  LEAVE_ROOM: "leaveRoom",
  ROOM_LEFT: "roomLeft",

  PARTICIPANT_JOINED: "participantJoined",
  PARTICIPANT_LEFT: "participantLeft",

  ROOM_STATE: "roomState",

  ERROR: "error",
} as const;

export const EditorEvents = {
  SYNC: "editor:sync",
  AWARENESS: "editor:awareness",
  UPDATE: "editor:update",
};
