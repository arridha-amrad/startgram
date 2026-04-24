import z from "zod";
import type { AspectRatio, MediaWithTaggedUsers } from "#/components/create-post/create-post-context";
import type { UserMinimal } from "#/types/user.types";

export const MAX_CAPTION_LENGTH = 200;

export const createPostFormSchema = z.object({
  caption: z
    .string()
    .max(
      MAX_CAPTION_LENGTH,
      `Caption must be less than ${MAX_CAPTION_LENGTH} characters`,
    )
    .optional(),
  location: z.string().optional(),
  collaborators: z.array(z.custom<UserMinimal>()).optional(),
});

export const createPostSchema = createPostFormSchema.extend({
  media: z.custom<Omit<MediaWithTaggedUsers, "file">[]>(),
  aspectRatio: z.custom<AspectRatio>(),
})

export type TCreatePostFormSchema = z.infer<typeof createPostFormSchema>;
export type TCreatePostSchema = z.infer<typeof createPostSchema>;
