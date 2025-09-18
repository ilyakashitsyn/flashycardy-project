import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthButtons } from "@/components/ui/auth-buttons";

// Mock Next.js Link
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("AuthButtons", () => {
  const mockUseAuth = require("@clerk/nextjs").useAuth;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });
  });

  it("should show sign in and sign up buttons when user is not signed in", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });

    render(<AuthButtons />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("should show dashboard link and user button when user is signed in", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
    });

    render(<AuthButtons />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("should have correct href for dashboard link", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
    });

    render(<AuthButtons />);

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink.closest("a")).toHaveAttribute("href", "/dashboard");
  });

  it("should have correct styling for sign up button", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });

    render(<AuthButtons />);

    const signUpButton = screen.getByText("Sign Up");
    expect(signUpButton).toHaveClass(
      "bg-primary text-primary-foreground rounded-md"
    );
  });

  it("should have correct styling for sign in button", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });

    render(<AuthButtons />);

    const signInButton = screen.getByText("Sign In");
    expect(signInButton).toHaveClass("text-foreground");
  });
});
