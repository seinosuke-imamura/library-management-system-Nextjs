"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState, FormEvent } from "react";
import { Book } from "@/lib/db/schema";
import Link from "next/link";
import { BookCard } from "@/components/BookCard";

export default function BooksPage() {
    const { user } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [borrowingBookId, setBorrowingBookId] = useState<string | null>(null);
    const [borrowError, setBorrowError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBooks = (query?: string) => {
        setError(null);
        setBooks([]);
        setIsLoading(true);

        const url =
            query && query.trim()
                ? `/api/books/search?q=${encodeURIComponent(query.trim())}`
                : "/api/books";

        fetch(url, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setBooks(data.data);
                } else {
                    setError(data?.error?.message ?? "取得に失敗しました");
                }
            })
            .catch(() => {
                setError("500: Internal server error");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleBorrow = (bookId: string) => {
        setBorrowingBookId(bookId);
        setBorrowError(null);
        fetch("/api/rentals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId }),
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setBooks((prev) =>
                        prev.map((book) =>
                            book.id === bookId ? { ...book, stock: book.stock - 1 } : book
                        )
                    );
                } else {
                    setBorrowError(data?.error?.message ?? "借りるに失敗しました");
                }
            })
            .catch(() => {
                setBorrowError("500: Internal server error");
            })
            .finally(() => {
                setBorrowingBookId(null);
            });
    };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchBooks(searchQuery);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div>
            <h1>Books</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="タイトルで検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    検索
                </button>
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                        setSearchQuery("");
                        fetchBooks();
                    }}
                >
                    全件表示
                </button>
            </form>
            {(books.length === 0 && !isLoading && !error) && <p>No books found</p>}
            {(books.length === 0 && isLoading) && <p>Loading...</p>}
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <BookCard
                            book={book}
                            onBorrow={handleBorrow}
                            borrowingBookId={borrowingBookId}
                        />
                    </li>
                ))}
                {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                    <li>
                        <Link href="/books/new">New Book</Link>
                    </li>
                )}
            </ul>
            {error && <p>{error}</p>}
            {borrowError && <p>{borrowError}</p>}
        </div>
    );
}
