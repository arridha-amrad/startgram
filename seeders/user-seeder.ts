import { config } from 'dotenv'
config({ path: ['.env.local', '.env'] })

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import { hashPassword, generateRandomString } from "better-auth/crypto";
import { faker } from "@faker-js/faker";

const TOTAL = 100

console.log("Database URL loaded:", process.env.DATABASE_URL ? "Yes" : "No");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle({ client: pool, schema });

const main = async () => {
  const promises = Array.from({ length: TOTAL }).map(async () => {
    const id = generateRandomString(32);
    const password = await hashPassword("123");
    return db.transaction(async (tx) => {
      await tx.insert(schema.users).values({
        id,
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        username: faker.internet.username().toLowerCase(),
        image: faker.image.avatar(),
        emailVerified: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      });
      await tx.insert(schema.accounts).values({
        accountId: id,
        userId: id,
        password,
        id: generateRandomString(32),
        providerId: "credential",
      });
    });
  });

  await Promise.all(promises);
};

main()
  .then(() => {
    console.log("Users seeded successfully");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    pool.end();
    process.exit(0);
  });
