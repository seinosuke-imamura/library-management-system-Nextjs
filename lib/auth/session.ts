import { cookies } from "next/headers";
import { verify } from "./jwt";


export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? null;
    return token ? await verify(token) : null;
}

export async function setSession(token: string) {
    const cookieStore = await cookies();
    cookieStore.set("token", token);
}