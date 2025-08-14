"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "./button";
import { LogOut, Settings, User } from "lucide-react";
import { useTheme } from "next-themes";

export function UserMenu() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { theme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!mounted || !isLoaded || !user) {
    return (
      <div className="h-10 w-10 animate-pulse bg-muted rounded-full"></div>
    );
  }

  if (!resolvedTheme) {
    return (
      <div className="h-10 w-10 animate-pulse bg-muted rounded-full"></div>
    );
  }

  return (
    <div
      className="relative user-menu-container"
      ref={menuRef}
      suppressHydrationWarning
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.emailAddresses[0]?.emailAddress || "Пользователь"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: theme === "dark" ? "rgb(255 255 255)" : "rgb(0 0 0)",
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                outline: "none",
                cursor: "pointer",
              }}
              disabled
            >
              <Settings className="h-4 w-4" style={{ color: "inherit" }} />
              Управление аккаунтом
            </button>

            <button
              className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-accent"
              style={{
                color: theme === "dark" ? "rgb(255 255 255)" : "rgb(0 0 0)",
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                outline: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark" ? "rgb(31 41 55)" : "hsl(var(--accent))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" style={{ color: "inherit" }} />
              Выйти
            </button>
          </div>

          <div className="p-3 bg-muted/50 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Защищено</span>
              <span>clerk</span>
            </div>
            <div className="text-xs text-destructive font-medium mt-1">
              Режим разработки
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
