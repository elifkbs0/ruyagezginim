"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const POPULAR_SEARCHES = [
  "iPhone 15",
  "Samsung Galaxy",
  "Airfryer",
  "Laptop",
  "Nike Air",
  "PS5",
  "Dyson",
];

export function SearchWidget() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/ara?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-4">
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white rounded-2xl shadow-2xl shadow-purple-900/30 overflow-hidden"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün, marka veya kategori ara..."
          className="flex-1 px-6 py-4 text-gray-800 placeholder:text-gray-400 outline-none text-base"
          autoComplete="off"
        />
        <button
          type="submit"
          className="shrink-0 m-2 px-6 py-3 dream-gradient text-white font-semibold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Search size={18} />
          <span className="hidden sm:inline">Ara</span>
        </button>
      </form>

      {/* Popular searches */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-purple-300 text-sm">Popüler:</span>
        {POPULAR_SEARCHES.map((s) => (
          <button
            key={s}
            onClick={() => router.push(`/ara?q=${encodeURIComponent(s)}`)}
            className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors border border-white/20"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
