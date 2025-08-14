"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function ProtectedHeader() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Панель управления
      </Link>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    </div>
  );
}
