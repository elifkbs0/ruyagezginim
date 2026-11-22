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
    <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden card-hover">
      {/* Image */}
      <Link href={`/urun/${slug}`} className="block relative aspect-square bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart size={48} />
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -%{discount}
          </div>
        )}

        {/* Platform count badge */}
        {platformCount > 1 && (
          <div className="absolute top-2 right-2 bg-purple-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {platformCount} mağaza
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3">
        {/* Brand */}
        {brand && (
          <p className="text-xs text-purple-500 font-medium uppercase tracking-wide mb-1">
            {brand}
          </p>
        )}

        {/* Name */}
        <Link href={`/urun/${slug}`}>
          <h3 className="text-sm text-gray-800 font-medium line-clamp-2 mb-2 hover:text-purple-700 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star
              size={12}
              className="text-amber-400 fill-amber-400"
            />
            <span className="text-xs text-gray-600 font-medium">
              {rating.toFixed(1)}
            </span>
            {reviewCount && (
              <span className="text-xs text-gray-400">({reviewCount.toLocaleString("tr-TR")})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(bestPrice)}
            </span>
            {originalPrice && originalPrice > bestPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Platform */}
          <div
            className="inline-flex items-center gap-1 text-xs mt-0.5 px-1.5 py-0.5 rounded"
            style={{ backgroundColor: platform.bg, color: platform.color }}
          >
            {platform.label}
          </div>
        </div>

        {/* Price range if multiple platforms */}
        {platformCount > 1 && priceMax > priceMin && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 bg-green-50 px-2 py-1 rounded-lg">
            <TrendingDown size={11} className="text-green-600" />
            <span>
              {formatPrice(priceMin)} – {formatPrice(priceMax)} ({priceDiff}% fark)
            </span>
          </div>
        )}

        {/* CTA */}
        <a
          href={bestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full text-sm font-semibold py-2 rounded-xl dream-gradient text-white hover:opacity-90 transition-opacity"
        >
          En İyi Fiyata Git
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
