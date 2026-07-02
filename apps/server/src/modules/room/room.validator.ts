import { z } from "zod";

export const createRoomSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username cannot exceed 20 characters."),
});

export const joinRoomSchema = z.object({
  roomId: z.string().trim().length(6, "Invalid room id."),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username cannot exceed 20 characters."),
});
