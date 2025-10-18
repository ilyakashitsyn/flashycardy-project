"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Button } from "./button";

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
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </DialogTitle>

        <div className="flex gap-2 mb-4 justify-center">
          <Button
            onClick={() => handleModeChange("signin")}
            variant={mode === "signin" ? "default" : "outline"}
            size="sm"
          >
            Sign In
          </Button>
          <Button
            onClick={() => handleModeChange("signup")}
            variant={mode === "signup" ? "default" : "outline"}
            size="sm"
          >
            Sign Up
          </Button>
        </div>

        <div className="mt-4">
          {mode === "signin" ? (
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10 px-4 py-2 rounded-md transition-colors",
                  card: "shadow-none border-0 bg-background",
                  rootBox: "w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formFieldInput: "bg-background border-input text-foreground",
                  formFieldLabel: "text-foreground",
                  footerActionLink: "text-primary hover:text-primary/80",
                  identityPreviewText: "text-foreground",
                  formFieldSuccessText: "text-green-600",
                  formFieldErrorText: "text-destructive",
                },
              }}
            />
          ) : (
            <SignUp
              routing="hash"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10 px-4 py-2 rounded-md transition-colors",
                  card: "shadow-none border-0 bg-background",
                  rootBox: "w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formFieldInput: "bg-background border-input text-foreground",
                  formFieldLabel: "text-foreground",
                  footerActionLink: "text-primary hover:text-primary/80",
                  identityPreviewText: "text-foreground",
                  formFieldSuccessText: "text-green-600",
                  formFieldErrorText: "text-destructive",
                },
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
