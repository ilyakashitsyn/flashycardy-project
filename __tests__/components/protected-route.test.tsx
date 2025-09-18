import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Extend expect types
declare module "@jest/expect" {
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("ProtectedRoute", () => {
  const mockUseAuth = require("@clerk/nextjs").useAuth;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });
  });

  it("should show loading state when auth is not loaded", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should show custom fallback when auth is not loaded", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    render(
      <ProtectedRoute fallback={<div>Custom Loading</div>}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Custom Loading")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should redirect when user is not signed in", async () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Redirecting...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children when user is signed in", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should not redirect when user is signed in", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });
});
