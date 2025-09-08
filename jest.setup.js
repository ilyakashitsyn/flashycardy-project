import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  auth: jest.fn(() => ({
    userId: "test-user-id",
    has: jest.fn(() => true),
  })),
  useUser: jest.fn(() => ({
    user: {
      id: "test-user-id",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    },
    isLoaded: true,
    isSignedIn: true,
  })),
  useAuth: jest.fn(() => ({
    userId: "test-user-id",
    isLoaded: true,
    isSignedIn: true,
  })),
  SignIn: () => <div>Sign In Mock</div>,
  SignUp: () => <div>Sign Up Mock</div>,
  UserButton: () => <div>User Button Mock</div>,
  Protect: ({ children, fallback }) => children || fallback,
}));

// Mock environment variables
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-key";
process.env.CLERK_SECRET_KEY = "test-secret";
