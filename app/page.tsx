import Link from "next/link";
import { TrendingDown, Shield, ArrowRight, ExternalLink, Star } from "lucide-react";
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
    take: 100,
  });

  // Deduplicate by product ID — keep best deal per product
  const seenProducts = new Set<string>();
  const topDeals = dealListings
    .filter((d) => d.originalPrice && d.originalPrice > d.currentPrice)
    .sort((a, b) => discountPercent(b.originalPrice!, b.currentPrice) - discountPercent(a.originalPrice!, a.currentPrice))
    .filter((d) => {
      if (seenProducts.has(d.product.id)) return false;
      seenProducts.add(d.product.id);
      return true;
    })
    .slice(0, 4);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-6 border border-indigo-100">
            Fiyat Karşılaştırma
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-4" style={{ lineHeight: 1.1 }}>
            En Ucuz Fiyatı<br />
            <span style={{ color: "#6D28D9" }}>Anında Bul</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mb-8">
            Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti — 5 platformu tek aramada karşılaştır.
          </p>
          <div className="w-full max-w-2xl mb-8">
            <SearchWidget />
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2"><Shield size={14} className="text-emerald-500" /> Ücretsiz, kayıt yok</span>
            <span className="flex items-center gap-2"><TrendingDown size={14} className="text-blue-500" /> 30 günlük fiyat geçmişi</span>
            <span className="flex items-center gap-2 font-medium text-gray-500">
              {["Trendyol", "Hepsiburada", "Amazon", "N11", "Çiçeksepeti"].join("  ·  ")}
            </span>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* ─── GÜNÜN FIRSATLARI ─── */}
        {topDeals.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Günün Fırsatları</h2>
                <p className="text-gray-400 text-sm mt-1">En yüksek indirim oranları</p>
              </div>
              <Link href="/firsatlar" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Tümünü gör <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topDeals.map((listing) => {
                const platform = PLATFORMS[listing.platform as Platform];
                const disc = discountPercent(listing.originalPrice!, listing.currentPrice);
                const img = listing.product.listings.find((l) => l.imageUrl)?.imageUrl;
                return (
                  <div key={listing.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Top badge row */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                        -%{disc} indirim
                      </span>
                      <span className="text-xs font-semibold text-gray-500">{platform?.label ?? listing.platform}</span>
                    </div>
                    {/* Image */}
                    <Link href={`/urun/${listing.product.slug}`} className="block relative h-44 bg-white">
                      {img ? (
                        <Image src={img} alt={listing.product.name} fill className="object-contain p-4" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">📦</div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link href={`/urun/${listing.product.slug}`}>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-indigo-700 mb-3 leading-snug">{listing.product.name}</p>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-black text-gray-900">{formatPrice(listing.currentPrice)}</span>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(listing.originalPrice!)}</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold mb-3">
                        {formatPrice(listing.originalPrice! - listing.currentPrice)} tasarruf
                      </p>
                      {listing.rating && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="font-medium text-gray-600">{listing.rating.toFixed(1)}</span>
                          {listing.reviewCount && <span>({listing.reviewCount.toLocaleString("tr-TR")} yorum)</span>}
                        </div>
                      )}
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
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
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">Popüler Ürünler</h2>
              <p className="text-gray-400 text-sm mt-1">En çok incelenen ürünler</p>
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
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Kategoriler</h2>
            <Link href="/kategori" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-center"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-700 leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── NEDEN RG ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "🔍", title: "Tek Aramada 5 Platform", desc: "Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti'ni ayrı ayrı dolaşma." },
            { icon: "📉", title: "Fiyat Geçmişi", desc: "30 günlük fiyat değişimini gör. Alım yapmanın tam zamanını hiç kaçırma." },
            { icon: "⚡", title: "Anlık & Ücretsiz", desc: "Kayıt olmadan, ücretsiz. Fiyatlar düzenli olarak güncellenir." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* ─── CTA ─── */}
        <section className="bg-indigo-600 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Fırsatları Kaçırma</h2>
          <p className="text-indigo-200 mb-6">Bugün indirime giren ürünleri hemen keşfet.</p>
          <Link
            href="/firsatlar"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Günün Fırsatları <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
