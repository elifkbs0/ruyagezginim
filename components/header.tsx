"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, TrendingUp, Sparkles } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-full dream-gradient flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="text-purple-700">Rüya</span>
              <span className="text-amber-500">Gezgini</span>
            </span>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 hover:bg-purple-50 transition-colors focus-within:bg-purple-50 focus-within:ring-2 focus-within:ring-purple-300"
          >
            <Search size={18} className="text-purple-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün, marka veya kategori ara..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </form>

          {/* Nav links desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium shrink-0">
            <Link
              href="/kategori"
              className="text-gray-600 hover:text-purple-700 transition-colors"
            >
              Kategoriler
            </Link>
            <Link
              href="/firsatlar"
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <TrendingUp size={14} />
              Fırsatlar
            </Link>
            <Link
              href="/karsilastir"
              className="bg-purple-700 text-white px-4 py-1.5 rounded-full hover:bg-purple-800 transition-colors"
            >
              Karşılaştır
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-purple-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 px-4 py-4 flex flex-col gap-3">
          <Link
            href="/kategori"
            className="text-gray-700 font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            Kategoriler
          </Link>
          <Link
            href="/firsatlar"
            className="text-amber-600 font-medium py-2 flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <TrendingUp size={16} />
            Fırsatlar
          </Link>
          <Link
            href="/karsilastir"
            className="text-purple-700 font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            Karşılaştır
          </Link>
        </div>
      )}
    </header>
  );
}
