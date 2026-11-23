import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, TrendingDown, ExternalLink } from "lucide-react";
import { formatPrice, discountPercent, PLATFORMS, type Platform } from "@/lib/utils";

export interface ProductCardProps {
  slug: string;
  name: string;
  imageUrl?: string;
  brand?: string;
  bestPrice: number;
  bestPlatform: Platform;
  bestUrl: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  platformCount: number;
  priceMin: number;
  priceMax: number;
}

export function ProductCard({
  slug,
  name,
  imageUrl,
  brand,
  bestPrice,
  bestPlatform,
  bestUrl,
  originalPrice,
  rating,
  reviewCount,
  platformCount,
  priceMin,
  priceMax,
}: ProductCardProps) {
  const platform = PLATFORMS[bestPlatform];
  const discount = originalPrice ? discountPercent(originalPrice, bestPrice) : 0;
  const priceDiff = priceMax > priceMin ? Math.round(((priceMax - priceMin) / priceMin) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
      {/* Image */}
      <Link href={`/urun/${slug}`} className="block relative aspect-square bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-200">
            <ShoppingCart size={36} />
            <span className="text-xs text-gray-300 font-medium">Görsel yok</span>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            -%{discount}
          </div>
        )}

        {platformCount > 1 && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-semibold px-2 py-0.5 rounded">
            {platformCount} mağaza
          </div>
        )}
      </Link>

      <div className="p-3 space-y-2">
        {brand && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {brand}
          </p>
        )}

        <Link href={`/urun/${slug}`}>
          <h3 className="text-sm text-gray-800 font-medium line-clamp-2 hover:text-purple-700 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {rating && (
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-600 font-medium">{rating.toFixed(1)}</span>
            {reviewCount && (
              <span className="text-xs text-gray-400">({reviewCount.toLocaleString("tr-TR")})</span>
            )}
          </div>
        )}

        {/* Fiyat */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-gray-900">
              {formatPrice(bestPrice)}
            </span>
            {originalPrice && originalPrice > bestPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div
            className="inline-flex items-center text-xs mt-0.5 font-semibold"
            style={{ color: platform.color }}
          >
            {platform.label}&apos;da
          </div>
        </div>

        {platformCount > 1 && priceMax > priceMin && (
          <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
            <TrendingDown size={11} />
            <span>
              {formatPrice(priceMin)} – {formatPrice(priceMax)} (%{priceDiff} tasarruf imkânı)
            </span>
          </div>
        )}

        <a
          href={bestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full text-sm font-semibold py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white transition-colors"
        >
          En İyi Fiyata Git
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
