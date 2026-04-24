import { defineRelations } from "drizzle-orm"
import * as schema from "./tables"

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions(),
    accounts: r.many.accounts()
  },
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id
    })
  },
  accounts: {
    users: r.one.users({
      from: r.accounts.userId,
      to: r.users.id
    })
  },
  posts: {
    user: r.one.users({
      from: r.posts.userId,
      to: r.users.id
    }),
    media: r.many.media(),
    postComments: r.many.postComments(),
    postLikes: r.many.postLikes(),
    collaborators: r.many.collaborators()
  },
  media: {
    post: r.one.posts({
      from: r.media.postId,
      to: r.posts.id
    }),
    taggedUsers: r.many.taggedUsers()
  },
  taggedUsers: {
    media: r.one.media({
      from: r.taggedUsers.mediaId,
      to: r.media.id
    }),
    user: r.one.users({
      from: r.taggedUsers.userId,
      to: r.users.id
    })
  },
  collaborators: {
    post: r.one.posts({
      from: r.collaborators.postId,
      to: r.posts.id
    }),
    user: r.one.users({
      from: r.collaborators.userId,
      to: r.users.id
    })
  },
  postLikes: {
    post: r.one.posts({
      from: r.postLikes.postId,
      to: r.posts.id
    }),
    user: r.one.users({
      from: r.postLikes.userId,
      to: r.users.id
    })
  },
  postComments: {
    post: r.one.posts({
      from: r.postComments.postId,
      to: r.posts.id
    }),
    user: r.one.users({
      from: r.postComments.userId,
      to: r.users.id
    }),
    parent: r.one.postComments({
      from: r.postComments.parentId,
      to: r.postComments.id
    })
  },
  commentLikes: {
    comment: r.one.postComments({
      from: r.commentLikes.commentId,
      to: r.postComments.id
    }),
    user: r.one.users({
      from: r.commentLikes.userId,
      to: r.users.id
    })
  }
}));