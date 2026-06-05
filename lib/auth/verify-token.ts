import { jwtVerify } from "jose";

export async function verifyToken(token: string) {
    const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET as string));
    return payload;
}