import { describe, expect, it } from "vitest";
import { createBookSchema } from "./book";

const validBook = {
  title: "Test Book",
  author: "Test Author",
  publisher: "Test Publisher",
  category: "Test Category",
  quantity: 5,
  isbn: "978-0000000000",
  publicationYear: 2024,
  stock: 3,
};

describe("createBookSchema", () => {
  it("accepts valid data", () => {
    const result = createBookSchema.safeParse(validBook);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Test Book");
      expect(result.data.stock).toBe(3);
    }
  });

  it("rejects missing required fields", () => {
    const { title: _title, ...invalidBook } = validBook;
    const result = createBookSchema.safeParse(invalidBook);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "title")).toBe(
        true,
      );
    }
  });

  it("rejects empty title", () => {
    const result = createBookSchema.safeParse({
      ...validBook,
      title: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("title");
    }
  });

  it("defaults stock to 0 when omitted", () => {
    const { stock: _stock, ...bookWithoutStock } = validBook;
    const result = createBookSchema.safeParse(bookWithoutStock);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stock).toBe(0);
    }
  });
});
