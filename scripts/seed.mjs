import { hash } from "bcryptjs";
import pg from "pg";

const { Pool } = pg;

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const existing = await pool.query("SELECT 1 FROM users LIMIT 1");
    if (existing.rowCount && existing.rowCount > 0) {
      console.log("Seed skipped: data already exists");
      return;
    }

    await pool.query(
      `INSERT INTO users (id, username, password, role) VALUES
        ($1, $2, $3, $4),
        ($5, $6, $7, $8),
        ($9, $10, $11, $12)`,
      [
        "1",
        "admin",
        await hash("admin", 10),
        "ADMIN",
        "2",
        "staff",
        await hash("staff", 10),
        "STAFF",
        "3",
        "user",
        await hash("user", 10),
        "USER",
      ],
    );

    await pool.query(
      `INSERT INTO books (id, title, author, publisher, category, quantity, isbn, "publicationYear", stock) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9),
        ($10, $11, $12, $13, $14, $15, $16, $17, $18),
        ($19, $20, $21, $22, $23, $24, $25, $26, $27)`,
      [
        "1",
        "Book 1",
        "Author 1",
        "Publisher 1",
        "Category 1",
        10,
        "1234567890",
        2020,
        10,
        "2",
        "Book 2",
        "Author 2",
        "Publisher 2",
        "Category 2",
        20,
        "1234567891",
        2021,
        10,
        "3",
        "Book 3",
        "Author 3",
        "Publisher 3",
        "Category 3",
        30,
        "1234567892",
        2022,
        10,
      ],
    );

    console.log("Seed completed");
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
