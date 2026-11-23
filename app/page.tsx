import Link from "next/link";
import { TrendingDown, Shield, Zap, ArrowRight, Flame, Tag, Star, ExternalLink } from "lucide-react";
import { CATEGORIES, formatPrice, discountPercent, PLATFORMS, type Platform } from "@/lib/utils";
import { SearchWidget } from "@/components/search-widget";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rawProducts = await db.product.findMany({
    take: 8,
    orderBy: { viewCount: "desc" },
    include: {
      listings: { orderBy: { currentPrice: "asc" } },
    },
  });

  const dealListings = await db.platformListing.findMany({
    where: { originalPrice: { not: null }, inStock: true },
    include: { product: { include: { listings: { orderBy: { currentPrice: "asc" } } } } },
    take: 50,
  });
  const topDeals = dealListings
    .filter((d) => d.originalPrice && d.originalPrice > d.currentPrice)
    .sort((a, b) => discountPercent(b.originalPrice!, b.currentPrice) - discountPercent(a.originalPrice!, a.currentPrice))
    .slice(0, 4);

  return (
    <div className="bg-gray-50">
      {/* ─── HERO ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase">
              <Zap size={11} className="fill-violet-500" />
              Türkiye'nin Fiyat Karşılaştırma Motoru
            </span>
          </div>
          {/* Heading */}
          <div className="text-center space-y-3 mb-6">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              En Ucuz Fiyatı{" "}
              <span className="relative inline-block" style={{ color: "#7C3AED" }}>
                Anında Bul
                <span
                  className="absolute left-0 -bottom-0.5 w-full h-1 rounded-full"
                  style={{ background: "#F59E0B" }}
                />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto">
              Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti — hepsini tek aramada karşılaştır.
            </p>
          </div>
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-5">
            <SearchWidget />
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            {[
              { icon: <Shield size={13} className="text-green-500" />, text: "Ücretsiz, kayıt yok" },
              { icon: <TrendingDown size={13} className="text-blue-500" />, text: "30 günlük fiyat geçmişi" },
              { icon: <Zap size={13} className="text-amber-500" />, text: "5 platform tek aramada" },
            ].map((b) => (
              <span key={b.text} className="flex items-center gap-1.5">{b.icon}{b.text}</span>
            ))}
          </div>
        </div>

        {/* Platform strip */}
        <div className="border-t border-gray-100 bg-gray-50/80">
          <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider shrink-0">Karşılaştır:</span>
            {[
              { name: "Trendyol", color: "#F27A1A" },
              { name: "Hepsiburada", color: "#FF6000" },
              { name: "Amazon", color: "#FF9900" },
              { name: "N11", color: "#6B3FA0" },
              { name: "Çiçeksepeti", color: "#E91E8C" },
            ].map((p) => (
              <span
                key={p.name}
                className="shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* ─── GÜNÜN FIRSATLARI ─── */}
        {topDeals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Flame size={16} className="text-orange-500 fill-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">Günün Fırsatları</h2>
                  <p className="text-xs text-gray-400">En yüksek indirim oranları</p>
                </div>
              </div>
              <Link href="/firsatlar" className="text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                Tümünü gör <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {topDeals.map((listing) => {
                const platform = PLATFORMS[listing.platform as Platform];
                const disc = discountPercent(listing.originalPrice!, listing.currentPrice);
                return (
                  <div key={listing.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                    {/* Discount header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500">
                      <span className="text-white font-black text-base">-%{disc}</span>
                      <span className="text-xs font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                        {platform?.label ?? listing.platform}
                      </span>
                    </div>
                    {/* Image */}
                    <div className="relative h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {listing.product.listings[0]?.imageUrl ? (
                        <Image
                          src={listing.product.listings[0].imageUrl!}
                          alt={listing.product.name}
                          fill
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-300">
                          <Tag size={28} />
                          <span className="text-xs">Görsel yok</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <Link href={`/urun/${listing.product.slug}`}>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-violet-700 transition-colors leading-snug">
                          {listing.product.name}
                        </p>
                      </Link>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-gray-900">{formatPrice(listing.currentPrice)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(listing.originalPrice!)}</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold">
                        {formatPrice(listing.originalPrice! - listing.currentPrice)} tasarruf
                      </p>
                      {listing.rating && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          {listing.rating.toFixed(1)}
                          {listing.reviewCount && <span className="text-gray-400">({listing.reviewCount.toLocaleString("tr-TR")})</span>}
                        </div>
                      )}
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #F97316, #EF4444)" }}
                      >
                        Fırsata Git <ExternalLink size={12} />
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">Popüler Ürünler</h2>
                <p className="text-xs text-gray-400 mt-0.5">En çok incelenen ürünler</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {rawProducts.map((product) => {
                const listings = product.listings;
                if (!listings.length) return null;
                const best = listings[0];
                const prices = listings.map((l) => l.currentPrice);
                return (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    name={product.name}
                    imageUrl={product.imageUrl ?? listings.find((l) => l.imageUrl)?.imageUrl ?? undefined}
                    brand={product.brand ?? undefined}
                    bestPrice={best.currentPrice}
                    bestPlatform={best.platform as Platform}
                    bestUrl={best.url}
                    originalPrice={best.originalPrice ?? undefined}
                    rating={best.rating ?? undefined}
                    reviewCount={best.reviewCount ?? undefined}
                    platformCount={listings.length}
                    priceMin={Math.min(...prices)}
                    priceMax={Math.max(...prices)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* ─── KATEGORİLER ─── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">Kategoriye Göre Ara</h2>
            <Link href="/kategori" className="text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-600 text-center group-hover:text-violet-700 leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── NEDEN BİZ ─── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-black text-gray-900 text-center mb-7">Neden Rüya Gezginim?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: "🔍", title: "Tek Aramada 5 Platform", desc: "Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti'ni ayrı ayrı dolaşma." },
              { icon: "📉", title: "Fiyat Geçmişi", desc: "30 günlük fiyat değişimini gör. Alım yapmanın tam zamanını hiç kaçırma." },
              { icon: "⚡", title: "Anlık & Ücretsiz", desc: "Kayıt olmadan, ücretsiz. Fiyatlar düzenli güncellenir." },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section
          className="rounded-2xl p-6 sm:p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)" }}
        >
          <h2 className="text-xl sm:text-2xl font-black mb-2">Fırsatları Kaçırma</h2>
          <p className="text-violet-200 text-sm mb-5">Bugün indirime giren ürünleri hemen keşfet.</p>
          <Link
            href="/firsatlar"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-black px-6 py-3 rounded-xl text-sm transition-colors shadow-lg"
          >
            <Flame size={15} className="fill-gray-900" />
            Günün Fırsatları
          </Link>
        </section>
      </div>
    </div>
  );
}
