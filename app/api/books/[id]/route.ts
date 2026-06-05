import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateBookSchema } from "@/lib/validations/book";
import { requireAuth ,requireRole} from "@/lib/auth/require-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request);
  if (user instanceof Response) {
    return user;
  }
  const { id } = await params;
  const book = (await db.select().from(books).where(eq(books.id, id)))[0];
  if (!book) {
    return Response.json({success: false, error: {message: "404: Book not found", code: "NOT_FOUND"}}, {status: 404});
  }
  return Response.json({success: true, data: book});
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request);
  if (user instanceof Response) {
    return user;
  }
  const authorizedUser = await requireRole(user, ["ADMIN", "STAFF"]);
  if (authorizedUser instanceof Response) {
    return authorizedUser;
  }
  const { id } = await params;
  const book = (await db.select().from(books).where(eq(books.id, id)))[0];
  if (!book) {
    return Response.json({success: false, error: {message: "404: Book not found", code: "NOT_FOUND"}}, {status: 404});
  }
  const result = updateBookSchema.safeParse(await request.json());
  if (!result.success) {
    return Response.json({success: false, error: {message: "400: Invalid request body", code: "BAD_REQUEST", details: result.error.format()}}, {status: 400});
  }
  const updatedBook = (await db.update(books).set({ ...result.data }).where(eq(books.id, id)).returning());
  return Response.json({success: true, data: updatedBook}, {status: 200});
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request);
  if (user instanceof Response) { 
    return user;
  }
  const authorizedUser = await requireRole(user, ["ADMIN"]);
  if (authorizedUser instanceof Response) {
    return authorizedUser;
  }
  const { id } = await params;
  const book = (await db.select().from(books).where(eq(books.id, id)))[0];
  if (!book) {
    return Response.json({success: false, error: {message: "404: Book not found", code: "NOT_FOUND"}}, {status: 404});
  }
  await db.delete(books).where(eq(books.id, id));
  return Response.json({success: true, data: {message: "Book deleted successfully"}}, {status: 200});
}