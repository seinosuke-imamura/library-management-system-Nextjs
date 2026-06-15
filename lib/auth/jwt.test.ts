import { SignJWT, jwtVerify } from "jose";
import { describe, expect, it, vi } from "vitest";
import { sign, verify } from "./jwt";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () =>
            Promise.resolve([
              {
                id: "1",
                username: "admin",
                password: "hashed",
                role: "ADMIN",
              },
            ]),
        }),
      }),
    }),
  },
}));

describe("sign", () => {
  it("returns a token whose payload can be verified", async () => {
    const token = await sign({ userId: "1", userRole: "ADMIN" });
    const { payload } = await jwtVerify(token, secret);

    expect(payload.userId).toBe("1");
    expect(payload.userRole).toBe("ADMIN");
  });
});

describe("verify", () => {
  it("returns the user when the token is valid", async () => {
    const token = await sign({ userId: "1", userRole: "ADMIN" });
    const user = await verify(token);

    expect(user.id).toBe("1");
    expect(user.role).toBe("ADMIN");
  });

  it("throws when the token is tampered with", async () => {
    const token = await sign({ userId: "1", userRole: "ADMIN" });
    const [header, payload, signature] = token.split(".");
    const tamperedToken = `${header}.${payload}.${signature}x`;

    await expect(verify(tamperedToken)).rejects.toThrow();
  });

  it("throws when the token is expired", async () => {
    const expiredToken = await new SignJWT({
      userId: "1",
      userRole: "ADMIN",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("0s")
      .sign(secret);

    await expect(verify(expiredToken)).rejects.toThrow();
  });
});
