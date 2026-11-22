import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/utils";
import { SearchResults } from "@/components/search-results";
import { AdSenseBanner } from "@/components/adsense";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Kategori bulunamadı" };
  return {
    title: `${cat.label} Fiyat Karşılaştırması`,
    description: `${cat.label} kategorisindeki ürünleri Trendyol, Hepsiburada, Amazon ve daha fazlasında karşılaştır.`,
  };
}

export default async function KategoriSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{cat.icon}</span>
          <h1 className="text-2xl font-bold text-gray-900">{cat.label}</h1>
        </div>
        <p className="text-gray-500 text-sm">
          En uygun fiyatlı {cat.label.toLowerCase()} ürünlerini karşılaştır
        </p>
      </div>

      <AdSenseBanner />

      <Suspense
        fallback={
          <div className="text-center py-12 text-purple-500">Yükleniyor...</div>
        }
      >
        <SearchResults query={cat.label} platform="all" sort="price_asc" />
      </Suspense>
    </div>
  );
}
