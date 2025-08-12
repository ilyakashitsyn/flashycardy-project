"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">FlashyCardy</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Ваша персональная платформа для карточек
        </p>

        <SignedOut>
          <div className="flex gap-4 justify-center">
            <Button
              className="px-6 py-3"
              onClick={() => router.push("/sign-in")}
            >
              Войти
            </Button>
            <Button
              variant="secondary"
              className="px-6 py-3"
              onClick={() => router.push("/sign-up")}
            >
              Регистрация
            </Button>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
