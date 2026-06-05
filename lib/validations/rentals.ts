import { z } from "zod";

export const createRentalSchema = z.object({
  bookId: z.string().min(1),
});
export type CreateRentalSchema = z.infer<typeof createRentalSchema>;

