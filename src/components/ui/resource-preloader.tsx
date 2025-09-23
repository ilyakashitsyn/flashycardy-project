"use client";

import { useEffect } from "react";

interface ResourcePreloaderProps {
  resources: Array<{
    href: string;
    as: "style" | "script" | "image" | "font";
    crossOrigin?: "anonymous" | "use-credentials";
  }>;
}

export function ResourcePreloader({ resources }: ResourcePreloaderProps) {
  useEffect(() => {
    resources.forEach(({ href, as, crossOrigin }) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;

      if (crossOrigin) {
        link.crossOrigin = crossOrigin;
      }

      // Добавляем обработчик для стилей
      if (as === "style") {
        link.onload = () => {
          link.rel = "stylesheet";
        };
      }

      document.head.appendChild(link);
    });

    // Cleanup function
    return () => {
      resources.forEach(({ href }) => {
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      });
    };
  }, [resources]);

  return null;
}

// Предустановленные ресурсы для критических компонентов
export const criticalResources = [
  {
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    as: "style" as const,
    crossOrigin: "anonymous" as const,
  },
];
