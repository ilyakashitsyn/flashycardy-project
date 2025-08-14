"use client";

import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { UserMenu } from "./user-menu";
import React from "react";

export function AuthHeader() {
  const { isLoaded, isSignedIn } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Панель управления
        </Link>
        <UserMenu />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <SignInButton mode="modal">
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Войти
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
          Регистрация
        </button>
      </SignUpButton>
    </div>
  );
}
