export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    user: (id: string) => [...queryKeys.auth.all, "user", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: string) => [...queryKeys.users.all, "list", { filters }] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
  posts: {
    all: ["posts"] as const,
    feed: () => [...queryKeys.posts.all, "feed"] as const,
    byUser: (userId: string) => [...queryKeys.posts.all, "user", userId] as const,
  }
} as const;