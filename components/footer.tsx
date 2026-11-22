import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-purple-950 text-purple-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full dream-gradient flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Rüya<span className="text-amber-400">Gezgini</span>
              </span>
            </div>
            <p className="text-sm text-purple-300 leading-relaxed">
              Trendyol, Hepsiburada, Amazon ve daha fazlasından en iyi
              fiyatları karşılaştır. Rüya gibi fiyatlar, gerçek tasarruf.
            </p>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              {["Elektronik", "Telefon", "Ev & Yaşam", "Moda", "Spor"].map(
                (c) => (
                  <li key={c}>
                    <Link
                      href={`/kategori/${c.toLowerCase().replace(/\s/g, "-")}`}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {c}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Platformlar */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platformlar</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Trendyol",
                "Hepsiburada",
                "Amazon Türkiye",
                "N11",
                "Çiçeksepeti",
              ].map((p) => (
                <li key={p}>
                  <span className="text-purple-300">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hakkında */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hakkımızda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/hakkimizda"
                  className="hover:text-amber-400 transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/gizlilik"
                  className="hover:text-amber-400 transition-colors"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/kullanim"
                  className="hover:text-amber-400 transition-colors"
                >
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link
                  href="/iletisim"
                  className="hover:text-amber-400 transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-purple-400">
          <p>© {new Date().getFullYear()} Rüya Gezgini. Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu site bilgilendirme amaçlıdır. Fiyatlar değişkenlik gösterebilir.
          </p>
        </div>
      </div>
    </footer>
  );
}
