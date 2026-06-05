"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/lib/db/schema";
import Link from "next/link";

export default function BooksDetailPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { id } = useParams();
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
        setBook(null);
        setIsLoading(true);
        if (typeof id !== "string") {
            setError("不正なIDです");
            setIsLoading(false);
            return;
        }
        fetch(`/api/books/${id}`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setBook(data.data);
                } else {
                    setError(data?.error?.message ?? "取得に失敗しました");
                }
            })
            .catch(() => {
                setError("500: Internal server error");
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleDelete = () => {
        if (typeof id !== "string") return;
        if (!confirm("この書籍を削除しますか？")) return;

        setIsDeleting(true);
        setDeleteError(null);
        fetch(`/api/books/${id}`, { method: "DELETE", credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    router.push("/books");
                } else {
                    setDeleteError(data?.error?.message ?? "削除に失敗しました");
                }
            })
            .catch(() => {
                setDeleteError("500: Internal server error");
            })
            .finally(() => setIsDeleting(false));
    };

    return (
        <div>
            <h1>Book Detail</h1>
            <p>{book?.title}</p>
            <p>{book?.author}</p>
            <p>{book?.publisher}</p>
            <p>{book?.category}</p>
            <p>{book?.quantity}</p>
            <p>{book?.isbn}</p>
            <p>{book?.publicationYear}</p>
            <p>{book?.stock}</p>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {deleteError && <p>{deleteError}</p>}
            <Link href="/books">一覧に戻る</Link>
            {typeof id === "string" && (user?.role === "ADMIN" || user?.role === "STAFF") && (
                <Link href={`/books/${id}/edit`}>編集</Link>
            )}
            {typeof id === "string" && user?.role === "ADMIN" && (
                <button type="button" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "削除中..." : "削除"}
                </button>
            )}
        </div>
    );
}
