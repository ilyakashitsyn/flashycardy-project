"use client";

import { useAuth } from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            FlashyCardy
          </h1>
          <p className="text-xl text-muted-foreground">
            Ваша персональная платформа для карточек
          </p>
        </div>

        {isSignedIn ? (
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Перейти к панели
            </Link>
          </div>
        ) : (
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                Войти
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium">
                Регистрация
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  );
}
