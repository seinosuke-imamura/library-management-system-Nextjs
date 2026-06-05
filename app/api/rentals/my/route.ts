import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { rentals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await requireAuth(request);
  if (user instanceof Response) {
    return user;
  }
  const r = await db.select().from(rentals).where(eq(rentals.userId, user.id));
  return Response.json({success: true, data: r});
}

