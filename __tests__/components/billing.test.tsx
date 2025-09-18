import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PricingTableWrapper } from "@/components/ui/pricing-table-wrapper";

// Mock Clerk components
jest.mock("@clerk/nextjs", () => ({
  PricingTable: () => <div data-testid="pricing-table">Pricing Table</div>,
  useAuth: jest.fn(),
}));

// Mock AuthDialog
jest.mock("@/components/ui/auth-dialog", () => ({
  AuthDialog: ({ open, onOpenChange }: any) =>
    open ? <div data-testid="auth-dialog">Auth Dialog</div> : null,
}));

describe("PricingTableWrapper", () => {
  const mockUseAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });
  });

  it("should render pricing table", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });

    render(<PricingTableWrapper />);

    expect(screen.getByTestId("pricing-table")).toBeInTheDocument();
  });

  it("should not show auth dialog initially", () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });

    render(<PricingTableWrapper />);

    expect(screen.queryByTestId("auth-dialog")).not.toBeInTheDocument();
  });

  it("should show auth dialog when subscribe button is clicked and user is not signed in", async () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });

    render(<PricingTableWrapper />);

    // Simulate clicking a subscribe button
    const pricingTable = screen.getByTestId("pricing-table");
    const subscribeButton = document.createElement("button");
    subscribeButton.textContent = "Subscribe";
    subscribeButton.setAttribute("data-testid", "subscribe-button");
    pricingTable.appendChild(subscribeButton);

    subscribeButton.click();

    await waitFor(() => {
      expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();
    });
  });

  it("should not show auth dialog when user is signed in", async () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
    });

    render(<PricingTableWrapper />);

    // Simulate clicking a subscribe button
    const pricingTable = screen.getByTestId("pricing-table");
    const subscribeButton = document.createElement("button");
    subscribeButton.textContent = "Subscribe";
    subscribeButton.setAttribute("data-testid", "subscribe-button");
    pricingTable.appendChild(subscribeButton);

    subscribeButton.click();

    await waitFor(() => {
      expect(screen.queryByTestId("auth-dialog")).not.toBeInTheDocument();
    });
  });

  it("should handle different subscribe button text variations", async () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });

    render(<PricingTableWrapper />);

    const pricingTable = screen.getByTestId("pricing-table");

    // Test different button text variations
    const buttonTexts = ["Get Started", "Start Free", "Upgrade", "Choose Plan"];

    for (const text of buttonTexts) {
      const button = document.createElement("button");
      button.textContent = text;
      pricingTable.appendChild(button);

      button.click();

      await waitFor(() => {
        expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();
      });

      // Clean up for next iteration
      pricingTable.removeChild(button);
    }
  });
});
