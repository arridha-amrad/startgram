import z from "zod";
import type { UserMinimal } from "#/types/user.types";

export const MAX_CAPTION_LENGTH = 200;

export const createPostSchema = z.object({
  caption: z
    .string()
    .max(
      MAX_CAPTION_LENGTH,
      `Caption must be less than ${MAX_CAPTION_LENGTH} characters`,
    )
    .optional(),
  // location: z.string().optional(),
  location: z.string().min(1, "Location is required"),

  collaborators: z.array(z.custom<UserMinimal>()).optional()
});

export type TCreatePostSchema = z.infer<typeof createPostSchema>;
