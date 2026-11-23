import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";
import { AdSenseBanner } from "@/components/adsense";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ q?: string; platform?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q ?? "";
  return {
    title: q ? `"${q}" için fiyat karşılaştırması` : "Ürün Ara",
    description: q
      ? `${q} ürününü Trendyol, Hepsiburada, Amazon ve daha fazlasında karşılaştır.`
      : "Fiyat karşılaştır",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const platform = params.platform ?? "all";
  const sort = params.sort ?? "price_asc";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {query && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-orange-600">&ldquo;{query}&rdquo;</span> için
            fiyat karşılaştırması
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Trendyol, Hepsiburada, Amazon ve daha fazlasından en iyi fiyatlar
          </p>
        </div>
      )}

      <AdSenseBanner />

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} platform={platform} sort={sort} />
      </Suspense>

      <AdSenseBanner />
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200">
          <div className="skeleton aspect-square" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-3 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
