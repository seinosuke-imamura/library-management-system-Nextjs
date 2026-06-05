"use client";

import { useEffect, useState } from "react";
import { CreateBookSchema } from "@/lib/validations/book";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function BooksNewPage() {
    const [book, setBook] = useState<CreateBookSchema>({ title: "", author: "", publisher: "", category: "", quantity: 0, isbn: "", publicationYear: 0, stock: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === "USER") {
            setError("403: Forbidden");
            router.push("/books");
            return;
        }
    }, [user, router]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book),
            credentials: "include",
        });
        try {
            const data = await response.json();
            if (data.success) {
                router.push("/books/" + data.data[0].id);
            } else {
                setError(data?.error?.message ?? "追加に失敗しました");
            }
        } catch (error) {
            setError("500: Internal server error");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <h1>New Book</h1>
            {user?.role === "USER" ? <p>403: Forbidden</p> : <></>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={book?.title} onChange={(e) => setBook({ ...book, title: e.target.value })} />
                <input type="text" placeholder="Author" value={book?.author} onChange={(e) => setBook({ ...book, author: e.target.value })} />
                <input type="text" placeholder="Publisher" value={book?.publisher} onChange={(e) => setBook({ ...book, publisher: e.target.value })} />
                <input type="text" placeholder="Category" value={book?.category} onChange={(e) => setBook({ ...book, category: e.target.value })} />
                <input type="number" placeholder="Quantity" value={book?.quantity} onChange={(e) => setBook({ ...book, quantity: parseInt(e.target.value) })} />
                <input type="text" placeholder="ISBN" value={book?.isbn} onChange={(e) => setBook({ ...book, isbn: e.target.value })} />
                <input type="number" placeholder="Publication Year" value={book?.publicationYear} onChange={(e) => setBook({ ...book, publicationYear: parseInt(e.target.value) })} />
                <input type="number" placeholder="Stock" value={book?.stock} onChange={(e) => setBook({ ...book, stock: parseInt(e.target.value) })} />
                <button type="submit" disabled={isLoading}>追加</button>
            </form>
            {error && <p>{error}</p>}
            {isLoading && <p>Loading...</p>}
        </div>
    );
}