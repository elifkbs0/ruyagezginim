"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Flame, LayoutGrid } from "lucide-react";

export function Header() {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ara?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm"
              style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)" }}
            >
              R
            </div>
            <span className="font-black text-lg hidden sm:block" style={{ letterSpacing: "-0.02em" }}>
              <span style={{ color: "#7C3AED" }}>Rüya</span>
              <span style={{ color: "#F59E0B" }}>Gezginim</span>
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2 hover:border-violet-300 focus-within:border-violet-400 focus-within:bg-white focus-within:shadow-sm transition-all"
          >
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün, marka veya kategori ara..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </form>

          {/* Nav - desktop */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            <Link href="/kategori" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              <LayoutGrid size={14} />
              Kategoriler
            </Link>
            <Link
              href="/firsatlar"
              className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
            >
              <Flame size={14} className="fill-orange-500" />
              Fırsatlar
            </Link>
            <Link
              href="/karsilastir"
              className="ml-1 text-sm text-white px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-90 shadow-sm"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
            >
              Karşılaştır
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          <Link href="/kategori" className="flex items-center gap-2 text-gray-700 font-medium py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
            <LayoutGrid size={16} className="text-gray-500" /> Kategoriler
          </Link>
          <Link href="/firsatlar" className="flex items-center gap-2 text-orange-600 font-semibold py-2.5 px-3 rounded-xl hover:bg-orange-50 transition-colors" onClick={() => setMobileOpen(false)}>
            <Flame size={16} className="fill-orange-500" /> Fırsatlar
          </Link>
          <Link href="/karsilastir" className="flex items-center gap-2 text-violet-700 font-semibold py-2.5 px-3 rounded-xl hover:bg-violet-50 transition-colors" onClick={() => setMobileOpen(false)}>
            Karşılaştır
          </Link>
        </div>
      )}
    </header>
  );
}
