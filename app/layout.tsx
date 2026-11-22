import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Rüya Gezgini | Rüya Gibi Fiyatlar Bul",
    template: "%s | Rüya Gezgini",
  },
  description:
    "Trendyol, Hepsiburada, Amazon ve daha fazlasından en iyi fiyatları karşılaştır. Rüya gibi fiyatlarla alışveriş yap.",
  keywords: [
    "fiyat karşılaştırma",
    "en ucuz",
    "trendyol",
    "hepsiburada",
    "amazon türkiye",
    "alışveriş",
  ],
  openGraph: {
    title: "Rüya Gezgini | Rüya Gibi Fiyatlar Bul",
    description: "En iyi fiyatları tek yerden karşılaştır",
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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
