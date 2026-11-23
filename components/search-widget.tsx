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
    <div className="w-full space-y-3">
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white rounded-xl border-2 border-orange-500 overflow-hidden"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün, marka veya kategori ara..."
          className="flex-1 px-6 py-4 text-gray-800 placeholder:text-gray-400 outline-none text-base bg-transparent"
          autoComplete="off"
        />
        <button
          type="submit"
          className="shrink-0 m-1.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
        >
          <Search size={18} />
          <span className="hidden sm:inline">Ara</span>
        </button>
      </form>

      {/* Popular searches */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-400 text-sm">Popüler:</span>
        {POPULAR_SEARCHES.map((s) => (
          <button
            key={s}
            onClick={() => router.push(`/ara?q=${encodeURIComponent(s)}`)}
            className="text-sm bg-gray-100 hover:bg-orange-50 hover:text-orange-700 text-gray-600 px-3 py-1 rounded-full transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
