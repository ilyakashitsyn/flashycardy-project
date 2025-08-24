"use client";

import { PricingTable } from "@clerk/nextjs";
import { useEffect } from "react";
import styles from "./pricing.module.css";

export default function PricingPage() {
  // Принудительно показываем переключатель Clerk, если он скрыт
  useEffect(() => {
    const showClerkToggle = () => {
      // Ищем все возможные переключатели Clerk
      const selectors = [
        ".cl-pricingTableCardPeriodToggle",
        '[class*="pricingTableCardPeriodToggle"]',
        '[class*="periodToggle"]',
        '[class*="billingToggle"]',
        '[class*="intervalToggle"]',
        ".cl-switchRoot",
        '[class*="switchRoot"]',
      ];

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          const el = element as HTMLElement;
          el.style.display = "flex";
          el.style.visibility = "visible";
          el.style.opacity = "1";
          el.style.position = "static";
          el.style.left = "auto";
          el.style.top = "auto";
          el.style.pointerEvents = "auto";
          el.style.zIndex = "auto";
          el.style.clip = "auto";
          el.style.clipPath = "none";
          el.style.overflow = "visible";
        });
      });

      // Скрываем checkbox input
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        const el = checkbox as HTMLElement;
        el.style.display = "none";
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.position = "absolute";
        el.style.left = "-9999px";
        el.style.top = "-9999px";
        el.style.pointerEvents = "none";
        el.style.zIndex = "-1";
      });
    };

    // Запускаем с задержками для надежности
    const timers = [100, 500, 1000, 2000].map((delay) =>
      setTimeout(showClerkToggle, delay)
    );

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(showClerkToggle);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

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
