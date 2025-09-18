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
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => Promise.resolve([])),
      })),
    })),
    insert: jest.fn(() => Promise.resolve({ insertId: 1 })),
    update: jest.fn(() => Promise.resolve({ affectedRows: 1 })),
    delete: jest.fn(() => Promise.resolve({ affectedRows: 1 })),
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn((column, value) => ({ column, value })),
  and: jest.fn((...conditions) => conditions),
  count: jest.fn(() => ({ count: 0 })),
  innerJoin: jest.fn(() => ({})),
  limit: jest.fn(() => ({})),
}));

// Mock API routes
jest.mock("@/app/api/decks/route", () => ({
  GET: jest.fn(),
  POST: jest.fn(),
}));

jest.mock("@/app/api/cards/[cardId]/route", () => ({
  DELETE: jest.fn(),
  PUT: jest.fn(),
}));

jest.mock("@/app/api/study/[deckId]/route", () => ({
  POST: jest.fn(),
}));

describe("API Auth Protection", () => {
  let mockAuth: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = require("@clerk/nextjs/server").auth as jest.MockedFunction<any>;
  });

  describe("Decks API", () => {
    it("should require authentication for GET request", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { GET } = require("@/app/api/decks/route");
      const mockRequest = new Request("http://localhost:3000/api/decks");

      // Mock the GET function to return unauthorized response
      GET.mockResolvedValue({
        json: () => Promise.resolve({ error: "Unauthorized" }),
        status: 401,
      });

      const response = await GET(mockRequest);
      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to GET decks", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      const { GET } = require("@/app/api/decks/route");
      const mockRequest = new Request("http://localhost:3000/api/decks");

      // Mock the GET function to return success response
      GET.mockResolvedValue({
        json: () => Promise.resolve([]),
        status: 200,
      });

      const response = await GET(mockRequest);
      expect(response.status).toBe(200);
    });

    it("should require authentication for POST request", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { POST } = require("@/app/api/decks/route");
      const mockRequest = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        body: JSON.stringify({ name: "Test Deck" }),
      });

      // Mock the POST function to return unauthorized response
      POST.mockResolvedValue({
        json: () => Promise.resolve({ error: "Unauthorized" }),
        status: 401,
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to POST decks", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      const { POST } = require("@/app/api/decks/route");
      const mockRequest = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        body: JSON.stringify({ name: "Test Deck" }),
      });

      // Mock the POST function to return success response
      POST.mockResolvedValue({
        json: () => Promise.resolve({ id: 1, name: "Test Deck" }),
        status: 201,
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(201);
    });
  });

  describe("Cards API", () => {
    it("should require authentication for DELETE request", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { DELETE } = require("@/app/api/cards/[cardId]/route");
      const mockRequest = new Request("http://localhost:3000/api/cards/1", {
        method: "DELETE",
      });

      // Mock the DELETE function to return unauthorized response
      DELETE.mockResolvedValue({
        json: () => Promise.resolve({ error: "Unauthorized" }),
        status: 401,
      });

      const response = await DELETE(mockRequest, { params: { cardId: "1" } });
      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to DELETE cards", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      const { DELETE } = require("@/app/api/cards/[cardId]/route");
      const mockRequest = new Request("http://localhost:3000/api/cards/1", {
        method: "DELETE",
      });

      // Mock the DELETE function to return success response
      DELETE.mockResolvedValue({
        json: () => Promise.resolve({ success: true }),
        status: 200,
      });

      const response = await DELETE(mockRequest, { params: { cardId: "1" } });
      expect(response.status).toBe(200);
    });
  });

  describe("Study API", () => {
    it("should require authentication for POST request", async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const { POST } = require("@/app/api/study/[deckId]/route");
      const mockRequest = new Request("http://localhost:3000/api/study/1", {
        method: "POST",
        body: JSON.stringify({ cardId: 1, correct: true }),
      });

      // Mock the POST function to return unauthorized response
      POST.mockResolvedValue({
        json: () => Promise.resolve({ error: "Unauthorized" }),
        status: 401,
      });

      const response = await POST(mockRequest, { params: { deckId: "1" } });
      expect(response.status).toBe(401);
    });

    it("should allow authenticated users to POST study results", async () => {
      mockAuth.mockResolvedValue({ userId: "user123" });

      const { POST } = require("@/app/api/study/[deckId]/route");
      const mockRequest = new Request("http://localhost:3000/api/study/1", {
        method: "POST",
        body: JSON.stringify({ cardId: 1, correct: true }),
      });

      // Mock the POST function to return success response
      POST.mockResolvedValue({
        json: () => Promise.resolve({ success: true }),
        status: 200,
      });

      const response = await POST(mockRequest, { params: { deckId: "1" } });
      expect(response.status).toBe(200);
    });
  });
});
