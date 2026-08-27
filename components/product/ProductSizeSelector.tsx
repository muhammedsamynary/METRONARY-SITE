"use client";

import React, { useState, useRef } from "react";
import type { ProductVariant, SizeGuide } from "@/lib/products/types";
import { SizeGuideTrigger } from "./SizeGuideTrigger";
import { SizeGuideModal } from "./SizeGuideModal";

interface ProductSizeSelectorProps {
  variants?: ProductVariant[];
  sizeGuide?: SizeGuide | null;
  selectedVariantId: string | null;
  onSelectVariant: (variant: ProductVariant) => void;
  className?: string;
}

export function ProductSizeSelector({
  variants,
  sizeGuide,
  selectedVariantId,
  onSelectVariant,
  className = "",
}: ProductSizeSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // If no variants exist for this product, omit size buttons cleanly
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* ── Size Header with integrated Size Guide Trigger ── */}
      <div className="flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-[rgba(245,244,238,0.7)] font-medium">
        <span>Select Size</span>

        {/* Dynamic Size Guide Trigger (Only renders if sizeGuide is assigned) */}
        {sizeGuide && (
          <SizeGuideTrigger
            guide={sizeGuide}
            onOpen={() => setIsModalOpen(true)}
            triggerRef={triggerRef}
          />
        )}
      </div>

      {/* ── Size Selection Buttons (SKYLRK-Inspired Compact Matrix) ── */}
      <div
        className="flex flex-wrap items-center gap-2.5"
        role="radiogroup"
        aria-label="Select product size"
      >
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isOutOfStock = variant.stockStatus === "out_of_stock";
          const isUnavailable =
            variant.stockStatus === "unavailable" || variant.active === false;
          const isDisabled = isOutOfStock || isUnavailable;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              onClick={() => onSelectVariant(variant)}
              className={`min-w-[44px] h-11 px-3.5 rounded-lg border text-[12px] font-mono font-medium flex items-center justify-center transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] ${
                isSelected
                  ? "border-[var(--m-gold)] bg-[rgba(251,133,0,0.18)] text-[var(--m-cream)] shadow-[0_0_14px_rgba(251,133,0,0.45)] scale-105"
                  : isDisabled
                  ? "border-[rgba(245,244,238,0.08)] bg-[rgba(245,244,238,0.02)] text-[rgba(245,244,238,0.25)] cursor-not-allowed line-through"
                  : "border-[rgba(245,244,238,0.15)] bg-[rgba(245,244,238,0.04)] text-[rgba(245,244,238,0.85)] hover:border-[var(--m-gold)] hover:text-[var(--m-cream)] hover:bg-[rgba(251,133,0,0.06)] cursor-pointer"
              }`}
            >
              {variant.size}
            </button>
          );
        })}
      </div>

      {/* ── Dynamic Size Guide Modal Dialog ── */}
      {sizeGuide && (
        <SizeGuideModal
          guide={sizeGuide}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
}
