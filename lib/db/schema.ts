import { integer, pgTable, text } from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["ADMIN", "STAFF", "USER"] }).notNull(),
});

export const books = pgTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  publisher: text("publisher").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  isbn: text("isbn").notNull(),
  publicationYear: integer("publicationYear").notNull(),
  stock: integer("stock").notNull(),
});

export const rentals = pgTable("rentals", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  bookId: text("bookId").notNull(),
  rentedDate: integer("rentedDate").notNull(),
  dueDate: integer("dueDate").notNull(),
  returnDate: integer("returnDate"),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Book = InferSelectModel<typeof books>;
export type NewBook = InferInsertModel<typeof books>;

export type Rental = InferSelectModel<typeof rentals>;
export type NewRental = InferInsertModel<typeof rentals>;
