import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { like } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/require-auth";

export async function GET(request: Request) {
  const user = await requireAuth(request);
  if (user instanceof Response) {
    return user;
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) {
    return Response.json({success: false, error: {message: "400: Search query is required", code: "BAD_REQUEST"}}, {status: 400});
  }
  const b = await db.select().from(books).where(like(books.title, `%${q}%`));
  return Response.json({success: true, data: b});
}