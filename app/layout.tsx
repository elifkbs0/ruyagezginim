import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CompareProvider } from "@/components/compare-store";
import { CompareBar } from "@/components/compare-bar";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Rüya Gezginim | En Ucuz Fiyatları Karşılaştır",
    template: "%s | Rüya Gezginim",
  },
  description:
    "Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti'nden en ucuz fiyatları tek aramada karşılaştır. Rüya Gezginim ile en iyi fiyatı bul.",
  keywords: [
    "fiyat karşılaştırma",
    "en ucuz",
    "trendyol",
    "hepsiburada",
    "amazon türkiye",
    "alışveriş",
  ],
  openGraph: {
    title: "Rüya Gezginim | En Ucuz Fiyatları Karşılaştır",
    description: "Trendyol, Hepsiburada, Amazon ve daha fazlasını tek aramada karşılaştır.",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8340130505270753" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8340130505270753"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <CompareProvider>
          <Header />
          <main className="min-h-screen pb-16">{children}</main>
          <Footer />
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
