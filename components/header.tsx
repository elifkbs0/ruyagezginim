"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ background: "#6D28D9" }}
            >
              R
            </div>
            <span className="font-black text-lg hidden sm:block" style={{ color: "#111827", letterSpacing: "-0.03em" }}>
              Rüya<span style={{ color: "#6D28D9" }}>Gezginim</span>
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
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
            <Link href="/kategori" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Kategoriler
            </Link>
            <Link href="/firsatlar" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Fırsatlar
            </Link>
            <Link
              href="/karsilastir"
              className="ml-1 text-sm text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: "#6D28D9" }}
            >
              Karşılaştır
            </Link>
          </nav>

          <button
            className="md:hidden text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-3 space-y-1 bg-white">
          <Link href="/kategori" className="block text-sm text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Kategoriler</Link>
          <Link href="/firsatlar" className="block text-sm text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Fırsatlar</Link>
          <Link href="/karsilastir" className="block text-sm font-semibold py-2.5 px-3 rounded-lg" style={{ color: "#6D28D9" }} onClick={() => setMobileOpen(false)}>Karşılaştır</Link>
        </div>
      )}
    </header>
  );
}
