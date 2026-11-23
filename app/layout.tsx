import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CompareProvider } from "@/components/compare-store";
import { CompareBar } from "@/components/compare-bar";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const ADSENSE_CLIENT = "ca-pub-8340130505270753";
const DEFAULT_TITLE = "Rüya Gezginim | Rüya Gibi Fiyatlar, Gerçek Tasarruf";
const DEFAULT_DESCRIPTION =
  "Rüya gibi fiyatlar burada! Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti fiyatlarını tek aramada karşılaştır, en ucuzunu Rüya Gezginim ile bul.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "rüya gibi fiyatlar",
    "fiyat karşılaştırma",
    "en ucuz fiyat",
    "indirim",
    "fırsat",
    "trendyol",
    "hepsiburada",
    "amazon türkiye",
    "n11",
    "çiçeksepeti",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: { "google-adsense-account": ADSENSE_CLIENT },
};

export const viewport: Viewport = {
  themeColor: "#EA580C",
};

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/ara?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* Plain tag (not next/script) so the AdSense crawler finds it in the server HTML. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        <JsonLd data={siteJsonLd} />
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
