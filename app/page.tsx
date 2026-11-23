import Link from "next/link";
import { Search, TrendingDown, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";
import { SearchWidget } from "@/components/search-widget";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
          {/* Üst badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Zap size={12} className="fill-amber-500" />
              Türkiye&apos;nin fiyat karşılaştırma motoru
            </span>
          </div>

          <div className="text-center space-y-5">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              En Ucuz Fiyatı{" "}
              <span
                className="relative inline-block"
                style={{ color: "#6C3FC5" }}
              >
                Anında Bul
                <span
                  className="absolute -bottom-1 left-0 w-full h-1 rounded-full"
                  style={{ background: "#F59E0B" }}
                />
              </span>
            </h1>

            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti&apos;ni
              aynı anda karşılaştır. Fiyat geçmişini takip et, en iyi
              anı yakala.
            </p>

            {/* Arama */}
            <div className="max-w-2xl mx-auto">
              <SearchWidget />
            </div>

            {/* Güven sinyalleri */}
            <div className="flex flex-wrap items-center justify-center gap-5 pt-2 text-sm text-gray-500">
              {[
                { icon: <CheckCircle2 size={14} className="text-green-500" />, text: "5 platform karşılaştırması" },
                { icon: <TrendingDown size={14} className="text-blue-500" />, text: "30 günlük fiyat geçmişi" },
                { icon: <Shield size={14} className="text-purple-500" />, text: "Ücretsiz, kayıt yok" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform şeridi */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs text-gray-400 font-medium shrink-0 uppercase tracking-wide">
              Karşılaştırdığımız platformlar:
            </span>
            {[
              { name: "Trendyol", color: "#F27A1A" },
              { name: "Hepsiburada", color: "#FF6000" },
              { name: "Amazon", color: "#FF9900" },
              { name: "N11", color: "#6B3FA0" },
              { name: "Çiçeksepeti", color: "#E91E8C" },
            ].map((p) => (
              <span
                key={p.name}
                className="shrink-0 text-xs font-bold px-3 py-1 rounded bg-white border border-gray-200 shadow-sm"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* Kategoriler */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kategoriye Göre Ara</h2>
              <p className="text-sm text-gray-400 mt-0.5">Ne bulmak istiyorsun?</p>
            </div>
            <Link
              href="/kategori"
              className="text-purple-700 text-sm font-semibold flex items-center gap-1 hover:text-purple-900"
            >
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-purple-700 leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Neden biz? */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
            Neden Rüya Gezgini?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Search size={28} className="text-purple-600" />,
                title: "Tek Aramada 5 Platform",
                desc: "Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti&apos;ni ayrı ayrı dolaşma. Hepsini bir yerden karşılaştır.",
              },
              {
                icon: <TrendingDown size={28} className="text-green-600" />,
                title: "Fiyat Geçmişi Grafiği",
                desc: "Ürünün 30 günlük fiyat değişimini gör. Alım yapmanın tam zamanını hiç kaçırma.",
              },
              {
                icon: <Zap size={28} className="text-amber-500" />,
                title: "Anlık Fiyat Bilgisi",
                desc: "Scraper teknolojimizle fiyatlar düzenli olarak güncellenir. En güncel bilgiyi her zaman görürsün.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Bant */}
        <section
          className="rounded-2xl p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg, #6C3FC5 0%, #4f28a3 100%)" }}
        >
          <h2 className="text-2xl font-bold mb-2">Fırsatları Kaçırma</h2>
          <p className="text-purple-200 mb-5">
            Bugün indirime giren ürünleri hemen keşfet.
          </p>
          <Link
            href="/firsatlar"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Günün Fırsatları <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
