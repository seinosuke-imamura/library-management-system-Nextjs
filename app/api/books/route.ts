import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { createBookSchema } from "@/lib/validations/book";
import { requireAuth ,requireRole} from "@/lib/auth/require-auth";

export async function GET(request: Request) {
  const user = await requireAuth(request);
  if (user instanceof Response) {
    return user;
  }
  const b = await db.select().from(books)
  return Response.json({success: true, data: b});
}

export async function POST(request: Request) {
  const user = await requireAuth(request);
  if (user instanceof Response) {
    return user;
  }
  const authorizedUser = await requireRole(user, ["ADMIN", "STAFF"]);
  if (authorizedUser instanceof Response) {
    return authorizedUser;
  }
  const result = createBookSchema.safeParse(await request.json());
  if (!result.success) {
    return Response.json({success: false, error: {message: "400: Invalid request body", code: "BAD_REQUEST", details: result.error.format()}}, {status: 400});
  }
  const book = (await db.insert(books).values({ id: crypto.randomUUID(), ...result.data }).returning());
  return Response.json({success: true, data: book}, {status: 201});
}