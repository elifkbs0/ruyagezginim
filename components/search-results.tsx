"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { PLATFORMS, type Platform } from "@/lib/utils";
import { SlidersHorizontal, AlertCircle } from "lucide-react";

interface Listing {
  platform: string;
  currentPrice: number;
  originalPrice?: number;
  url: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  category: string;
  listings: Listing[];
}

interface SearchResultsProps {
  query: string;
  platform: string;
  sort: string;
}

export function SearchResults({ query, platform, sort }: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState(platform);
  const [activeSort, setActiveSort] = useState(sort);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    fetch(`/api/ara?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        setLoading(false);
      });
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg font-medium">Ne aramak istiyorsunuz?</p>
        <p className="text-sm mt-2">Yukarıdaki arama kutusuna ürün veya marka adı yazın</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-purple-400">
        <div className="inline-block w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
        <p className="font-medium">Rüya gibi fiyatlar aranıyor...</p>
        <p className="text-sm text-gray-400 mt-1">Tüm platformlar taranıyor</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <AlertCircle size={18} />
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-4">😔</p>
        <p className="text-lg font-medium text-gray-600">Ürün bulunamadı</p>
        <p className="text-sm mt-2">
          &ldquo;{query}&rdquo; için sonuç yok. Farklı bir kelime deneyin.
        </p>
      </div>
    );
  }

  // Filter and sort
  const platformKeys = Object.keys(PLATFORMS) as Platform[];

  let filtered = products;

  if (activePlatform !== "all") {
    filtered = products.filter((p) =>
      p.listings.some((l) => l.platform === activePlatform)
    );
  }

  filtered = [...filtered].sort((a, b) => {
    const aMin = Math.min(...a.listings.map((l) => l.currentPrice).filter(Boolean));
    const bMin = Math.min(...b.listings.map((l) => l.currentPrice).filter(Boolean));
    const aRating = a.listings[0]?.rating ?? 0;
    const bRating = b.listings[0]?.rating ?? 0;

    switch (activeSort) {
      case "price_asc":
        return aMin - bMin;
      case "price_desc":
        return bMin - aMin;
      case "rating":
        return bRating - aRating;
      case "platforms":
        return b.listings.length - a.listings.length;
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-purple-100">
        <SlidersHorizontal size={16} className="text-purple-500" />

        {/* Platform filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActivePlatform("all")}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              activePlatform === "all"
                ? "bg-purple-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-purple-100"
            }`}
          >
            Tümü ({products.length})
          </button>
          {platformKeys.map((p) => {
            const count = products.filter((prod) =>
              prod.listings.some((l) => l.platform === p)
            ).length;
            if (!count) return null;
            return (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  activePlatform === p
                    ? "text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-purple-100"
                }`}
                style={
                  activePlatform === p
                    ? { backgroundColor: PLATFORMS[p].color }
                    : {}
                }
              >
                {PLATFORMS[p].label} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="ml-auto">
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-purple-400 bg-white"
          >
            <option value="price_asc">Fiyat: Ucuzdan Pahalıya</option>
            <option value="price_desc">Fiyat: Pahalıdan Ucuza</option>
            <option value="rating">En Yüksek Puan</option>
            <option value="platforms">En Çok Platform</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-semibold text-gray-700">{filtered.length}</span> ürün bulundu
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => {
          const sortedListings = [...product.listings].sort(
            (a, b) => a.currentPrice - b.currentPrice
          );
          const best = sortedListings[0];
          if (!best) return null;

          const prices = sortedListings.map((l) => l.currentPrice);

          return (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              brand={product.brand}
              imageUrl={product.imageUrl ?? best.imageUrl}
              bestPrice={best.currentPrice}
              bestPlatform={best.platform as Platform}
              bestUrl={best.url}
              originalPrice={best.originalPrice}
              rating={best.rating}
              reviewCount={best.reviewCount}
              platformCount={sortedListings.length}
              priceMin={Math.min(...prices)}
              priceMax={Math.max(...prices)}
            />
          );
        })}
      </div>
    </div>
  );
}
