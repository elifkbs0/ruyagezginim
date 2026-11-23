"use client";

import { useCompare } from "./compare-store";
import { useRouter } from "next/navigation";
import { GitCompareArrows, X, ArrowRight } from "lucide-react";

export function CompareBar() {
  const { items, remove, clear } = useCompare();
  const router = useRouter();

  if (items.length === 0) return null;

  const goCompare = () => {
    const params = items.map((i) => `p=${encodeURIComponent(i.slug)}`).join("&");
    router.push(`/karsilastir?${params}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-orange-700 font-semibold text-sm shrink-0">
          <GitCompareArrows size={18} />
          Karşılaştır ({items.length}/4)
        </div>

        <div className="flex flex-wrap gap-2 flex-1">
          {items.map((item) => (
            <span
              key={item.slug}
              className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 text-xs font-medium px-3 py-1.5 rounded-full"
            >
              <span className="line-clamp-1 max-w-[160px]">{item.name}</span>
              <button
                onClick={() => remove(item.slug)}
                className="text-orange-400 hover:text-orange-700 shrink-0"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Temizle
          </button>
          <button
            onClick={goCompare}
            disabled={items.length < 2}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Karşılaştır
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
