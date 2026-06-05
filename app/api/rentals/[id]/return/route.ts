import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { books, rentals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireAuth(request);
    if (user instanceof Response) {
        return user;
    }
    const rental = (await db.select().from(rentals).where(eq(rentals.id, (await params).id)))[0];
    if (!rental) {
        return Response.json({success: false, error: {message: "404: Rental not found", code: "NOT_FOUND"}}, {status: 404});
    }
    if (rental.returnDate !== null) {
        return Response.json({success: false, error: {message: "400: Rental already returned", code: "ALREADY_RETURNED"}}, {status: 400});
    }
    
    await db.update(rentals).set({returnDate: new Date().getTime() as number}).where(eq(rentals.id, (await params).id));
    const book = (await db.select().from(books).where(eq(books.id, rental.bookId)))[0];
    await db.update(books).set({stock: book.stock + 1}).where(eq(books.id, rental.bookId));
    return Response.json({success: true, data: {message: "Book returned successfully"}}, {status: 200});
}