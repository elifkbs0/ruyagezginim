"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, TrendingUp } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg, #6C3FC5, #F59E0B)" }}
            >
              R
            </div>
            <span className="font-black text-base hidden sm:block tracking-tight">
              <span style={{ color: "#6C3FC5" }}>Rüya</span>
              <span style={{ color: "#F59E0B" }}>Gezgini</span>
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 hover:bg-purple-50 focus-within:bg-purple-50 focus-within:ring-2 focus-within:ring-purple-300 transition-colors"
          >
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün, marka veya kategori ara..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </form>

          {/* Nav - desktop */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium shrink-0">
            <Link href="/kategori" className="text-gray-600 hover:text-gray-900 transition-colors">
              Kategoriler
            </Link>
            <Link
              href="/firsatlar"
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              <TrendingUp size={14} />
              Fırsatlar
            </Link>
            <Link
              href="/karsilastir"
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors text-xs"
            >
              Karşılaştır
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 flex flex-col gap-1">
          <Link
            href="/kategori"
            className="text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-50"
            onClick={() => setMobileOpen(false)}
          >
            Kategoriler
          </Link>
          <Link
            href="/firsatlar"
            className="text-amber-600 font-semibold py-2 px-3 rounded-lg hover:bg-amber-50 flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <TrendingUp size={15} />
            Fırsatlar
          </Link>
          <Link
            href="/karsilastir"
            className="text-purple-700 font-semibold py-2 px-3 rounded-lg hover:bg-purple-50"
            onClick={() => setMobileOpen(false)}
          >
            Karşılaştır
          </Link>
        </div>
      )}
    </header>
  );
}
