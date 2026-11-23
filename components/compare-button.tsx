"use client";

import { useCompare } from "./compare-store";
import { GitCompareArrows, Check } from "lucide-react";

interface Props {
  slug: string;
  name: string;
}

export function CompareButton({ slug, name }: Props) {
  const { add, remove, has, items } = useCompare();
  const active = has(slug);
  const full = items.length >= 4 && !active;

  const toggle = () => {
    if (active) remove(slug);
    else add({ slug, name });
  };

  return (
    <button
      onClick={toggle}
      disabled={full}
      className={`flex items-center justify-center gap-2 w-full py-3 font-semibold rounded-xl border transition-colors text-sm
        ${active
          ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
          : full
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
        }`}
    >
      {active ? <Check size={16} /> : <GitCompareArrows size={16} />}
      {active ? "Karşılaştırmaya Eklendi" : full ? "Maks. 4 ürün" : "Karşılaştırmaya Ekle"}
    </button>
  );
}
