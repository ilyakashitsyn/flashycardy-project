/**
 * Утилиты для интеграции кастомного переключателя биллинга с Clerk PricingTable
 */

export interface ClerkBillingPeriod {
  monthly: boolean;
  annual: boolean;
}

/**
 * Находит и взаимодействует с нативным переключателем Clerk
 */
export class ClerkBillingIntegration {
  private static readonly CLERK_TOGGLE_SELECTORS = [
    ".cl-pricingTableCardPeriodToggle",
    '[class*="pricingTableCardPeriodToggle"]',
    '[class*="periodToggle"]',
    '[data-testid*="billing"]',
    '[data-testid*="period"]',
  ];

  private static readonly CLERK_INPUT_SELECTORS = [
    '.cl-pricingTableCardPeriodToggle input[type="checkbox"]',
    ".cl-pricingTableCardPeriodToggle button",
    '[class*="pricingTableCardPeriodToggle"] input',
    '[class*="pricingTableCardPeriodToggle"] button',
  ];

  /**
   * Находит нативный переключатель Clerk в DOM
   */
  static findClerkToggle(): HTMLElement | null {
    for (const selector of this.CLERK_TOGGLE_SELECTORS) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        return element;
      }
    }
    return null;
  }

  /**
   * Находит интерактивный элемент (input/button) внутри переключателя Clerk
   */
  static findClerkToggleInput(): HTMLInputElement | HTMLButtonElement | null {
    for (const selector of this.CLERK_INPUT_SELECTORS) {
      const element = document.querySelector(selector) as
        | HTMLInputElement
        | HTMLButtonElement;
      if (element) {
        return element;
      }
    }
    return null;
  }

  /**
   * Получает текущее состояние переключателя Clerk
   */
  static getClerkToggleState(): boolean {
    const input = this.findClerkToggleInput();
    if (input instanceof HTMLInputElement && input.type === "checkbox") {
      return input.checked;
    }

    // Попробуем определить по ARIA атрибутам
    const toggle = this.findClerkToggle();
    if (toggle) {
      const ariaChecked = toggle.getAttribute("aria-checked");
      const dataState = toggle.getAttribute("data-state");

      if (ariaChecked === "true" || dataState === "checked") {
        return true;
      }
    }

    return false;
  }

  /**
   * Синхронизирует наш переключатель с Clerk
   */
  static syncWithClerk(ourState: boolean): void {
    const clerkState = this.getClerkToggleState();

    if (clerkState !== ourState) {
      const input = this.findClerkToggleInput();
      if (input) {
        // Симулируем клик для изменения состояния
        input.click();
      }
    }
  }

  /**
   * Скрывает нативный переключатель Clerk
   */
  static hideClerkToggle(): void {
    const toggle = this.findClerkToggle();
    if (toggle) {
      toggle.style.display = "none";
      toggle.style.visibility = "hidden";
      toggle.style.opacity = "0";
      toggle.style.position = "absolute";
      toggle.style.left = "-9999px";
      toggle.style.top = "-9999px";
      toggle.style.pointerEvents = "none";
      toggle.style.zIndex = "-1";
    }
  }

  /**
   * Создает наблюдатель за изменениями DOM для автоматического скрытия Clerk переключателя
   */
  static createDOMObserver(callback?: () => void): MutationObserver {
    const observer = new MutationObserver(() => {
      this.hideClerkToggle();
      callback?.();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-state", "aria-checked"],
    });

    return observer;
  }

  /**
   * Инициализирует интеграцию с Clerk
   */
  static initialize(onStateChange?: (isAnnual: boolean) => void): () => void {
    // Скрываем переключатель сразу и с задержками
    const timeouts = [0, 100, 500, 1000, 2000];
    timeouts.forEach((delay) => {
      setTimeout(() => this.hideClerkToggle(), delay);
    });

    // Создаем наблюдатель
    const observer = this.createDOMObserver(() => {
      if (onStateChange) {
        const currentState = this.getClerkToggleState();
        onStateChange(currentState);
      }
    });

    // Возвращаем функцию очистки
    return () => observer.disconnect();
  }
}

export default ClerkBillingIntegration;
