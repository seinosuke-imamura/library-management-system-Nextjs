"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { FormEvent } from "react";
import { UpdateBookSchema } from "@/lib/validations/book";
import { useRouter } from "next/navigation";

export default function BooksEditPage() {
    const { user } = useAuth();
    const [book, setBook] = useState<UpdateBookSchema>({ title: "", author: "", publisher: "", category: "", quantity: 0, isbn: "", publicationYear: 0, stock: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);    
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        fetch(`/api/books/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(book), credentials: "include" })
        .then(async res => await res.json())
        .then(data => {
            if (data.success) {
                const { id: _, ...fields } = data.data[0];
                setBook(fields);
                if (typeof id === "string") {
                    router.push(`/books/${id}`);
                }
            } else {
                setError(data?.error?.message ?? "更新に失敗しました");
            }
        })
        .catch(error => {
            setError("500: Internal server error");
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    useEffect(() => {
        if (user?.role === "USER") {
            setError("403: Forbidden");
            router.push("/books");
            return;
        }
        setError(null);
        setBook({ title: "", author: "", publisher: "", category: "", quantity: 0, isbn: "", publicationYear: 0, stock: 0 });
        setIsLoading(true);
        if (typeof id !== "string") {
            setError("不正なIDです");
            setIsLoading(false);
            return;
        }
        fetch(`/api/books/${id}`, { credentials: "include" })
        .then(async res => await res.json())
        .then(data => {
            if (data.success) {
                setBook(data.data);
            } else {
                setError(data?.error?.message ?? "取得に失敗しました");
            }
        })
        .catch(error => {
            setError("500: Internal server error");
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [id, user, router]);
    return (
        <div>
            <h1>Book Edit</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={book?.title} onChange={(e) => setBook({ ...book, title: e.target.value })} />
                <input type="text" placeholder="Author" value={book?.author} onChange={(e) => setBook({ ...book, author: e.target.value })} />
                <input type="text" placeholder="Publisher" value={book?.publisher} onChange={(e) => setBook({ ...book, publisher: e.target.value })} />
                <input type="text" placeholder="Category" value={book?.category} onChange={(e) => setBook({ ...book, category: e.target.value })} />
                <input type="number" placeholder="Quantity" value={book?.quantity} onChange={(e) => setBook({ ...book, quantity: parseInt(e.target.value) })} />
                <input type="text" placeholder="ISBN" value={book?.isbn} onChange={(e) => setBook({ ...book, isbn: e.target.value })} />
                <input type="number" placeholder="Publication Year" value={book?.publicationYear} onChange={(e) => setBook({ ...book, publicationYear: parseInt(e.target.value) })} />
                <input type="number" placeholder="Stock" value={book?.stock} onChange={(e) => setBook({ ...book, stock: parseInt(e.target.value) })} />
                <button type="submit" disabled={isLoading || isSubmitting}>更新</button>
            </form>
            {error && <p>{error}</p>}
            {isLoading && <p>Loading...</p>}
            {isSubmitting && <p>Submitting...</p>}
        </div>
    );
}