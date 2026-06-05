import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    cookieStore.set("token", "", { httpOnly: true, sameSite: "lax", maxAge: 0, path: "/" });
    return NextResponse.json({ success: true, data: { message: "Logged out successfully" } }, { status: 200 });
}