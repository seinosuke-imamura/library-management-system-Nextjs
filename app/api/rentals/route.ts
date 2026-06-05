import { requireAuth, requireRole } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { rentals, users, books } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { createRentalSchema } from "@/lib/validations/rentals";

export async function GET(request: Request) {
  const user = await requireAuth(request);
  if (user instanceof Response) {
    return user;
  }
  const authorizedUser = await requireRole(user, ["ADMIN", "STAFF"]);
  if (authorizedUser instanceof Response) {
    return authorizedUser;
  }
  const r = await db.select({rental: rentals, user: users, book: books}).from(rentals).innerJoin(users, eq(rentals.userId, users.id)).innerJoin(books, eq(rentals.bookId, books.id));

  return Response.json({success: true, data: r});
}

export async function POST(request: Request) {
    const user = await requireAuth(request);
    if (user instanceof Response) {
        return user;
    }
   
    const result = createRentalSchema.safeParse(await request.json());
    if (!result.success) {
        return Response.json({success: false, error: {message: "400: Invalid request body", code: "BAD_REQUEST", details: result.error.format()}}, {status: 400});
    }
    const book = await db.select().from(books).where(eq(books.id, result.data.bookId));
    if (!book[0]) {
        return Response.json({success: false, error: {message: "404: Book not found", code: "NOT_FOUND"}}, {status: 404});
    }
    const alreadyRented = await db.select().from(rentals).where(and(eq(rentals.userId, user.id), eq(rentals.bookId, result.data.bookId), isNull(rentals.returnDate)));
    if (alreadyRented.length > 0) {
        return Response.json({success: false, error: {message: "400: Book already rented", code: "ALREADY_RENTED"}}, {status: 400});
    }
    if (book[0].stock <= 0) {
        return Response.json({success: false, error: {message: "400: Book not available", code: "OUT_OF_STOCK"}}, {status: 400});
    }
    const rental = await db.insert(rentals).values({id: crypto.randomUUID(), userId: user.id, bookId: result.data.bookId, rentedDate: new Date().getTime() as number, dueDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 7 as number, returnDate: null}).returning();
    await db.update(books).set({stock: book[0].stock - 1}).where(eq(books.id, result.data.bookId));
    return Response.json({success: true, data: rental}, {status: 201});
}
