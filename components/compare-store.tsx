"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface CompareItem {
  slug: string;
  name: string;
}

interface CompareCtx {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
}

const Ctx = createContext<CompareCtx>({
  items: [],
  add: () => {},
  remove: () => {},
  has: () => false,
  clear: () => {},
});

const KEY = "rg_compare";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (next: CompareItem[]) => {
    setItems(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const add = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.slug === item.slug)) return prev;
      if (prev.length >= 4) return prev;
      const next = [...prev, item];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.slug !== slug);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const clear = useCallback(() => save([]), []);

  return <Ctx.Provider value={{ items, add, remove, has, clear }}>{children}</Ctx.Provider>;
}

export const useCompare = () => useContext(Ctx);
