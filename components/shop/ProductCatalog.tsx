"use client";

import { useState, useMemo } from "react";
import type { Product, ProductCategory } from "@/lib/products/types";
import { CategorySelector } from "./CategorySelector";
import { ProductCatalogItem } from "./ProductCatalogItem";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");

  const counts: Record<ProductCategory, number> = useMemo(() => {
    return {
      all: initialProducts.length,
      tops: initialProducts.filter((p) => p.category === "tops").length,
      shorts: initialProducts.filter((p) => p.category === "shorts").length,
      accessories: initialProducts.filter((p) => p.category === "accessories").length,
    };
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return initialProducts;
    return initialProducts.filter((p) => p.category === activeCategory);
  }, [initialProducts, activeCategory]);

  return (
    <div className="w-full pb-24 sm:pb-32">
      {/* Category Filter Bar */}
      <CategorySelector
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        counts={counts}
      />

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mt-6">
          {filteredProducts.map((product, idx) => (
            <ProductCatalogItem
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm tracking-[0.2em] text-[var(--m-ghost)] uppercase">
            No garments in this category currently.
          </p>
        </div>
      )}
    </div>
  );
}
