import "dotenv/config";
import { hash } from "bcryptjs";
import { db } from "./index";
import { books, users } from "./schema";

async function seed() {
  await db.insert(users).values({
    id: "1",
    username: "admin",
    password: await hash("admin", 10),
    role: "ADMIN",
  });
  await db.insert(users).values({
    id: "2",
    username: "staff",
    password: await hash("staff", 10),
    role: "STAFF",
  });
  await db.insert(users).values({
    id: "3",
    username: "user",
    password: await hash("user", 10),
    role: "USER",
  });
  await db.insert(books).values({
    id: "1",
    title: "Book 1",
    author: "Author 1",
    publisher: "Publisher 1",
    category: "Category 1",
    quantity: 10,
    isbn: "1234567890",
    publicationYear: 2020,
    stock: 10,
  });
  await db.insert(books).values({
    id: "2",
    title: "Book 2",
    author: "Author 2",
    publisher: "Publisher 2",
    category: "Category 2",
    quantity: 20,
    isbn: "1234567890",
    publicationYear: 2020,
    stock: 10,
  });
  await db.insert(books).values({
    id: "3",
    title: "Book 3",
    author: "Author 3",
    publisher: "Publisher 3",
    category: "Category 3",
    quantity: 30,
    isbn: "1234567890",
    publicationYear: 2020,
    stock: 10,
  });
}

seed()
  .then(() => console.log("Seed完了"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
