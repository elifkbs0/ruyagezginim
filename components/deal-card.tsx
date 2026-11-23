import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { discountPercent, formatPrice, PLATFORMS, type Platform } from "@/lib/utils";
import type { getTopDeals } from "@/lib/deals";

export type Deal = Awaited<ReturnType<typeof getTopDeals>>[number];

export function DealCard({ deal }: { deal: Deal }) {
  const platform = PLATFORMS[deal.platform as Platform];
  const disc = discountPercent(deal.originalPrice!, deal.currentPrice);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/urun/${deal.product.slug}`} className="block relative h-44 bg-gray-50">
        <ProductImage src={deal.image} alt={deal.product.name} />
        <span className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: "#EA580C" }}>
          -%{disc}
        </span>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-1">{platform?.label ?? deal.platform}</p>
        <Link href={`/urun/${deal.product.slug}`}>
          <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 leading-snug mb-2">{deal.product.name}</p>
        </Link>
        {deal.rating && (
          <div className="flex items-center gap-1 mb-1.5 text-xs">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-gray-600">{deal.rating.toFixed(1)}</span>
            {deal.reviewCount && <span className="text-gray-400">({deal.reviewCount.toLocaleString("tr-TR")})</span>}
          </div>
        )}
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-gray-900">{formatPrice(deal.currentPrice)}</span>
          <span className="text-xs text-gray-400 line-through">{formatPrice(deal.originalPrice!)}</span>
        </div>
        <p className="text-xs text-green-700 font-semibold mb-3">{formatPrice(deal.originalPrice! - deal.currentPrice)} tasarruf</p>
        <a
          href={deal.url}
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
}
