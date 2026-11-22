import { db } from "@/lib/db";
import {
  formatPrice,
  discountPercent,
  PLATFORMS,
  type Platform,
} from "@/lib/utils";
import { AdSenseBanner } from "@/components/adsense";
import Link from "next/link";
import { TrendingDown, ExternalLink, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fırsatlar - En Büyük İndirimler",
  description: "Bugünün en büyük indirimleri ve fırsatları. Rüya gibi fiyatlarla alışveriş yap.",
};

export const revalidate = 1800;

export default async function FirsatlarPage() {
  const deals = await db.platformListing.findMany({
    where: {
      originalPrice: { not: null },
      inStock: true,
    },
    orderBy: [
      { currentPrice: "asc" },
    ],
    include: {
      product: true,
    },
    take: 24,
  });

  // Sort by discount percentage
  const withDiscount = deals
    .filter((d) => d.originalPrice && d.originalPrice > d.currentPrice)
    .sort((a, b) => {
      const discA = discountPercent(a.originalPrice!, a.currentPrice);
      const discB = discountPercent(b.originalPrice!, b.currentPrice);
      return discB - discA;
    })
    .slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-3xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <TrendingDown size={28} />
          <h1 className="text-3xl font-bold">Bugünün Fırsatları</h1>
        </div>
        <p className="text-orange-100 text-lg">
          En büyük indirimler, en rüya gibi fiyatlar
        </p>
      </div>

      <AdSenseBanner />

      {withDiscount.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium text-gray-600">Henüz fırsat yok</p>
          <p className="text-sm mt-2">
            Ürün araması yaptıkça fırsatlar burada görünecek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {withDiscount.map((listing) => {
            const platform = PLATFORMS[listing.platform as Platform];
            const disc = discountPercent(listing.originalPrice!, listing.currentPrice);

            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-orange-200 overflow-hidden card-hover"
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 flex items-center justify-between">
                  <span className="font-bold text-lg">-%{disc} İndirim!</span>
                  <span
                    className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full"
                  >
                    {platform?.label ?? listing.platform}
                  </span>
                </div>

                <div className="p-4">
                  <Link href={`/urun/${listing.product.slug}`}>
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-purple-700 transition-colors">
                      {listing.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(listing.currentPrice)}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      {formatPrice(listing.originalPrice!)}
                    </span>
                  </div>

                  <p className="text-green-700 font-semibold text-sm mb-4">
                    {formatPrice(listing.originalPrice! - listing.currentPrice)} tasarruf
                  </p>

                  {listing.rating && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      {listing.rating.toFixed(1)}
                      {listing.reviewCount && (
                        <span className="text-gray-400">
                          ({listing.reviewCount.toLocaleString("tr-TR")} yorum)
                        </span>
                      )}
                    </div>
                  )}

                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    Fırsata Git
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdSenseBanner />
    </div>
  );
}
