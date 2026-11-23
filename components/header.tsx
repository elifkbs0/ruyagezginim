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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-1.5">
          <span className="font-black text-xl" style={{ color: "#EA580C", letterSpacing: "-0.04em" }}>
            Rüya
          </span>
          <span className="font-black text-xl text-gray-900" style={{ letterSpacing: "-0.04em" }}>
            Gezginim
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-xl flex items-center border border-gray-300 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-400 transition-colors bg-white"
        >
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="text-xs font-semibold text-white px-3 py-1 rounded"
            style={{ backgroundColor: "#EA580C" }}
          >
            Ara
          </button>
        </form>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-5 shrink-0">
          <Link href="/firsatlar" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
            Fırsatlar
          </Link>
          <Link href="/kategori" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
            Kategoriler
          </Link>
          <Link
            href="/karsilastir"
            className="text-sm font-bold text-white px-4 py-1.5 rounded-lg"
            style={{ backgroundColor: "#1F2937" }}
          >
            Karşılaştır
          </Link>
        </nav>

        <button
          className="md:hidden text-gray-500 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-3 space-y-1">
          <Link href="/firsatlar" className="block text-sm text-gray-700 py-2 font-medium" onClick={() => setMobileOpen(false)}>Fırsatlar</Link>
          <Link href="/kategori" className="block text-sm text-gray-700 py-2 font-medium" onClick={() => setMobileOpen(false)}>Kategoriler</Link>
          <Link href="/karsilastir" className="block text-sm font-bold py-2" style={{ color: "#EA580C" }} onClick={() => setMobileOpen(false)}>Karşılaştır</Link>
        </div>
      )}
    </header>
  );
}
