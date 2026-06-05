"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { Rental } from "@/lib/db/schema";

export default function RentalsMyPage() {
    const { user } = useAuth();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [returningRentalId, setReturningRentalId] = useState<string | null>(null);
    const [returningError, setReturningError] = useState<string | null>(null);

    const handleReturn = (rentalId: string) => {
        setReturningRentalId(rentalId);
        setReturningError(null);
        fetch(`/api/rentals/${rentalId}/return`, { method: "PUT", credentials: "include" })
        .then(async res => await res.json())
        .then(data => {
            if (data.success) {
                setRentals(prev => prev.filter(rental => rental.id !== rentalId));
            } else {
                setReturningError(data?.error?.message ?? "返却に失敗しました");
            }
        })
        .catch(error => {
            setReturningError("500: Internal server error");
        })
        .finally(() => setReturningRentalId(null));
    };

    useEffect(() => {
        setError(null);
        setRentals([]);
        setIsLoading(true);
        fetch("/api/rentals/my", { credentials: "include" })
        .then(async res => await res.json())
        .then(data => {
            if (data.success) {
                setRentals(data.data);
            } else {
                setError(data?.error?.message ?? "取得に失敗しました");
            }
        })
        .catch(error => {
            setError("500: Internal server error");
        })
        .finally(() => setIsLoading(false));
    }, [user?.id]); 
    return (
        <div>
            <h1>Rentals</h1>
            {(rentals.length === 0 && !isLoading && !error) && <p>No rentals found</p>}
            {(rentals.length === 0 && isLoading) && <p>Loading...</p>}
            {rentals.map((rental) => (
                <div key={rental.id}>
                    <p>{rental.bookId}</p>
                    <p>{rental.rentedDate}</p>
                    <p>{rental.dueDate}</p>
                    <p>{rental.returnDate}</p>
                </div>
            ))}
            {rentals.filter(rental => rental.returnDate === null).map((rental) => (
                <button key={rental.id} onClick={() => handleReturn(rental.id)} disabled={returningRentalId === rental.id}>{returningRentalId === rental.id ? "返却中..." : "返却"}</button>
                
            ))}
        {error && <p>{error}</p>}
        {returningError && <p>{returningError}</p>}
        </div>
    );
}
