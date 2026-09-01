"use client";

import React, { useState } from "react";
import type { Product, ProductVariant, SizeGuide } from "@/lib/products/types";
import { ProductSizeSelector } from "./ProductSizeSelector";
import { ProductAvailability } from "./ProductAvailability";
import { useCart } from "@/components/cart/CartProvider";
import { DevCartPreview } from "@/components/dev/DevCartPreview";

interface ProductActionsProps {
  product?: Product;
  variants?: ProductVariant[];
  sizeGuide?: SizeGuide | null;
  className?: string;
}

export function ProductActions({
  product,
  variants = [],
  sizeGuide = null,
  className = "",
}: ProductActionsProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // If a product currently has no configured variants/sizes:
  // Cleanly omit the size selector and CTA entirely rather than displaying a false "UNAVAILABLE" / "OUT OF STOCK"
  if (!variants || variants.length === 0) {
    return null;
  }

  const isOutOfStock = selectedVariant?.stockStatus === "out_of_stock";
  const isUnavailable = selectedVariant?.stockStatus === "unavailable";

  // Real inventory eligibility logic:
  // - A variant must be selected
  // - AND inventory must be confirmed as in_stock or low_stock
  // - If inventory is "unknown", the CTA remains disabled / non-transactional
  const isStockConfirmed =
    selectedVariant?.stockStatus === "in_stock" ||
    selectedVariant?.stockStatus === "low_stock";

  const isEligible = selectedVariant !== null && isStockConfirmed;

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!isEligible || !selectedVariant || !product) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      displayName: product.officialName ?? product.workingName,
      thumbnail: product.thumbnail,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      unitPrice: product.price ?? null,
      currency: product.currency,
      stockStatus: selectedVariant.stockStatus,
      maxQuantity: selectedVariant.stockQuantity ?? null,
    });
  };

  const getButtonText = () => {
    if (!selectedVariant) return "SELECT SIZE";
    if (isOutOfStock) return "OUT OF STOCK";
    if (isUnavailable) return "UNAVAILABLE";
    return "ADD TO BAG";
  };

  return (
    <div className={`flex flex-col gap-5 mt-6 ${className}`}>
      {/* ── Real Data-Driven Size Selector & Guide ── */}
      <ProductSizeSelector
        variants={variants}
        sizeGuide={sizeGuide}
        selectedVariantId={selectedVariant?.id ?? null}
        onSelectVariant={handleSelectVariant}
      />

      {/* ── Status Indicator (Only when verified by confirmed data) ── */}
      {selectedVariant && selectedVariant.stockStatus !== "unknown" && (
        <ProductAvailability status={selectedVariant.stockStatus} />
      )}

      {/* ── Action CTA (Connected to CartProvider) ── */}
      <button
        type="button"
        disabled={!isEligible}
        aria-disabled={!isEligible}
        onClick={handleAddToCart}
        className={`w-full py-4 px-6 rounded-lg text-[11px] tracking-[0.24em] uppercase font-semibold select-none text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] ${
          isEligible
            ? "bg-[var(--m-gold)] text-[var(--m-dark)] shadow-[0_4px_20px_rgba(251,133,0,0.4)] hover:bg-[var(--m-yellow)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            : "bg-[rgba(245,244,238,0.06)] border border-[rgba(245,244,238,0.1)] text-[rgba(245,244,238,0.35)] cursor-not-allowed"
        }`}
      >
        {getButtonText()}
      </button>

      {/* ── Development-Only Preview Control (Omitted in production builds) ── */}
      {product && (
        <DevCartPreview product={product} selectedVariant={selectedVariant} />
      )}
    </div>
  );
}
