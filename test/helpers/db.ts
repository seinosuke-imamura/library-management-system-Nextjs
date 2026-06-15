import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import { books, rentals, users } from "@/lib/db/schema";

const TEST_DB_NAME = "library_test";
const ADMIN_URL =
  process.env.DATABASE_URL_ADMIN ??
  "postgresql://user:password@localhost:5432/postgres";

export function getTestDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL_TEST ??
    "postgresql://user:password@localhost:5432/library_test"
  );
}

export async function ensureTestDatabase(): Promise<void> {
  const adminPool = new Pool({ connectionString: ADMIN_URL });

  try {
    const exists = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [TEST_DB_NAME],
    );

    if (exists.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE ${TEST_DB_NAME}`);
    }
  } finally {
    await adminPool.end();
  }
}

export async function migrateTestDatabase(): Promise<void> {
  const pool = new Pool({ connectionString: getTestDatabaseUrl() });
  const db = drizzle(pool);

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
  } finally {
    await pool.end();
  }
}

export async function resetTestDatabase(): Promise<void> {
  const pool = new Pool({ connectionString: getTestDatabaseUrl() });
  const db = drizzle(pool);

  try {
    await db.execute(sql`TRUNCATE TABLE rentals, books, users RESTART IDENTITY CASCADE`);
    await db.insert(users).values([
      {
        id: "1",
        username: "admin",
        password: await hash("admin", 10),
        role: "ADMIN",
      },
      {
        id: "2",
        username: "staff",
        password: await hash("staff", 10),
        role: "STAFF",
      },
      {
        id: "3",
        username: "user",
        password: await hash("user", 10),
        role: "USER",
      },
    ]);
    await db.insert(books).values([
      {
        id: "1",
        title: "Book 1",
        author: "Author 1",
        publisher: "Publisher 1",
        category: "Category 1",
        quantity: 10,
        isbn: "1234567890",
        publicationYear: 2020,
        stock: 10,
      },
      {
        id: "2",
        title: "Book 2",
        author: "Author 2",
        publisher: "Publisher 2",
        category: "Category 2",
        quantity: 20,
        isbn: "1234567891",
        publicationYear: 2021,
        stock: 10,
      },
    ]);
  } finally {
    await pool.end();
  }
}
