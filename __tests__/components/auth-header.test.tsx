import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthHeader } from "@/components/ui/auth-header";

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

// Mock UserMenu component
jest.mock("@/components/ui/user-menu", () => ({
  UserMenu: () => <div data-testid="user-menu">User Menu</div>,
}));

describe("AuthHeader", () => {
  const mockUseAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });
  });

  it("should show loading state when not mounted", () => {
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    render(<AuthHeader />);

    expect(screen.getByRole("generic", { hidden: true })).toBeInTheDocument();
  });

  it("should show loading state when auth is not loaded", () => {
    mockUseAuth.mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
    });

    render(<AuthHeader />);

    expect(screen.getByRole("generic", { hidden: true })).toBeInTheDocument();
  });

  it("should show sign in and sign up buttons when user is not signed in", async () => {
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    render(<AuthHeader />);

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });
  });

  it("should show dashboard link and user menu when user is signed in", async () => {
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    render(<AuthHeader />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    });
  });

  it("should have correct href for dashboard link", async () => {
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    render(<AuthHeader />);

    await waitFor(() => {
      const dashboardLink = screen.getByText("Dashboard");
      expect(dashboardLink.closest("a")).toHaveAttribute("href", "/dashboard");
    });
  });
});
