"use client";

import { Book } from "@/lib/db/schema";
import Link from "next/link";

type BookCardProps = {
    book: Book;
    onBorrow: (bookId: string) => void;
    borrowingBookId: string | null;
};

export function BookCard({ book, onBorrow, borrowingBookId }: BookCardProps) {
    return (
        <>
            <Link href={`/books/${book.id}`}>{book.title}</Link>
            {book.stock > 0 && (
                <button
                    type="button"
                    onClick={() => onBorrow(book.id)}
                    disabled={borrowingBookId === book.id}
                >
                    {borrowingBookId === book.id ? "借りています..." : "借りる"}
                </button>
            )}
        </>
    );
}

