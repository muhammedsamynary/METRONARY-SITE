"use client";

import type { ProductCategory } from "@/lib/products/types";

interface CategorySelectorProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  counts: Record<ProductCategory, number>;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "tops", label: "TOPS" },
  { id: "shorts", label: "SHORTS" },
];

export function CategorySelector({
  activeCategory,
  onSelectCategory,
  counts,
}: CategorySelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter products by category"
      className="flex items-center gap-3 sm:gap-6 py-6 overflow-x-auto no-scrollbar"
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] ${
              isActive
                ? "bg-[rgba(255,214,10,0.12)] text-[var(--m-gold)] border border-[rgba(255,214,10,0.35)] shadow-[0_0_12px_rgba(251,133,0,0.15)]"
                : "bg-transparent text-[var(--m-ghost)] hover:text-[var(--m-cream)] border border-transparent hover:border-[rgba(245,244,238,0.12)]"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive
                  ? "bg-[var(--m-gold)] text-[var(--m-dark)]"
                  : "bg-[rgba(245,244,238,0.1)] text-[var(--m-ghost)]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
