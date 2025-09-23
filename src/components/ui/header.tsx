"use client";

import { memo } from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { AuthButtons } from "./auth-buttons";
import { Button } from "./button";

export const Header = memo(function Header() {
  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-foreground">FlashyCardy</h1>
          </Link>
        </div>

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

        <div className="flex items-center space-x-4">
          <AuthButtons />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
});
