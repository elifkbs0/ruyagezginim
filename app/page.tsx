import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ExternalLink, Star, TrendingDown, Shield } from "lucide-react";
import { CATEGORIES, formatPrice, discountPercent, PLATFORMS, type Platform } from "@/lib/utils";
import { SearchWidget } from "@/components/search-widget";
import { db } from "@/lib/db";
import { ProductImage } from "@/components/product-image";
import { getTopDeals } from "@/lib/deals";
import { blackFridayDay, campaignYear, CAMPAIGN_PATH, isNovemberInIstanbul } from "@/lib/campaign";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const candidates = await db.product.findMany({
    where: { imageUrl: { not: null }, listings: { some: {} } },
    take: 400,
    orderBy: [{ viewCount: "desc" }, { updatedAt: "desc" }],
    include: {
      listings: { orderBy: { currentPrice: "asc" } },
    },
  });

  // Round-robin across categories so one product type can't fill the grid.
  const byCategory = new Map<string, typeof candidates>();
  for (const p of candidates) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }
  const categoryOrder = [...CATEGORIES.map((c) => c.slug), "genel"].filter((s) => byCategory.has(s));
  const rawProducts: typeof candidates = [];
  for (let round = 0; rawProducts.length < 8 && categoryOrder.some((s) => byCategory.get(s)!.length > round); round++) {
    for (const slug of categoryOrder) {
      const p = byCategory.get(slug)![round];
      if (p && rawProducts.length < 8) rawProducts.push(p);
    }
  }

  const topDeals = await getTopDeals({ limit: 4, perCategory: 1 });

  const heroImages = [
    ...new Set(
      [
        ...topDeals.map((d) => d.image),
        ...rawProducts.map((p) => p.imageUrl ?? p.listings.find((l) => l.imageUrl)?.imageUrl),
      ].filter(Boolean) as string[]
    ),
  ].slice(0, 6);

  return (
    <div className="bg-white">
      {isNovemberInIstanbul() && (
        <Link href={CAMPAIGN_PATH} className="block text-white" style={{ backgroundColor: "#EA580C" }}>
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-center">
            <span>Kasım İndirimleri {campaignYear()} başladı · Black Friday {blackFridayDay(campaignYear())} Kasım</span>
            <ArrowRight size={14} />
          </div>
        </Link>
      )}

      {/* ─── HERO ─── */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="text-sm font-semibold mb-4" style={{ color: "#EA580C" }}>
              Ücretsiz fiyat karşılaştırma
            </p>
            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
              <span style={{ color: "#EA580C" }}>Rüya gibi fiyatlar,</span><br />
              gerçek tasarruf.
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti&apos;ni senin yerine gezeriz. Sen sadece en ucuzunu seç.
            </p>
            <div className="mb-6">
              <SearchWidget />
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-green-500" /> Ücretsiz, kayıt yok</span>
              <span className="flex items-center gap-1.5"><TrendingDown size={13} className="text-blue-500" /> 30 günlük fiyat geçmişi</span>
              <span className="flex items-center gap-1.5" style={{ color: "#EA580C", fontWeight: 600 }}>5 platform</span>
            </div>
          </div>

          {/* Right — floating product images */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {heroImages.length > 0
              ? heroImages.map((src, i) => (
                  <div
                    key={i}
                    className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square"
                    style={{ transform: i % 2 === 1 ? "translateY(12px)" : "none" }}
                  >
                    <ProductImage src={src} alt="Rüya Gezginim" sizes="180px" className="object-contain p-4" />
                  </div>
                ))
              : [0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-2xl aspect-square"
                    style={{ transform: i % 2 === 1 ? "translateY(12px)" : "none" }}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">

        {/* ─── GÜNÜN FIRSATLARI ─── */}
        {topDeals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Günün Fırsatları</h2>
              <Link href="/firsatlar" className="text-sm font-medium flex items-center gap-1" style={{ color: "#EA580C" }}>
                Tümünü gör <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topDeals.map((listing) => {
                const platform = PLATFORMS[listing.platform as Platform];
                const disc = discountPercent(listing.originalPrice!, listing.currentPrice);
                const img = listing.image;
                return (
                  <div key={listing.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <Link href={`/urun/${listing.product.slug}`} className="block relative h-40 bg-gray-50">
                      <ProductImage src={img} alt={listing.product.name} />
                      <span className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: "#EA580C" }}>
                        -%{disc}
                      </span>
                    </Link>
                    <div className="p-3">
                      <p className="text-xs text-gray-500 mb-1">{platform?.label ?? listing.platform}</p>
                      <Link href={`/urun/${listing.product.slug}`}>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 leading-snug mb-2">{listing.product.name}</p>
                      </Link>
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-lg font-black text-gray-900">{formatPrice(listing.currentPrice)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(listing.originalPrice!)}</span>
                      </div>
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold text-white transition-colors"
                        style={{ backgroundColor: "#EA580C" }}
                      >
                        Fırsata Git <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── POPÜLER ÜRÜNLER ─── */}
        {rawProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Popüler Ürünler</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {rawProducts.map((product) => {
                const listings = product.listings;
                if (!listings.length) return null;
                const best = listings[0];
                const img = product.imageUrl ?? listings.find((l) => l.imageUrl)?.imageUrl;
                const disc = best.originalPrice ? discountPercent(best.originalPrice, best.currentPrice) : 0;
                return (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <Link href={`/urun/${product.slug}`} className="block relative h-40 bg-gray-50">
                      <ProductImage src={img} alt={product.name} />
                      {disc > 0 && (
                        <span className="absolute top-2 left-2 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
                          -%{disc}
                        </span>
                      )}
                      {listings.length > 1 && (
                        <span className="absolute top-2 right-2 text-xs font-semibold bg-gray-800 text-white px-2 py-0.5 rounded">
                          {listings.length} mağaza
                        </span>
                      )}
                    </Link>
                    <div className="p-3">
                      {product.brand && <p className="text-xs text-gray-400 mb-0.5 font-medium">{product.brand}</p>}
                      <Link href={`/urun/${product.slug}`}>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 leading-snug mb-2">{product.name}</p>
                      </Link>
                      {best.rating && (
                        <div className="flex items-center gap-1 mb-1.5">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs text-gray-600">{best.rating.toFixed(1)}</span>
                          {best.reviewCount && <span className="text-xs text-gray-400">({best.reviewCount.toLocaleString("tr-TR")})</span>}
                        </div>
                      )}
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-lg font-black text-gray-900">{formatPrice(best.currentPrice)}</span>
                        {best.originalPrice && best.originalPrice > best.currentPrice && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(best.originalPrice)}</span>
                        )}
                      </div>
                      <a
                        href={best.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold text-white transition-colors"
                        style={{ backgroundColor: "#1F2937" }}
                      >
                        En İyi Fiyata Git <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── KATEGORİLER ─── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
            <Link href="/kategori" className="text-sm font-medium flex items-center gap-1" style={{ color: "#EA580C" }}>
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group text-center border border-transparent hover:border-orange-200"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-orange-700 leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── NEDEN RG ─── */}
        <section className="bg-gray-50 rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: "🔍", title: "5 Platform Tek Aramada", desc: "Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti — ayrı ayrı gezmene gerek yok." },
            { icon: "📉", title: "Fiyat Geçmişi", desc: "30 günlük fiyat değişimini gör. Alım yapmanın tam zamanını hiç kaçırma." },
            { icon: "⚡", title: "Anlık & Ücretsiz", desc: "Kayıt olmadan, ücretsiz. Fiyatlar düzenli olarak güncellenir." },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
