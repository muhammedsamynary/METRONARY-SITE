import React from "react";
import type { Product } from "@/lib/products/types";
import { ProductActions } from "./ProductActions";

interface ProductInfoPanelProps {
  product: Product;
  className?: string;
}

export function ProductInfoPanel({ product, className = "" }: ProductInfoPanelProps) {
  const {
    workingName,
    officialName,
    silhouette,
    category,
    description,
    price,
    currency,
    badge,
    variants,
    sizeGuide,
  } = product;

  // Use official commercial name if approved, otherwise working label
  const displayName = officialName ?? workingName;

  return (
    <div
      className={`w-full max-w-[420px] bg-[rgba(17,14,9,0.68)] backdrop-blur-xl border border-[rgba(245,244,238,0.1)] rounded-2xl p-6 sm:p-8 shadow-[0_24px_56px_rgba(0,0,0,0.65)] flex flex-col justify-between ${className}`}
    >
      <div>
        {/* ── Editorial Badge / Category Meta ── */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="m-type-label text-[10px] tracking-[0.24em] text-[var(--m-gold)] uppercase font-semibold">
            {badge ?? "METRONARY // GIZA"}
          </span>

          <span className="text-[10px] tracking-[0.18em] text-[rgba(245,244,238,0.5)] uppercase">
            {silhouette ?? category}
          </span>
        </div>

        {/* ── Product Title (H1) ── */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.12em] uppercase text-[var(--m-cream)] mb-3 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {displayName}
        </h1>

        {/* ── Confirmed Price (Cleanly omitted if null — zero fake prices) ── */}
        {price !== null && price !== undefined && (
          <div className="text-lg font-mono text-[var(--m-gold)] mb-4 tracking-wider">
            {price} {currency}
          </div>
        )}

        {/* ── Product Narrative / Description (Only rendered if genuine description exists) ── */}
        {description && (
          <p className="text-[13px] leading-relaxed text-[rgba(245,244,238,0.75)] mb-6 font-light">
            {description}
          </p>
        )}
      </div>

      {/* ── Action Area, Variant Selector & Dynamic Size Guide ── */}
      <ProductActions
        product={product}
        variants={variants}
        sizeGuide={sizeGuide}
      />
    </div>
  );
}
