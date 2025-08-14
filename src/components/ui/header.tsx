"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { AuthButtons } from "./auth-buttons";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-semibold text-foreground hover:text-muted-foreground"
        >
          FlashyCardy
        </Link>
        
        <div className="flex items-center gap-4">
          <AuthButtons />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
