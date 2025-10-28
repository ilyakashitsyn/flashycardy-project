"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";
import { AuthButtons } from "./auth-buttons";
import { Button } from "./button";
import { DashboardStats } from "./dashboard-stats";

export const Header = memo(function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const isDashboard = pathname.startsWith("/dashboard");
  const isDeckPage = pathname.startsWith("/decks/");
  const showStats = isDashboard || isDeckPage;
  const isPricingPage = pathname === "/pricing";

  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-foreground">FlashyCardy</h1>
          </Link>
        </div>

        {!showStats ? (
          // Скрываем навигационное меню для залогиненных пользователей на странице pricing
          !(isSignedIn && isPricingPage) && (
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </nav>
          )
        ) : (
          <DashboardStats />
        )}

        <div className="flex items-center space-x-4">
          <AuthButtons />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
});
