import { verifyToken } from "./lib/auth/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value ?? null;
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
        await verifyToken(token);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        "/books/:path*", "/rentals/:path*"
    ],
};