import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
    // Оптимизация изображений
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  // Оптимизация производительности
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
    ],
    // Оптимизация сборки
    // optimizeCss: true, // Отключено из-за проблем с critters
  },
  // Компрессия
  compress: true,
  // Оптимизация загрузки
  poweredByHeader: false,
  // Оптимизация статических ресурсов
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  // Оптимизация webpack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Минификация для production
      config.optimization.minimize = true;
      // Оптимизация chunk'ов
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  // Оптимизация TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  // Оптимизация ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Оптимизация output
  output: "standalone",
  // Оптимизация trailing slash
  trailingSlash: false,
  // Оптимизация redirects
  async redirects() {
    return [];
  },
  // Оптимизация headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
