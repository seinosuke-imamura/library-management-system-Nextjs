import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { sign } from "@/lib/auth/jwt";
import {
  ensureTestDatabase,
  getTestDatabaseUrl,
  migrateTestDatabase,
  resetTestDatabase,
} from "@/test/helpers/db";

const mockCookieGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: mockCookieGet,
  })),
}));

describe("app/api/books/route", () => {
  beforeAll(async () => {
    process.env.DATABASE_URL = getTestDatabaseUrl();
    await ensureTestDatabase();
    await migrateTestDatabase();
  }, 30_000);

  beforeEach(async () => {
    vi.clearAllMocks();
    await resetTestDatabase();
  }, 30_000);

  it("GET /api/books returns the book list for authenticated users", async () => {
    const token = await sign({ userId: "1", userRole: "ADMIN" });
    mockCookieGet.mockReturnValue({ value: token });

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/api/books"));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(2);
    expect(json.data[0].title).toBe("Book 1");
  });

  it("POST /api/books returns 401 when unauthenticated", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Book",
          author: "Author",
          publisher: "Publisher",
          category: "Category",
          quantity: 1,
          isbn: "978-1111111111",
          publicationYear: 2025,
          stock: 1,
        }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /api/books returns 201 when ADMIN creates a book", async () => {
    const token = await sign({ userId: "1", userRole: "ADMIN" });
    mockCookieGet.mockReturnValue({ value: token });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Book",
          author: "Author",
          publisher: "Publisher",
          category: "Category",
          quantity: 1,
          isbn: "978-1111111111",
          publicationYear: 2025,
          stock: 1,
        }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data[0].title).toBe("New Book");
  });
});
