import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().min(1),
  isbn: z.string().min(1),
  publicationYear: z.number().min(1),
  stock: z.number().default(0),
});
export type CreateBookSchema = z.infer<typeof createBookSchema>;

export const updateBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().min(1),
  isbn: z.string().min(1),
  publicationYear: z.number().min(1),
  stock: z.number().default(0),
});
export type UpdateBookSchema = z.infer<typeof updateBookSchema>;

export const bookIdParamSchema = z.string().min(1);
export type BookIdParamSchema = z.infer<typeof bookIdParamSchema>;

export const bookSearchQuerySchema = z.object({
  q: z.string().min(1),
});
export type BookSearchQuerySchema = z.infer<typeof bookSearchQuerySchema>;

