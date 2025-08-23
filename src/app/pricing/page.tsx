"use client";

import { PricingTable } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import { BillingSwitch } from "@/components/ui/billing-switch";
import { ClerkBillingIntegration } from "@/lib/clerk-billing-utils";
import styles from "./pricing.module.css";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Интеграция с Clerk для управления тарифными планами
  const handleBillingToggle = useCallback((isAnnualBilling: boolean) => {
    setIsAnnual(isAnnualBilling);

    // Синхронизируем с Clerk через утилиту
    setTimeout(() => {
      ClerkBillingIntegration.syncWithClerk(isAnnualBilling);
    }, 100);
  }, []);

  // Инициализируем интеграцию с Clerk
  useEffect(() => {
    const cleanup = ClerkBillingIntegration.initialize((clerkState) => {
      // Синхронизируем наше состояние с Clerk, если оно изменилось извне
      if (clerkState !== isAnnual) {
        setIsAnnual(clerkState);
      }
    });

    return cleanup;
  }, [isAnnual]);

  // Скрываем нативный переключатель Clerk
  useEffect(() => {
    const hideClerkToggle = () => {
      // Ищем и скрываем нативный переключатель Clerk
      const clerkToggles = document.querySelectorAll(
        '.cl-pricingTableCardPeriodToggle, [class*="pricingTableCardPeriodToggle"], [class*="billingToggle"], [class*="periodToggle"]'
      );

      clerkToggles.forEach((toggle) => {
        const element = toggle as HTMLElement;
        element.style.display = "none";
        element.style.visibility = "hidden";
        element.style.opacity = "0";
      });
    };

    // Запускаем с задержками для надежности
    const timers = [100, 500, 1000, 1500].map((delay) =>
      setTimeout(hideClerkToggle, delay)
    );

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(hideClerkToggle);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 pt-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of your flashcard learning experience with
            our flexible pricing options
          </p>
        </div>

        {/* Custom Billing Toggle - размещаем перед PricingTable */}
        <div className="flex justify-center mb-8">
          <div className="billing-switch-container flex items-center gap-3 billing-toggle-wrapper">
            <BillingSwitch
              onToggle={handleBillingToggle}
              defaultChecked={isAnnual}
              className="custom-clerk-replacement"
              integrationMode="clerk"
            />
          </div>
        </div>

        {/* Pricing Table */}
        <div className={styles.pricingContainer}>
          <PricingTable />
        </div>

        {/* Footer Text */}
        <div className="text-center mt-12">
          <small className="text-muted-foreground">
            All plans include secure data storage and cross-device
            synchronization
          </small>
        </div>
      </div>
    </div>
  );
}
