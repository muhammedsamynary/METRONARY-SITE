"use client";

import React from "react";
import type { Product, ProductVariant } from "@/lib/products/types";
import { useCart } from "@/components/cart/CartProvider";

interface DevCartPreviewProps {
  product: Product;
  selectedVariant: ProductVariant | null;
}

/**
 * Development-Only Cart Preview Helper
 *
 * Safety Guarantees:
 * 1. Strictly omitted in production builds (returns null if NODE_ENV !== "development").
 * 2. Does NOT fake commercial state: passes real null prices and real "unknown" stock status.
 * 3. Does NOT alter database values or bypass server-side checkout validation.
 */
export function DevCartPreview({ product, selectedVariant }: DevCartPreviewProps) {
  const { addItem, openCart } = useCart();

  // Compile-time and runtime development guard
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleDevPreviewAdd = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      displayName: product.officialName ?? product.workingName,
      thumbnail: product.thumbnail,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      unitPrice: product.price ?? null, // Preserves real null price
      currency: product.currency,
      stockStatus: selectedVariant.stockStatus, // Preserves real "unknown" status
      maxQuantity: selectedVariant.stockQuantity ?? null,
    });

    openCart();
  };

  return (
    <div className="mt-3 pt-3 border-t border-dashed border-[rgba(251,133,0,0.25)] flex flex-col items-center gap-1.5">
      <button
        type="button"
        disabled={!selectedVariant}
        onClick={handleDevPreviewAdd}
        className={`w-full py-2 px-3 rounded text-[9px] font-mono tracking-[0.2em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
          selectedVariant
            ? "bg-amber-500/10 border border-dashed border-amber-500/50 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 cursor-pointer"
            : "bg-[rgba(245,244,238,0.03)] border border-dashed border-[rgba(245,244,238,0.08)] text-[rgba(245,244,238,0.25)] cursor-not-allowed"
        }`}
        title="Development Only: Preview item in cart and checkout without altering real database state"
      >
        {selectedVariant ? "DEV: PREVIEW IN BAG" : "DEV: SELECT A SIZE TO PREVIEW"}
      </button>

      <span className="text-[8px] font-mono text-amber-400/50 uppercase tracking-widest">
        DEV ONLY • REAL PRICING/STOCK UNMODIFIED
      </span>
    </div>
  );
}
