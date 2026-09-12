"use client";

import React, { useState, useMemo } from "react";
import type { Product } from "@/lib/products/types";
import { ProductGallery } from "./ProductGallery";
import { ProductInfoPanel } from "./ProductInfoPanel";

interface ProductShowcaseProps {
  product: Product;
}

export function ProductShowcase({ product }: ProductShowcaseProps) {
  const displayName = product.officialName ?? product.workingName;

  // Extract distinct non-empty colors from active product variants
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    const list: string[] = [];
    for (const v of product.variants || []) {
      if (v.color && v.color.trim()) {
        const c = v.color.trim();
        if (!set.has(c)) {
          set.add(c);
          list.push(c);
        }
      }
    }
    return list;
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Compute gallery images filtered by selected color (with universal media fallback)
  const galleryImages = useMemo(() => {
    const allMedia = product.media || [];
    if (selectedColor && allMedia.length > 0) {
      const colorMedia = allMedia.filter(
        (m) =>
          m.color &&
          m.color.trim().toLowerCase() === selectedColor.trim().toLowerCase()
      );
      const universalMedia = allMedia.filter(
        (m) => !m.color || !m.color.trim()
      );

      if (colorMedia.length > 0) {
        return [...colorMedia, ...universalMedia].map((m) => m.src);
      }
      if (universalMedia.length > 0) {
        return universalMedia.map((m) => m.src);
      }
    }

    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.thumbnail];
  }, [product.media, product.images, product.thumbnail, selectedColor]);

  return (
    <>
      {/* ── Center/Left: Dominant Garment Showcase ── */}
      <div className="w-full lg:w-[58%] flex items-center justify-center">
        <ProductGallery
          images={galleryImages}
          productName={displayName}
          hasAlpha={product.hasAlpha}
          className="w-full"
        />
      </div>

      {/* ── Right: Translucent Glass Info & Action Panel ── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center lg:justify-end">
        <ProductInfoPanel
          product={product}
          availableColors={availableColors}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      </div>
    </>
  );
}
