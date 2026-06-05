import { verify } from "./jwt";
import { cookies } from "next/headers";


export async function requireAuth(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? null;
    if (!token) {
        return Response.json({ success:false, error: {message: "401: Unauthorized", code: "UNAUTHORIZED"}}, {status: 401});
    }
    try {
        const user = await verify(token);
        if (!user) {
            return Response.json({ success:false, error: {message: "401: Unauthorized", code: "UNAUTHORIZED"}}, {status: 401});
        }
        return user;
    } catch (error) {
        return Response.json({ success:false, error: {message: "401: Unauthorized", code: "UNAUTHORIZED"}}, {status: 401});
    }
}

export async function requireRole(user: {role: "ADMIN" | "STAFF" | "USER"}, allowedRoles: ("ADMIN" | "STAFF" | "USER")[]) {
    if (!allowedRoles.includes(user.role)) {
        return Response.json({ success:false, error: {message: "403: Forbidden", code: "FORBIDDEN"}}, {status: 403});
    }
    return user;
}
