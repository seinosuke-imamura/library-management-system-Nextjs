"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProtectedNav() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        if (response.ok) {
            setUser(null);
            router.push("/login");
        }
    };
    return (
        <header>
            <nav>
                <ul>
                    <li><Link href="/books">Books</Link></li>
                    <li><Link href="/rentals/my">Rentals</Link></li>
                    {(user?.role === "ADMIN" || user?.role === "STAFF") && <li><Link href="/rentals">Rentals</Link></li>}
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
        </header>
    );
}