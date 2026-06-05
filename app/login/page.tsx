"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useAuth();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });
        try {
            const data = await response.json();
            if (data.success) {
                setUser(data.data.user);
                router.push("/books");
            } else {
                setError(data.error?.message ?? "ログインに失敗しました");
            }
        } catch (error) {
            setError("An error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" disabled={isLoading}>Login</button>
            </form>
            {error && <p>{error}</p>}
            {isLoading && <p>Loading...</p>}
        </div>
    );
}