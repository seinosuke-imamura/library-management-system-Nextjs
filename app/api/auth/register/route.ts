import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { users } from "@/lib/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const body = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    }).safeParse(await request.json());
    if (!body.success) {
        return Response.json({ success:false, error: {message: "400: Invalid request body", code: "BAD_REQUEST", details: body.error.format()}}, {status: 400});
    }
    if ((await db.select().from(users).where(eq(users.username, body.data.username)).limit(1))[0]) {
        return Response.json({ success:false, error: {message: "400: User already exists", code: "BAD_REQUEST"}}, {status: 400});
    }
    const user = await db.insert(users).values({ id: randomUUID(), username: body.data.username, password: await hash(body.data.password, 10), role: "USER" }).returning();
    if (!user[0].id) {
        return Response.json({ success:false, error: {message: "404: User not found", code: "NOT_FOUND"}}, {status: 404});
    }
    return Response.json({ success:true, data: { message: "User created successfully" } }, { status: 201 });
}