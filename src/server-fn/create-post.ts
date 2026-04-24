import { db } from "#/db";
import { collaborators as collaboratorsTable, media as mediaTable, posts, taggedUsers } from "#/db/tables";
import { getSessionMiddleware } from "#/lib/auth.functions";
import type { TCreatePostSchema } from "#/zod-schemas/createpost-schema";
import { createServerFn } from "@tanstack/react-start";


export const createPost = createServerFn({ method: "POST" })
  .inputValidator((data: TCreatePostSchema) => data)
  .middleware([getSessionMiddleware])
  .handler(async ({ context: { session }, data }) => {
    const { aspectRatio, caption, collaborators, location, media } = data;

    const newPost = await db.insert(posts).values({
      aspectRatio: aspectRatio ?? "1 / 1",
      caption: caption ?? "",
      userId: session.user.id,
      location: location ?? null,
    }).returning()

    console.log("selesai insert post", newPost[0]!.id);

    if (media && media.length > 0) {
      const newMedia = await db.insert(mediaTable).values(media.map((m) => ({
        postId: newPost[0]!.id,
        order: m.order,
        mediaType: m.type,
        url: m.src,
      }))).returning()

      console.log("selesai insert media");

      const taggedUsersData = media.flatMap((m, mediaIndex) => m.taggedUsers.map((t) => ({
        coordinateX: t.coordinate.x,
        coordinateY: t.coordinate.y,
        userId: t.id,
        mediaId: newMedia[mediaIndex]!.id,
      })));

      if (taggedUsersData.length > 0) {
        await db.insert(taggedUsers).values(taggedUsersData)
        console.log("selesai insert tagged users");
      }
    }

    if (collaborators && collaborators.length > 0) {
      await db.insert(collaboratorsTable).values(collaborators.map((c) => ({
        postId: newPost[0]!.id,
        userId: c.id,
      })))
      console.log("selesai insert collaborators");
    }

    const post = await db.query.posts.findFirst({
      where: {
        id: newPost[0]!.id,
      },
      with: {
        user: {
          columns: {
            username: true,
            id: true,
            image: true,
            displayUsername: true,
          },
        },
        media: {
          columns: {
            id: true,
            url: true,
            mediaType: true,
          },
          with: {
            taggedUsers: {
              with: {
                user: {
                  columns: {
                    username: true,
                    id: true,
                    image: true,
                    displayUsername: true,
                  },
                }
              }
            },
          },
        },
        postComments: true,
        postLikes: true,
        collaborators: {
          with: {
            user: {
              columns: {
                username: true,
                id: true,
                image: true,
                displayUsername: true,
              },
            },
          },
        },
      },
    });

    console.log("selesai fetch post");

    return post

  })