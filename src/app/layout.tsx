import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ToastContainer } from "@/components/ui/toast-container";
import { PwaPrompt } from "@/components/layout/pwa-prompt";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AmarShop — Bangladesh's Premium Online Marketplace",
  description:
    "Shop the best deals on electronics, fashion, home goods, beauty & more. Free shipping, cash on delivery, and flash sales daily on AmarShop.",
  keywords: [
    "AmarShop",
    "Daraz",
    "Bangladesh",
    "online shopping",
    "ecommerce",
    "flash sale",
    "BD marketplace",
    "bKash",
    "Nagad",
  ],
  openGraph: {
    title: "AmarShop — Bangladesh's Premium Online Marketplace",
    description:
      "Shop the best deals on electronics, fashion, home goods, beauty & more.",
    type: "website",
    locale: "en_US",
    siteName: "AmarShop",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#a63600",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#a63600" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-background font-sans antialiased pb-16" suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomNav />
        <PwaPrompt />
        <ToastContainer />
      </body>
    </html>
  );
}
