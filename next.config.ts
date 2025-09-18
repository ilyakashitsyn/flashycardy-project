import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
  // Оптимизация производительности
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tooltip",
    ],
  },
  // Компрессия
  compress: true,
  // Оптимизация загрузки
  poweredByHeader: false,
  // Оптимизация статических ресурсов
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
};

export default nextConfig;
