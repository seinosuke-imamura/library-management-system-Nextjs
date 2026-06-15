process.env.JWT_SECRET ??= "test-secret-key-for-vitest";
process.env.DATABASE_URL ??=
  process.env.DATABASE_URL_TEST ??
  "postgresql://user:password@localhost:5432/library_test";
