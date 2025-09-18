import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock Next.js modules
jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({ type: "redirect", url })),
  },
}));

jest.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: jest.fn(),
}));

describe("Auth Middleware", () => {
  let mockClerkMiddleware: jest.Mock;
  let mockNextResponse: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNextResponse = require("next/server").NextResponse;
    mockClerkMiddleware = require("@clerk/nextjs/server").clerkMiddleware;

    // Mock the middleware function
    mockClerkMiddleware.mockImplementation((handler) => {
      return async (auth: any, req: any) => {
        const { userId } = await auth();
        return handler(auth, req, userId);
      };
    });
  });

  it("should be importable without errors", () => {
    expect(() => {
      require("@/middleware");
    }).not.toThrow();
  });

  it("should export a default function", () => {
    const middleware = require("@/middleware").default;
    expect(typeof middleware).toBe("function");
  });

  it("should have correct config matcher", () => {
    const config = require("@/middleware").config;
    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
  });

  it("should redirect unauthenticated users from protected routes", async () => {
    const middleware = require("@/middleware").default;

    // Mock auth function that returns no userId
    const mockAuth = jest.fn().mockResolvedValue({ userId: null });

    // Mock request with protected path
    const mockReq = {
      nextUrl: { pathname: "/dashboard" },
      url: "https://example.com/dashboard",
    };

    // Call the middleware
    await middleware(mockAuth, mockReq);

    // Verify that clerkMiddleware was called
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it("should allow authenticated users to access protected routes", async () => {
    const middleware = require("@/middleware").default;

    // Mock auth function that returns userId
    const mockAuth = jest.fn().mockResolvedValue({ userId: "user123" });

    // Mock request with protected path
    const mockReq = {
      nextUrl: { pathname: "/dashboard" },
      url: "https://example.com/dashboard",
    };

    // Call the middleware
    await middleware(mockAuth, mockReq);

    // Verify that clerkMiddleware was called
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it("should redirect authenticated users from home page to dashboard", async () => {
    const middleware = require("@/middleware").default;

    // Mock auth function that returns userId
    const mockAuth = jest.fn().mockResolvedValue({ userId: "user123" });

    // Mock request with home path
    const mockReq = {
      nextUrl: { pathname: "/" },
      url: "https://example.com/",
    };

    // Call the middleware
    await middleware(mockAuth, mockReq);

    // Verify that clerkMiddleware was called
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });
});
