"use client";

import React, { useState, useMemo } from "react";
import type { Product, ProductVariant, SizeGuide } from "@/lib/products/types";
import { ProductColorSelector, type ColorOption } from "./ProductColorSelector";
import { ProductSizeSelector, type SizeOption } from "./ProductSizeSelector";
import { ProductAvailability } from "./ProductAvailability";
import { useCart } from "@/components/cart/CartProvider";

interface ProductActionsProps {
  product?: Product;
  variants?: ProductVariant[];
  allVariants?: ProductVariant[];
  availableColors?: string[];
  selectedColor?: string | null;
  onSelectColor?: (color: string) => void;
  sizeGuide?: SizeGuide | null;
  className?: string;
}

/**
 * Check if a variant is available for purchase
 */
function isVariantPurchasable(v?: ProductVariant | null): boolean {
  if (!v || v.active === false) return false;
  if (v.stockStatus === "out_of_stock" || v.stockStatus === "unavailable") return false;
  if (v.stockQuantity !== null && v.stockQuantity !== undefined && v.stockQuantity <= 0) return false;
  return true;
}

export function ProductActions({
  product,
  variants = [],
  allVariants,
  availableColors = [],
  selectedColor: controlledSelectedColor = null,
  onSelectColor,
  sizeGuide = null,
  className = "",
}: ProductActionsProps) {
  const { addItem } = useCart();

  const totalVariants = allVariants ?? variants;

  // Local state for two-way selection
  const [internalSelectedColor, setInternalSelectedColor] = useState<string | null>(
    controlledSelectedColor
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [legacySelectedVariant, setLegacySelectedVariant] = useState<ProductVariant | null>(null);

  // Sync controlled / internal color state
  const selectedColor = controlledSelectedColor ?? internalSelectedColor;

  const hasColors = availableColors && availableColors.length > 0;

  // Collect all unique sizes across active variants
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    const list: string[] = [];
    for (const v of totalVariants) {
      if (v.size && v.size.trim()) {
        const s = v.size.trim();
        if (!set.has(s)) {
          set.add(s);
          list.push(s);
        }
      }
    }
    return list;
  }, [totalVariants]);

  // Compute smart color availability (2-way reverse filtering)
  const colorOptions: ColorOption[] = useMemo(() => {
    return availableColors.map((color) => {
      let disabled = false;
      if (selectedSize) {
        // Reverse check: does this color have a matching purchasable variant for the selected size?
        const match = totalVariants.find(
          (v) =>
            (v.color || "").trim().toLowerCase() === color.trim().toLowerCase() &&
            (v.size || "").trim().toLowerCase() === selectedSize.trim().toLowerCase()
        );
        if (!match || !isVariantPurchasable(match)) {
          disabled = true;
        }
      } else {
        // Are there any purchasable variants for this color?
        const anyPurchasable = totalVariants.some(
          (v) =>
            (v.color || "").trim().toLowerCase() === color.trim().toLowerCase() &&
            isVariantPurchasable(v)
        );
        if (!anyPurchasable) {
          disabled = true;
        }
      }
      return { name: color, disabled };
    });
  }, [availableColors, selectedSize, totalVariants]);

  // Compute smart size availability (forward filtering)
  const sizeOptions: SizeOption[] = useMemo(() => {
    return availableSizes.map((size) => {
      let disabled = false;
      if (selectedColor) {
        // Forward check: does the selected color have a matching purchasable variant for this size?
        const match = totalVariants.find(
          (v) =>
            (v.color || "").trim().toLowerCase() === selectedColor.trim().toLowerCase() &&
            (v.size || "").trim().toLowerCase() === size.trim().toLowerCase()
        );
        if (!match || !isVariantPurchasable(match)) {
          disabled = true;
        }
      } else {
        // Are there any purchasable variants for this size across any color?
        const anyPurchasable = totalVariants.some(
          (v) =>
            (v.size || "").trim().toLowerCase() === size.trim().toLowerCase() &&
            isVariantPurchasable(v)
        );
        if (!anyPurchasable) {
          disabled = true;
        }
      }
      return { size, disabled };
    });
  }, [availableSizes, selectedColor, totalVariants]);

  // Resolve the active variant
  const resolvedVariant: ProductVariant | null = useMemo(() => {
    if (hasColors) {
      if (!selectedColor || !selectedSize) return null;
      return (
        totalVariants.find(
          (v) =>
            (v.color || "").trim().toLowerCase() === selectedColor.trim().toLowerCase() &&
            (v.size || "").trim().toLowerCase() === selectedSize.trim().toLowerCase()
        ) ?? null
      );
    }
    return legacySelectedVariant;
  }, [hasColors, selectedColor, selectedSize, totalVariants, legacySelectedVariant]);

  // Check valid confirmed price
  const hasValidPrice =
    product?.price !== null &&
    product?.price !== undefined &&
    product.price > 0;

  const isOutOfStock = resolvedVariant?.stockStatus === "out_of_stock";
  const isUnavailable = resolvedVariant?.stockStatus === "unavailable";
  const isVariantActive = resolvedVariant?.active !== false;

  const isStockAvailable =
    resolvedVariant?.stockQuantity === null ||
    resolvedVariant?.stockQuantity === undefined ||
    resolvedVariant.stockQuantity > 0;

  const isStockConfirmed =
    (resolvedVariant?.stockStatus === "in_stock" ||
      resolvedVariant?.stockStatus === "low_stock") &&
    isStockAvailable;

  const isEligible =
    resolvedVariant !== null &&
    hasValidPrice &&
    isVariantActive &&
    isStockConfirmed &&
    (!hasColors || (selectedColor !== null && selectedSize !== null));

  // Selection Handlers with Option Preservation
  const handleSelectColor = (newColor: string) => {
    // If a size was already selected, check if (newColor, selectedSize) is possible & purchasable
    if (selectedSize) {
      const match = totalVariants.find(
        (v) =>
          (v.color || "").trim().toLowerCase() === newColor.trim().toLowerCase() &&
          (v.size || "").trim().toLowerCase() === selectedSize.trim().toLowerCase()
      );
      if (!match || !isVariantPurchasable(match)) {
        // Clear impossible size selection
        setSelectedSize(null);
      }
    }
    setInternalSelectedColor(newColor);
    onSelectColor?.(newColor);
  };

  const handleSelectSize = (newSize: string) => {
    // If a color was already selected, check if (selectedColor, newSize) is possible & purchasable
    if (selectedColor) {
      const match = totalVariants.find(
        (v) =>
          (v.color || "").trim().toLowerCase() === selectedColor.trim().toLowerCase() &&
          (v.size || "").trim().toLowerCase() === newSize.trim().toLowerCase()
      );
      if (!match || !isVariantPurchasable(match)) {
        // Clear impossible color selection
        setInternalSelectedColor(null);
        onSelectColor?.("");
      }
    }
    setSelectedSize(newSize);
  };

  const handleLegacySelectVariant = (variant: ProductVariant) => {
    setLegacySelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!isEligible || !resolvedVariant || !product) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      displayName: product.officialName ?? product.workingName,
      thumbnail: product.thumbnail,
      variantId: resolvedVariant.id,
      size: resolvedVariant.size,
      color: resolvedVariant.color ?? null,
      unitPrice: product.price ?? null,
      currency: product.currency,
      stockStatus: resolvedVariant.stockStatus,
      maxQuantity: resolvedVariant.stockQuantity ?? null,
    });
  };

  const getButtonText = () => {
    if (hasColors) {
      if (!selectedColor && !selectedSize) return "SELECT COLOR & SIZE";
      if (selectedColor && !selectedSize) return "SELECT SIZE";
      if (!selectedColor && selectedSize) return "SELECT COLOR";
      if (!resolvedVariant) return "UNAVAILABLE";
      if (resolvedVariant.stockStatus === "unknown") return "AVAILABILITY PENDING";
      if (isOutOfStock) return "OUT OF STOCK";
      if (isUnavailable || resolvedVariant.active === false) return "UNAVAILABLE";
      if (!hasValidPrice) return "PRICE PENDING";
      return "ADD TO BAG";
    }

    // Legacy Single-Dimension Size Mode
    if (!legacySelectedVariant) return "SELECT SIZE";
    if (legacySelectedVariant.stockStatus === "unknown") return "AVAILABILITY PENDING";
    if (legacySelectedVariant.stockStatus === "out_of_stock") return "OUT OF STOCK";
    if (legacySelectedVariant.stockStatus === "unavailable" || legacySelectedVariant.active === false) {
      return "UNAVAILABLE";
    }
    if (!hasValidPrice) return "PRICE PENDING";
    return "ADD TO BAG";
  };

  // If a product currently has no configured variants:
  // Cleanly omit the selector and CTA entirely rather than displaying a false "UNAVAILABLE" / "OUT OF STOCK"
  if (!totalVariants || totalVariants.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-5 mt-6 ${className}`}>
      {/* ── Multi-Color Selector (Only when product has one or more color variants) ── */}
      {hasColors && (
        <ProductColorSelector
          colors={colorOptions}
          selectedColor={selectedColor}
          onSelectColor={handleSelectColor}
        />
      )}

      {/* ── Size Selector (Simultaneously visible with smart disabled states) ── */}
      {hasColors ? (
        <ProductSizeSelector
          sizeOptions={sizeOptions}
          sizeGuide={sizeGuide}
          selectedSize={selectedSize}
          onSelectSize={handleSelectSize}
        />
      ) : (
        <ProductSizeSelector
          variants={totalVariants}
          sizeGuide={sizeGuide}
          selectedVariantId={legacySelectedVariant?.id ?? null}
          onSelectVariant={handleLegacySelectVariant}
        />
      )}

      {/* ── Status Indicator (Only when verified by confirmed data) ── */}
      {resolvedVariant && resolvedVariant.stockStatus !== "unknown" && (
        <ProductAvailability status={resolvedVariant.stockStatus} />
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
    </div>
  );
}
