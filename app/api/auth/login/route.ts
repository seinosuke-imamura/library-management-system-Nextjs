import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { compare } from "bcryptjs";
import { sign } from "@/lib/auth/jwt";
import { eq } from "drizzle-orm";
import { z } from "zod";


export async function POST(request: Request) {
    const body = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    }).safeParse(await request.json());
    if (!body.success) {
        return Response.json({ success:false, error: {message: "400: Invalid request body", code: "BAD_REQUEST", details: body.error.format()}}, {status: 400});
    }
    const user = (await db.select().from(users).where(eq(users.username, body.data.username)).limit(1))[0];
    if (!user?.id) {
        return Response.json({ success:false, error: {message: "404: User not found", code: "NOT_FOUND"}}, {status: 404});
    }
    const isValid = await compare(body.data.password, user.password);
    if (!isValid) {
        return Response.json({ success:false, error: {message: "401: Invalid credentials", code: "UNAUTHORIZED"}}, {status: 401});
    }

    const token = await sign({userId: user.id, userRole: user.role});
    const headers = new Headers();
    headers.set("Set-Cookie", `token=${token}; HttpOnly; SameSite=Lax; Max-Age=3600; Path=/`);
    return Response.json({ success:true, data: { token, user: { id: user.id, username: user.username, role: user.role } } }, { headers: headers });
}