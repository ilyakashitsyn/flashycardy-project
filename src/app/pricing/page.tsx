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

  // Перемещаем чекбокс над "Unlimited decks"
  useEffect(() => {
    const positionBillingSwitch = () => {
      // Ищем элемент с текстом "Unlimited decks"
      const unlimitedDecksElement = Array.from(
        document.querySelectorAll("*")
      ).find((el) => {
        const text = el.textContent || "";
        return (
          text.toLowerCase().includes("unlimited") &&
          text.toLowerCase().includes("deck")
        );
      });

      // Ищем исходный billing switch
      const originalBillingSwitch = document.querySelector(
        ".billing-switch-container"
      );

      if (
        unlimitedDecksElement &&
        originalBillingSwitch &&
        !document.querySelector(".positioned-billing-switch") &&
        unlimitedDecksElement.parentNode &&
        unlimitedDecksElement.parentNode.nodeType === Node.ELEMENT_NODE
      ) {
        // Скрываем центральный billing switch
        const centerContainer = originalBillingSwitch.closest(
          ".flex.justify-center"
        ) as HTMLElement;
        if (centerContainer) {
          centerContainer.style.display = "none";
        }

        // Создаем новый чекбокс над "Unlimited decks"
        const newBillingContainer = originalBillingSwitch.cloneNode(
          true
        ) as HTMLElement;
        newBillingContainer.classList.add("positioned-billing-switch");
        newBillingContainer.classList.remove("billing-toggle-wrapper");

        // Безопасная вставка перед элементом "Unlimited decks"
        const parentNode = unlimitedDecksElement.parentNode;
        if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
          try {
            parentNode.insertBefore(newBillingContainer, unlimitedDecksElement);
          } catch (error) {
            console.warn("Не удалось вставить billing switch:", error);
            // Fallback: добавляем в начало родительского элемента
            (parentNode as Element).insertAdjacentElement(
              "afterbegin",
              newBillingContainer
            );
          }
        }

        // Восстанавливаем функциональность
        const newSwitch = newBillingContainer.querySelector(
          'button[role="switch"]'
        ) as HTMLElement;
        if (newSwitch) {
          newSwitch.addEventListener("click", () => {
            const currentState = newSwitch.getAttribute("data-state");
            const newState = currentState === "checked" ? false : true;
            handleBillingToggle(newState);
          });
        }
      }
    };

    // Запускаем с задержками для надежности
    const timers = [500, 1000, 1500, 2000].map((delay) =>
      setTimeout(positionBillingSwitch, delay)
    );

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(positionBillingSwitch);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      observer.disconnect();

      // Очищаем созданные элементы при размонтировании
      const existingSwitch = document.querySelector(
        ".positioned-billing-switch"
      );
      if (existingSwitch) {
        try {
          existingSwitch.remove();
        } catch (error) {
          console.warn("Не удалось удалить positioned billing switch:", error);
        }
      }
    };
  }, [handleBillingToggle]);

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

        {/* Custom Billing Toggle - вставляется вместо cl-pricingTableCardPeriodToggle */}
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
