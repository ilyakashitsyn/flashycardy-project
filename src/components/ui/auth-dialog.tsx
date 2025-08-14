"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "signin",
}: AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);

  const handleModeChange = (newMode: "signin" | "signup") => {
    setMode(newMode);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">
          {mode === "signin" ? "Вход в систему" : "Регистрация"}
        </DialogTitle>

        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => handleModeChange("signin")}
            className={`px-4 py-2 rounded-md transition-colors text-sm ${
              mode === "signin"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Войти
          </button>
          <button
            onClick={() => handleModeChange("signup")}
            className={`px-4 py-2 rounded-md transition-colors text-sm ${
              mode === "signup"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Регистрация
          </button>
        </div>

        <div className="mt-4">
          {mode === "signin" ? (
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  card: "shadow-none border-0",
                  rootBox: "w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                },
              }}
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  card: "shadow-none border-0",
                  rootBox: "w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                },
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
