import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock Next.js modules
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
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn(),
  and: jest.fn(),
  count: jest.fn(),
}));

describe("API Auth Protection", () => {
  let mockAuth: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = require("@clerk/nextjs/server").auth;
  });

  describe("Decks API", () => {
    it("should require authentication for GET request", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { GET } = await import("@/app/api/decks/route");

      const mockRequest = new Request("http://localhost:3000/api/decks");
      const response = await GET(mockRequest);

      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to GET decks", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      // Mock database response
      const mockDb = require("@/db").db;
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const { GET } = await import("@/app/api/decks/route");

      const mockRequest = new Request("http://localhost:3000/api/decks");
      const response = await GET(mockRequest);

      expect(response.status).toBe(200);
    });

    it("should require authentication for POST request", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { POST } = await import("@/app/api/decks/route");

      const mockRequest = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        body: JSON.stringify({ name: "Test Deck" }),
      });
      const response = await POST(mockRequest);

      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to create decks", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      // Mock database response
      const mockDb = require("@/db").db;
      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest
            .fn()
            .mockResolvedValue([{ id: 1, name: "Test Deck" }]),
        }),
      });

      const { POST } = await import("@/app/api/decks/route");

      const mockRequest = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        body: JSON.stringify({ name: "Test Deck" }),
      });
      const response = await POST(mockRequest);

      expect(response.status).toBe(201);
    });
  });

  describe("Cards API", () => {
    it("should require authentication for card operations", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { GET } = await import("@/app/api/cards/[cardId]/route");

      const mockRequest = new Request("http://localhost:3000/api/cards/1");
      const response = await GET(mockRequest, { params: { cardId: "1" } });

      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to access cards", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      // Mock database response
      const mockDb = require("@/db").db;
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest
            .fn()
            .mockResolvedValue([{ id: 1, front: "Test", back: "Answer" }]),
        }),
      });

      const { GET } = await import("@/app/api/cards/[cardId]/route");

      const mockRequest = new Request("http://localhost:3000/api/cards/1");
      const response = await GET(mockRequest, { params: { cardId: "1" } });

      expect(response.status).toBe(200);
    });
  });

  describe("Study API", () => {
    it("should require authentication for study sessions", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { GET } = await import("@/app/api/study/[deckId]/route");

      const mockRequest = new Request("http://localhost:3000/api/study/1");
      const response = await GET(mockRequest, { params: { deckId: "1" } });

      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to study", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      // Mock database response
      const mockDb = require("@/db").db;
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const { GET } = await import("@/app/api/study/[deckId]/route");

      const mockRequest = new Request("http://localhost:3000/api/study/1");
      const response = await GET(mockRequest, { params: { deckId: "1" } });

      expect(response.status).toBe(200);
    });
  });
});
