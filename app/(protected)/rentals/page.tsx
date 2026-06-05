"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { Rental } from "@/lib/db/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db/schema";
import { Book } from "@/lib/db/schema";

type RentalWithDetail = {
    rental: Rental;
    user: User;
    book: Book;
};

export default function RentalsPage() {
    const { user } = useAuth();
    const [rentals, setRentals] = useState<RentalWithDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [returningRentalId, setReturningRentalId] = useState<string | null>(null);
    const [returningError, setReturningError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (user?.role === "USER") {
            setError("403: Forbidden");
            router.push("/books");
            return;
        }
        setError(null);
        setRentals([]);
        setIsLoading(true);
        fetch("/api/rentals", { credentials: "include" })
        .then(async res => await res.json())
        .then(data => {
            if (data.success) {
                setRentals(data.data as RentalWithDetail[]);
            } else {
                setError(data?.error?.message ?? "取得に失敗しました");
            }
        })
        .catch(error => {
            setError("500: Internal server error");
        })
        .finally(() => setIsLoading(false));
    }, [user, router]);

    const handleReturn = (rentalId: string) => {
        setReturningRentalId(rentalId);
        setReturningError(null);
        fetch(`/api/rentals/${rentalId}/return`, { method: "PUT", credentials: "include" })
        .then(async res => await res.json())
        .then(data => {
            if (data.success) {
                setRentals(prev => prev.filter(r => r.rental.id !== rentalId));
            } else {
                setReturningError(data?.error?.message ?? "返却に失敗しました");
            }
        })
        .catch(error => {
            setReturningError("500: Internal server error");
        })
        .finally(() => setReturningRentalId(null));
    };
    return (
        <div>
            <h1>Rentals</h1>
            {(rentals.length === 0 && !isLoading && !error) && <p>No rentals found</p>}
            {(rentals.length === 0 && isLoading) && <p>Loading...</p>}
            <ul>
                {rentals.map((row) => (
                    <li key={row.rental.id}>
                        <p>{row.user.username}</p>
                        <p>借りた日: {new Date(row.rental.rentedDate).toLocaleDateString("ja-JP")}</p>
                        <p>返却予定日: {new Date(row.rental.dueDate).toLocaleDateString("ja-JP")}</p>
                        {row.rental.returnDate !== null && <p>返却日: {new Date(row.rental.returnDate).toLocaleDateString("ja-JP")}</p>}
                        <Link href={`/books/${row.book.id}`}>{row.book.title}</Link>
                        {row.rental.returnDate === null && <button onClick={() => handleReturn(row.rental.id)} disabled={returningRentalId === row.rental.id}>{returningRentalId === row.rental.id ? "返却中..." : "返却"}</button>}
                    </li>
                ))}
            </ul>
            {error && <p>{error}</p>}
            {returningError && <p>{returningError}</p>}
        </div>  
    );
}