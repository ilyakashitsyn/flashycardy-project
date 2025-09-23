"use client";

import { useEffect, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// Ленивая загрузка секций лендинга
const HeroSection = lazy(() => import("@/mainpage/components/HeroSection"));
const FeaturesSection = lazy(
  () => import("@/mainpage/components/FeaturesSection")
);
const HowItWorksSection = lazy(
  () => import("@/mainpage/components/HowItWorksSection")
);
const PricingSection = lazy(
  () => import("@/mainpage/components/PricingSection")
);
const CtaSection = lazy(() => import("@/mainpage/components/CtaSection"));

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Редирект авторизованных пользователей в дэшборд
  useEffect(() => {
    if (isLoaded && isSignedIn) router.push("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  // Отключаем тёмную тему ТОЛЬКО на главной, восстанавливаем при уходе
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    if (hadDark) root.classList.remove("dark");
    return () => {
      if (hadDark) root.classList.add("dark");
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) return null;

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <Suspense
          fallback={
            <div className="h-96 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse rounded-lg" />
          }
        >
          <HeroSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-96 bg-gradient-to-r from-accent/10 to-primary/10 animate-pulse rounded-lg" />
          }
        >
          <FeaturesSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-96 bg-gradient-to-r from-secondary/10 to-accent/10 animate-pulse rounded-lg" />
          }
        >
          <HowItWorksSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-96 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse rounded-lg" />
          }
        >
          <PricingSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-32 bg-gradient-to-r from-accent/10 to-secondary/10 animate-pulse rounded-lg" />
          }
        >
          <CtaSection />
        </Suspense>
      </div>
    </div>
  );
}
