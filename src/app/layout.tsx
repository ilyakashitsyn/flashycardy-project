import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/ui/header";
import Script from "next/script";
import Head from "next/head";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FlashyCardy - Умные карточки для изучения",
  description:
    "Приложение для создания и изучения карточек с использованием современных технологий",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              card: "shadow-none border-0",
              rootBox: "w-full",
            },
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="flashycardy-theme"
            enableColorScheme
          >
            <Header />
            {children}
          </ThemeProvider>
        </ClerkProvider>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
