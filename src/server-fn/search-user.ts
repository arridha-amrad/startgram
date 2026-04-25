import { db } from "#/db";
import type { UserMinimal } from "#/types/user.types";
import { createServerFn } from "@tanstack/react-start";

export const searchUser = createServerFn({ method: "GET" })
  .inputValidator((data: { limit: number; query: string }) => data)
  .handler(async ({ data: { limit, query } }) => {
    const users = await db.query.users.findMany({
      where: { username: { like: `%${query}%` } },
      limit,
      columns: {
        id: true,
        name: true,
        username: true,
        image: true
      }
    });

    const resUsers: UserMinimal[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image
    }));

    return resUsers;
  });
