"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";

export function ProtectedHeader() {
  return (
    <div className="flex items-center gap-4 w-full">
      <ThemeToggle />
      <Link
        href="/dashboard"
        className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap text-center"
      >
        Панель управления
      </Link>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
            afterSignOutUrl: "/",
          },
        }}
      />
    </div>
  );
}
