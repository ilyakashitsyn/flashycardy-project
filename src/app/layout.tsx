import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FlashyCardy - Умные карточки для изучения",
  description:
    "Приложение для создания и изучения карточек с использованием современных технологий",
};

// Проверяем, есть ли валидные ключи Clerk
const hasValidClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_demo';

function HeaderContent() {
  if (hasValidClerkKeys) {
    return (
      <>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Войти
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
              Регистрация
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Панель управления
          </Link>
          <div className="flex items-center gap-2">
            <UserButton />
            <SignOutButton>
              <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted">
                Выйти
              </button>
            </SignOutButton>
          </div>
        </SignedIn>
      </>
    );
  }

  // Fallback для сборки без Clerk
  return (
    <Link
      href="/dashboard"
      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      Панель управления
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b border-border bg-background">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link
                href="/"
                className="text-xl font-semibold text-foreground hover:text-muted-foreground"
              >
                FlashyCardy
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <HeaderContent />
              </div>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );

  if (hasValidClerkKeys) {
    return (
      <ClerkProvider
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: "hsl(var(--primary))",
            colorBackground: "hsl(var(--background))",
            colorInputBackground: "hsl(var(--background))",
            colorInputText: "hsl(var(--foreground))",
            colorText: "hsl(var(--foreground))",
            colorTextSecondary: "hsl(var(--muted-foreground))",
            colorNeutral: "hsl(var(--muted))",
            colorSuccess: "hsl(var(--primary))",
            colorWarning: "hsl(var(--destructive))",
            colorDanger: "hsl(var(--destructive))",
            colorBorder: "hsl(var(--border))",
            borderRadius: "var(--radius)",
          },
        }}
      >
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
