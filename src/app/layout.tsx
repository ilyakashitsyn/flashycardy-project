import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
