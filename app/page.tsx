import Link from "next/link";
import { TrendingDown, Shield, Zap, ArrowRight, CheckCircle2, Flame } from "lucide-react";
import { CATEGORIES, formatPrice, discountPercent, PLATFORMS, type Platform } from "@/lib/utils";
import { SearchWidget } from "@/components/search-widget";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";
import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Popüler ürünler (en çok görüntülenen, her birinin en ucuz fiyatı ile)
  const rawProducts = await db.product.findMany({
    take: 8,
    orderBy: { viewCount: "desc" },
    include: {
      listings: { orderBy: { currentPrice: "asc" } },
    },
  });

  // Günün fırsatları — en yüksek indirim oranına sahip listinglar
  const dealListings = await db.platformListing.findMany({
    where: { originalPrice: { not: null }, inStock: true },
    include: { product: { include: { listings: { orderBy: { currentPrice: "asc" } } } } },
    take: 50,
  });
  const topDeals = dealListings
    .filter((d) => d.originalPrice && d.originalPrice > d.currentPrice)
    .sort((a, b) => {
      const dA = discountPercent(a.originalPrice!, a.currentPrice);
      const dB = discountPercent(b.originalPrice!, b.currentPrice);
      return dB - dA;
    })
    .slice(0, 4);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Zap size={12} className="fill-amber-500" />
              Türkiye&apos;nin fiyat karşılaştırma motoru
            </span>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              En Ucuz Fiyatı{" "}
              <span className="relative inline-block" style={{ color: "#6C3FC5" }}>
                Anında Bul
                <span className="absolute -bottom-1 left-0 w-full h-1 rounded-full" style={{ background: "#F59E0B" }} />
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti&apos;ni tek aramada karşılaştır.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchWidget />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 pt-1 text-sm text-gray-400">
              {[
                { icon: <CheckCircle2 size={13} className="text-green-500" />, text: "5 platform" },
                { icon: <TrendingDown size={13} className="text-blue-500" />, text: "30 günlük fiyat geçmişi" },
                { icon: <Shield size={13} className="text-purple-500" />, text: "Ücretsiz, kayıt yok" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">{item.icon}{item.text}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Platform şeridi */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs text-gray-400 font-medium shrink-0 uppercase tracking-wide">Karşılaştırdıklarımız:</span>
            {[
              { name: "Trendyol", color: "#F27A1A" },
              { name: "Hepsiburada", color: "#FF6000" },
              { name: "Amazon", color: "#FF9900" },
              { name: "N11", color: "#6B3FA0" },
              { name: "Çiçeksepeti", color: "#E91E8C" },
            ].map((p) => (
              <span key={p.name} className="shrink-0 text-xs font-bold px-3 py-1 rounded bg-white border border-gray-200 shadow-sm" style={{ color: p.color }}>
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ─── GÜNÜN FIRSATLARI ─── */}
        {topDeals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Flame size={22} className="text-orange-500" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Günün Fırsatları</h2>
                  <p className="text-sm text-gray-400 mt-0.5">En yüksek indirim oranları</p>
                </div>
              </div>
              <Link href="/firsatlar" className="text-orange-600 text-sm font-semibold flex items-center gap-1 hover:text-orange-700">
                Tümü <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topDeals.map((listing) => {
                const platform = PLATFORMS[listing.platform as Platform];
                const disc = discountPercent(listing.originalPrice!, listing.currentPrice);
                return (
                  <div key={listing.id} className="bg-white rounded-xl border border-orange-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 flex items-center justify-between">
                      <span className="font-black text-lg">-%{disc}</span>
                      <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded">{platform?.label ?? listing.platform}</span>
                    </div>
                    {listing.product.listings[0]?.imageUrl && (
                      <div className="relative h-32 bg-gray-50">
                        <Image src={listing.product.listings[0].imageUrl!} alt={listing.product.name} fill className="object-contain p-2" unoptimized />
                      </div>
                    )}
                    <div className="p-3 space-y-2">
                      <Link href={`/urun/${listing.product.slug}`}>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-purple-700 transition-colors leading-snug">{listing.product.name}</p>
                      </Link>
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold text-gray-900">{formatPrice(listing.currentPrice)}</span>
                          <span className="text-xs text-gray-400 line-through">{formatPrice(listing.originalPrice!)}</span>
                        </div>
                        <p className="text-xs text-green-700 font-semibold mt-0.5">
                          {formatPrice(listing.originalPrice! - listing.currentPrice)} tasarruf
                        </p>
                      </div>
                      {listing.rating && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          {listing.rating.toFixed(1)}
                          {listing.reviewCount && <span className="text-gray-400">({listing.reviewCount.toLocaleString("tr-TR")})</span>}
                        </div>
                      )}
                      <a href={listing.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full text-sm font-semibold py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                        Fırsata Git <ExternalLink size={13} />
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
              <div>
                <h2 className="text-xl font-bold text-gray-900">Popüler Ürünler</h2>
                <p className="text-sm text-gray-400 mt-0.5">En çok aranan ve incelenen ürünler</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kategoriye Göre Ara</h2>
              <p className="text-sm text-gray-400 mt-0.5">Ne bulmak istiyorsun?</p>
            </div>
            <Link href="/kategori" className="text-purple-700 text-sm font-semibold flex items-center gap-1 hover:text-purple-900">
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/kategori/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-purple-700 leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── NEDEN BİZ ─── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Neden Rüya Gezgini?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: "🔍", title: "Tek Aramada 5 Platform", desc: "Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti'ni ayrı ayrı dolaşma." },
              { icon: "📉", title: "Fiyat Geçmişi Grafiği", desc: "30 günlük fiyat değişimini gör. Alım yapmanın tam zamanını hiç kaçırma." },
              { icon: "⚡", title: "Anlık Bilgi", desc: "Fiyatlar düzenli güncellenir. En güncel bilgiyi her zaman görürsün." },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="rounded-2xl p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg, #6C3FC5 0%, #4f28a3 100%)" }}>
          <h2 className="text-2xl font-bold mb-2">Fırsatları Kaçırma</h2>
          <p className="text-purple-200 mb-5">Bugün indirime giren ürünleri hemen keşfet.</p>
          <Link href="/firsatlar"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors">
            Günün Fırsatları <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
