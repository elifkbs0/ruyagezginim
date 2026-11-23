import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";

const LINK = "text-gray-500 hover:text-orange-600 transition-colors";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black"
                style={{ backgroundColor: "#EA580C" }}
              >
                R
              </span>
              <span className="font-black text-lg" style={{ letterSpacing: "-0.04em" }}>
                <span style={{ color: "#EA580C" }}>Rüya</span>
                <span className="text-gray-900">Gezginim</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Rüya gibi fiyatlar, gerçek tasarruf. Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti fiyatlarını tek
              aramada karşılaştır.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/kategori/${c.slug}`} className={LINK}>
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/kategori" className={LINK}>
                  Tüm kategoriler
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Keşfet</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/firsatlar" className={LINK}>Günün fırsatları</Link></li>
              <li><Link href="/karsilastir" className={LINK}>Ürün karşılaştır</Link></li>
              <li><Link href="/hakkimizda" className={LINK}>Hakkımızda</Link></li>
              <li><Link href="/iletisim" className={LINK}>İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/gizlilik" className={LINK}>Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim" className={LINK}>Kullanım Koşulları</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Rüya Gezginim. Tüm hakları saklıdır.</p>
          <p>Fiyatlar bilgilendirme amaçlıdır, mağazada değişiklik gösterebilir.</p>
        </div>
      </div>
    </footer>
  );
}
