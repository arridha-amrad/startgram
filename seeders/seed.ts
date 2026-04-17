import { config } from 'dotenv'
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { todos } from '#/db/schema';

config({ path: ['.env.local', '.env'] })


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool });

async function main() {
  const todo: typeof todos.$inferInsert = {
    title: "Try drizzle",
  };

  await db.insert(todos).values(todo);
  console.log('New user created!')

  const myTodos = await db.select().from(todos);
  console.log('Getting all todos from the database: ', myTodos)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(todos)
    .set({
      title: "Try drizzle 'DONE!'"
    })
    .where(eq(todos.id, myTodos[0].id));

  console.log('User info updated!')

  await db.delete(todos).where(eq(todos.id, myTodos[0].id));
  console.log('User deleted!')
}

main().finally(() => {
  pool.end()
  process.exit(0)
});
