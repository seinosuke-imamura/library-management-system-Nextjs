import {SignJWT, jwtVerify} from 'jose';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function sign(payload: {userId: string, userRole: "ADMIN" | "STAFF" | "USER"}): Promise<string> {
  const jwt = await new SignJWT({...payload})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));
  return jwt;
}


export async function verify(token: string) {
  const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET as string));
  const user = await db.select().from(users).where(eq(users.id, payload.userId as string)).limit(1).get();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}