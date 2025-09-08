import { describe, it, expect, jest } from "@jest/globals";

// Mock all Next.js modules before importing
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: (init as any)?.status || 200,
    })),
  },
}));

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn(),
  count: jest.fn(),
  and: jest.fn(),
}));

describe("API Routes", () => {
  describe("Decks API", () => {
    it("should be importable", () => {
      // This test just ensures the module can be imported without errors
      expect(() => {
        require("@/app/api/decks/route");
      }).not.toThrow();
    });

    it("should have GET and POST exports", () => {
      const route = require("@/app/api/decks/route");
      expect(typeof route.GET).toBe("function");
      expect(typeof route.POST).toBe("function");
    });
  });
});
