"use client";

import { PricingTable } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { AuthDialog } from "./auth-dialog";

export function PricingTableWrapper() {
  const { isSignedIn } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const pricingTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSubscribeClick = (event: Event) => {
      // Проверяем, что клик произошел на кнопке подписки
      const target = event.target as HTMLElement;
      const isSubscribeButton =
        target.closest('button[data-testid*="subscribe"]') ||
        target.closest('button[class*="subscribe"]') ||
        target.closest('button[class*="Subscribe"]') ||
        target.closest('[data-testid*="subscribe"]') ||
        target.closest('[class*="subscribe"]') ||
        target.closest('[class*="Subscribe"]') ||
        target.textContent?.toLowerCase().includes("subscribe") ||
        target.textContent?.toLowerCase().includes("get started") ||
        target.textContent?.toLowerCase().includes("start free") ||
        target.textContent?.toLowerCase().includes("upgrade") ||
        target.textContent?.toLowerCase().includes("choose plan");

      if (isSubscribeButton && !isSignedIn) {
        event.preventDefault();
        event.stopPropagation();
        setAuthDialogOpen(true);
      }
    };

    // Добавляем обработчик кликов
    const pricingContainer = pricingTableRef.current;
    if (pricingContainer) {
      pricingContainer.addEventListener("click", handleSubscribeClick, true);
    }

    return () => {
      if (pricingContainer) {
        pricingContainer.removeEventListener(
          "click",
          handleSubscribeClick,
          true
        );
      }
    };
  }, [isSignedIn]);

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
    <>
      <div ref={pricingTableRef}>
        <PricingTable />
      </div>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode="signup"
      />
    </>
  );
}
