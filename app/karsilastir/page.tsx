import { db } from "@/lib/db";
import { formatPrice, discountPercent, PLATFORMS, type Platform } from "@/lib/utils";
import { AdSenseBanner } from "@/components/adsense";
import Link from "next/link";
import { ExternalLink, Star, GitCompareArrows, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Karşılaştır",
  description: "Birden fazla ürünü yan yana karşılaştır, en iyi fiyatı bul.",
  alternates: { canonical: "/karsilastir" },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ p?: string | string[] }>;
}

export default async function KarsilastirPage({ searchParams }: PageProps) {
  const { p } = await searchParams;
  const slugs: string[] = p ? (Array.isArray(p) ? p : [p]).slice(0, 4) : [];

  const products = slugs.length
    ? await db.product.findMany({
        where: { slug: { in: slugs } },
        include: {
          listings: {
            orderBy: { currentPrice: "asc" },
            include: { priceHistory: { orderBy: { recordedAt: "desc" }, take: 1 } },
          },
        },
      })
    : [];

  // Preserve URL order
  const ordered = slugs
    .map((s) => products.find((pr) => pr.slug === s))
    .filter(Boolean) as typeof products;

  // Collect all platforms across selected products
  const allPlatforms = Array.from(
    new Set(ordered.flatMap((p) => p.listings.map((l) => l.platform)))
  ) as Platform[];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold mb-2" style={{ color: "#EA580C" }}>Karşılaştırma</p>
        <h1 className="text-3xl font-black text-gray-900" style={{ letterSpacing: "-0.02em" }}>Ürün karşılaştır</h1>
        <p className="text-gray-500 mt-1">
          Ürün sayfasındaki &quot;Karşılaştır&quot; butonuyla en fazla 4 ürün ekle, yan yana karşılaştır.
        </p>
      </div>

      <AdSenseBanner />

      {ordered.length === 0 ? (
        <div className="text-center py-20">
          <GitCompareArrows size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Henüz ürün eklenmedi</h2>
          <p className="text-gray-500 mb-6">
            Karşılaştırmak istediğin ürünleri ara, ürün sayfasından ekle.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Plus size={18} />
            Ürün Ara
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <td className="w-40 p-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Özellik
                </td>
                {ordered.map((product) => (
                  <td key={product.id} className="p-3 text-center align-top">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4">
                      <Link href={`/urun/${product.slug}`} className="hover:text-orange-600">
                        <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
                        <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
                          {product.name}
                        </p>
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Best price row */}
              <tr className="bg-orange-50">
                <td className="p-3 text-sm font-semibold text-gray-600 rounded-l-xl">En İyi Fiyat</td>
                {ordered.map((product) => {
                  const best = product.listings[0];
                  return (
                    <td key={product.id} className="p-3 text-center">
                      {best ? (
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(best.currentPrice)}
                          </p>
                          {best.originalPrice && (
                            <p className="text-xs text-green-600 font-semibold">
                              -%{discountPercent(best.originalPrice, best.currentPrice)} indirim
                            </p>
                          )}
                          <p className="text-xs text-orange-600 font-medium mt-1">
                            {PLATFORMS[best.platform as Platform]?.label ?? best.platform}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Rating row */}
              <tr>
                <td className="p-3 text-sm font-semibold text-gray-600">Puan</td>
                {ordered.map((product) => {
                  const best = product.listings[0];
                  return (
                    <td key={product.id} className="p-3 text-center">
                      {best?.rating ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span className="font-semibold">{best.rating.toFixed(1)}</span>
                          {best.reviewCount && (
                            <span className="text-xs text-gray-400">
                              ({best.reviewCount.toLocaleString("tr-TR")})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Per-platform rows */}
              {allPlatforms.map((platform) => (
                <tr key={platform} className="border-t border-gray-100">
                  <td className="p-3 text-sm font-semibold text-gray-600">
                    {PLATFORMS[platform]?.label ?? platform}
                  </td>
                  {ordered.map((product) => {
                    const listing = product.listings.find((l) => l.platform === platform);
                    return (
                      <td key={product.id} className="p-3 text-center">
                        {listing ? (
                          <div>
                            <p className="font-semibold text-gray-800">
                              {formatPrice(listing.currentPrice)}
                            </p>
                            <a
                              href={listing.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 mt-1"
                            >
                              Git <ExternalLink size={10} />
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm">Yok</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Category */}
              <tr className="border-t border-gray-100 bg-gray-50">
                <td className="p-3 text-sm font-semibold text-gray-600 rounded-l-xl">Kategori</td>
                {ordered.map((product) => (
                  <td key={product.id} className="p-3 text-center text-sm text-gray-600">
                    {product.category}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <AdSenseBanner />
    </div>
  );
}
