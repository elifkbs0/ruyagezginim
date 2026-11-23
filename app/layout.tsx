import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CompareProvider } from "@/components/compare-store";
import { CompareBar } from "@/components/compare-bar";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Rüya Gezginim | Rüya Gibi Fiyatlar, Gerçek Tasarruf",
    template: "%s | Rüya Gezginim",
  },
  description:
    "Rüya gibi fiyatlar burada! Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti fiyatlarını tek aramada karşılaştır, en ucuzunu Rüya Gezginim ile bul.",
  keywords: [
    "rüya gibi fiyatlar",
    "fiyat karşılaştırma",
    "en ucuz fiyat",
    "indirim",
    "trendyol",
    "hepsiburada",
    "amazon türkiye",
    "n11",
    "çiçeksepeti",
  ],
  openGraph: {
    title: "Rüya Gezginim | Rüya Gibi Fiyatlar, Gerçek Tasarruf",
    description: "Rüya gibi fiyatlar: Trendyol, Hepsiburada, Amazon ve daha fazlasını tek aramada karşılaştır.",
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
