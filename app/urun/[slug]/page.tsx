import { notFound } from "next/navigation";
import { ProductImage } from "@/components/product-image";
import { db } from "@/lib/db";
import {
  formatPrice,
  discountPercent,
  PLATFORMS,
  type Platform,
} from "@/lib/utils";
import { PriceChart } from "@/components/price-chart";
import { AdSenseBanner } from "@/components/adsense";
import { CompareButton } from "@/components/compare-button";
import { ExternalLink, Star, TrendingDown } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return { title: "Ürün bulunamadı" };
  return {
    title: `${product.name} - Fiyat Karşılaştırması`,
    description: `${product.name} ürününü Trendyol, Hepsiburada, Amazon ve daha fazlasında karşılaştır.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      listings: {
        orderBy: { currentPrice: "asc" },
        include: {
          priceHistory: {
            orderBy: { recordedAt: "desc" },
            take: 30,
          },
        },
      },
    },
  });

  if (!product) notFound();

  // Increment view count
  db.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const bestListing = product.listings[0];
  const allPrices = product.listings.map((l) => l.currentPrice);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  // Build price history data for chart
  const chartData: { date: string; platform: string; price: number }[] = [];
  for (const listing of product.listings) {
    for (const h of listing.priceHistory) {
      chartData.push({
        date: h.recordedAt.toISOString().split("T")[0],
        platform: listing.platform,
        price: h.price,
      });
    }
  }

  const mainImage =
    product.imageUrl ??
    product.listings.find((l) => l.imageUrl)?.imageUrl ??
    null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    ...(mainImage && { image: mainImage }),
    description: `${product.name} için en iyi fiyat karşılaştırması. Trendyol, Hepsiburada, Amazon ve daha fazlasında ${formatPrice(minPrice)}'den başlayan fiyatlar.`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: (minPrice / 100).toFixed(2),
      highPrice: (maxPrice / 100).toFixed(2),
      priceCurrency: "TRY",
      offerCount: product.listings.length,
      offers: product.listings.map((l) => ({
        "@type": "Offer",
        price: (l.currentPrice / 100).toFixed(2),
        priceCurrency: "TRY",
        availability: "https://schema.org/InStock",
        url: l.url,
        seller: { "@type": "Organization", name: l.platform },
      })),
    },
    ...(bestListing?.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: bestListing.rating.toFixed(1),
        reviewCount: bestListing.reviewCount ?? 1,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <a href="/" className="hover:text-purple-700">Ana Sayfa</a>
        {" / "}
        <a href={`/kategori/${product.category}`} className="hover:text-purple-700 capitalize">
          {product.category}
        </a>
        {" / "}
        <span className="text-gray-600">{product.name.slice(0, 50)}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Image */}
        <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden h-80">
          <ProductImage src={mainImage} alt={product.name} sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-6" />
        </div>

        {/* Details */}
        <div className="space-y-5">
          {product.brand && (
            <p className="text-purple-600 font-semibold uppercase tracking-wide text-sm">
              {product.brand}
            </p>
          )}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Best price */}
          {bestListing && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                En İyi Fiyat
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(bestListing.currentPrice)}
                </span>
                {bestListing.originalPrice &&
                  bestListing.originalPrice > bestListing.currentPrice && (
                    <>
                      <span className="text-gray-400 line-through text-lg">
                        {formatPrice(bestListing.originalPrice)}
                      </span>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -%
                        {discountPercent(
                          bestListing.originalPrice,
                          bestListing.currentPrice
                        )}
                      </span>
                    </>
                  )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      PLATFORMS[bestListing.platform as Platform]?.bg ?? "#f3f4f6",
                    color:
                      PLATFORMS[bestListing.platform as Platform]?.color ?? "#333",
                  }}
                >
                  {PLATFORMS[bestListing.platform as Platform]?.label ??
                    bestListing.platform}
                </span>
                {bestListing.rating && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    {bestListing.rating.toFixed(1)}
                    {bestListing.reviewCount && (
                      <span className="text-gray-400">
                        ({bestListing.reviewCount.toLocaleString("tr-TR")} yorum)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <a
                href={bestListing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 dream-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                En İyi Fiyata Git
                <ExternalLink size={15} />
              </a>
              <CompareButton slug={product.slug} name={product.name} />
            </div>
          )}

          {/* Price range */}
          {product.listings.length > 1 && maxPrice > minPrice && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <TrendingDown size={16} className="text-green-600" />
              <span>
                Fiyat aralığı:{" "}
                <strong className="text-green-700">{formatPrice(minPrice)}</strong>
                {" – "}
                <span className="text-gray-500">{formatPrice(maxPrice)}</span>
                <span className="text-green-700 font-semibold ml-1">
                  (%
                  {discountPercent(maxPrice, minPrice)} tasarruf imkânı)
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* All platform prices */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Tüm Platformlardaki Fiyatlar
        </h2>
        <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-purple-50 border-b border-purple-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-700">Platform</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700">Fiyat</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700">İndirim</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700">Puan</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {product.listings.map((listing, idx) => {
                const platform = PLATFORMS[listing.platform as Platform];
                const disc = listing.originalPrice
                  ? discountPercent(listing.originalPrice, listing.currentPrice)
                  : 0;
                const isBest = idx === 0;

                return (
                  <tr key={listing.id} className={isBest ? "bg-amber-50" : "hover:bg-gray-50"}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-semibold"
                          style={{ color: platform?.color ?? "#333" }}
                        >
                          {platform?.label ?? listing.platform}
                        </span>
                        {isBest && (
                          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">
                            En İyi
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-gray-900">
                      {formatPrice(listing.currentPrice)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {disc > 0 ? (
                        <span className="text-red-600 font-semibold">-%{disc}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {listing.rating ? (
                        <div className="flex items-center justify-end gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="font-medium">{listing.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-purple-700 font-semibold hover:text-purple-900 border border-purple-200 px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        Git <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Price History Chart */}
      {chartData.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fiyat Geçmişi</h2>
          <div className="bg-white rounded-2xl border border-purple-100 p-5">
            <PriceChart data={chartData} />
          </div>
        </section>
      )}

      <AdSenseBanner />
    </div>
  );
}
