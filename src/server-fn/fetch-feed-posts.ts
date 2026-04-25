import { db } from "#/db"
import { getSessionMiddleware } from "#/lib/auth.functions";
import { createServerFn } from "@tanstack/react-start";
import { sql, type AnyColumn } from "drizzle-orm";

export function countPostTotalLikes(postId: AnyColumn) {
  return sql<number>`(
    SELECT CAST(COUNT(*) as integer)
    FROM "post_likes"
    WHERE "post_likes"."post_id" = ${postId}
  )`.as('total_likes');
}

export function isPostLiked(postId: AnyColumn, authUserId?: string) {
  return !!authUserId
    ? sql<boolean>`(
        SELECT EXISTS(
          SELECT 1
          FROM "post_likes"
          WHERE "post_likes"."post_id" = ${postId}
          AND "post_likes"."user_id" = ${authUserId}
        )
      )`.as('is_liked')
    : sql<boolean>`false`.as('is_liked');
}


export const fetchFeedPostsServerFn = createServerFn({ method: "GET" })
  .middleware([getSessionMiddleware])
  .handler(async ({ context: { session } }) => {
    return await fetchFeedPosts({ authUserId: session?.user?.id })
  })

const fetchFeedPosts = async ({ authUserId }: { authUserId?: string }) => {
  const posts = await db.query.posts.findMany({
    limit: 1,
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    extras: {
      totalLikes: ({ id }) => countPostTotalLikes(id),
      isLiked: ({ id }) => isPostLiked(id, authUserId),
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
        }
      },
      media: {
        with: {
          taggedUsers: {
            with: {
              user: {
                columns: {
                  id: true,
                  username: true,
                }
              }
            }
          }
        }
      },
      collaborators: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              username: true,
              image: true,
            }
          }
        }
      }
    }
  })
  return posts
}

export type TFeedPost = Awaited<ReturnType<typeof fetchFeedPosts>>[number]