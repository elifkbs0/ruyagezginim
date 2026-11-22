import Link from "next/link";
import { Search, Zap, Shield, TrendingDown, Star, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";
import { SearchWidget } from "@/components/search-widget";
import { AdSenseBanner } from "@/components/adsense";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent to-purple-900/50" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
              <Zap size={14} className="text-amber-400" />
              Trendyol • Hepsiburada • Amazon • N11 ve daha fazlası
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block">Rüya Gibi</span>
              <span className="block text-amber-400">Fiyatlar Bul</span>
            </h1>

            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Milyonlarca ürünü tek tıkla karşılaştır. En düşük fiyatı, en iyi
              fırsatı anında gör.
            </p>

            {/* Search */}
            <SearchWidget />

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-purple-300 mt-8">
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-400" />
                <span>5+ platform karşılaştırması</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown size={14} className="text-green-400" />
                <span>Fiyat geçmişi takibi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-blue-400" />
                <span>Ücretsiz kullanım</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AdSense Banner */}
        <AdSenseBanner />

        {/* Categories */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kategoriler</h2>
              <p className="text-gray-500 text-sm mt-1">
                Ne aramak istiyorsun?
              </p>
            </div>
            <Link
              href="/kategori"
              className="text-purple-700 text-sm font-medium flex items-center gap-1 hover:text-purple-900"
            >
              Tümü <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-purple-700 transition-colors leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 border-t border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Ürün Ara",
                desc: "Aradığın ürünü, markayı veya kategoriyi arama kutusuna yaz.",
                icon: "🔍",
              },
              {
                step: "2",
                title: "Karşılaştır",
                desc: "5'ten fazla platformdaki fiyatları ve özellikleri yan yana gör.",
                icon: "⚖️",
              },
              {
                step: "3",
                title: "En İyisini Seç",
                desc: "En uygun fiyatı, en yüksek puanlı ürünü bul ve tasarruf et.",
                icon: "✅",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-6 bg-white rounded-2xl border border-purple-100"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="inline-block bg-purple-700 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section className="py-12 border-t border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Hangi Platformları Karşılaştırıyoruz?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "Trendyol", color: "#F27A1A", emoji: "🛍️" },
              { name: "Hepsiburada", color: "#FF6000", emoji: "📦" },
              { name: "Amazon", color: "#FF9900", emoji: "📫" },
              { name: "N11", color: "#6B3FA0", emoji: "🏪" },
              { name: "Çiçeksepeti", color: "#E91E8C", emoji: "🌸" },
            ].map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm"
              >
                <span className="text-xl">{p.emoji}</span>
                <span
                  className="font-semibold"
                  style={{ color: p.color }}
                >
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Second AdSense Banner */}
        <AdSenseBanner />
      </div>
    </div>
  );
}
