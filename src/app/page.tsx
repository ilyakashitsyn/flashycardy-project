"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

// Подключаем дизайн-токены и утилиты из @mainpage
import "@/mainpage/index.css";

// Импорт секций лендинга из @mainpage
import Header from "@/mainpage/components/Header";
import HeroSection from "@/mainpage/components/HeroSection";
import FeaturesSection from "@/mainpage/components/FeaturesSection";
import HowItWorksSection from "@/mainpage/components/HowItWorksSection";
import PricingSection from "@/mainpage/components/PricingSection";
import CtaSection from "@/mainpage/components/CtaSection";
// import Footer from "@/mainpage/components/Footer";

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
      <Header />
      <div className="relative z-10">
        {/* Переиспользуем готовые секции из @mainpage */}
        {/* Оборачиваем CTA-кнопки в Clerk для функциональности */}
        <HeroSection />

        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />

        <CtaSection />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
