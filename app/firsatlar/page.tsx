import { formatPrice, discountPercent, PLATFORMS, type Platform } from "@/lib/utils";
import { AdSenseBanner } from "@/components/adsense";
import { ProductImage } from "@/components/product-image";
import { getTopDeals } from "@/lib/deals";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fırsatlar - En Büyük İndirimler",
  description: "Bugünün en büyük indirimleri ve fırsatları. Rüya gibi fiyatlarla alışveriş yap.",
};

export const dynamic = "force-dynamic";

export default async function FirsatlarPage() {
  const deals = await getTopDeals({ limit: 24, perCategory: 4 });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold mb-2" style={{ color: "#EA580C" }}>
          Günün fırsatları
        </p>
        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
          En büyük indirimler, rüya gibi fiyatlar
        </h1>
        <p className="text-gray-500">İndirim oranına göre sıralı. Her ürün bir kez gösterilir.</p>
      </div>

      <AdSenseBanner />

      {deals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-gray-700">Henüz fırsat yok</p>
          <p className="text-sm text-gray-500 mt-2">Ürün araması yaptıkça fırsatlar burada görünecek.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((listing) => {
            const platform = PLATFORMS[listing.platform as Platform];
            const disc = discountPercent(listing.originalPrice!, listing.currentPrice);
            return (
              <div key={listing.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <Link href={`/urun/${listing.product.slug}`} className="block relative h-44 bg-gray-50">
                  <ProductImage src={listing.image} alt={listing.product.name} />
                  <span className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: "#EA580C" }}>
                    -%{disc}
                  </span>
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-xs text-gray-500 mb-1">{platform?.label ?? listing.platform}</p>
                  <Link href={`/urun/${listing.product.slug}`}>
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 leading-snug mb-2">
                      {listing.product.name}
                    </p>
                  </Link>
                  {listing.rating && (
                    <div className="flex items-center gap-1 mb-1.5 text-xs">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-gray-600">{listing.rating.toFixed(1)}</span>
                      {listing.reviewCount && <span className="text-gray-400">({listing.reviewCount.toLocaleString("tr-TR")})</span>}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-gray-900">{formatPrice(listing.currentPrice)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(listing.originalPrice!)}</span>
                  </div>
                  <p className="text-xs text-green-700 font-semibold mb-3">
                    {formatPrice(listing.originalPrice! - listing.currentPrice)} tasarruf
                  </p>
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: "#EA580C" }}
                  >
                    Fırsata Git <ExternalLink size={11} />
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
