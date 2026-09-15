"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";
import type { FloatingProductData } from "./types";
import { HOMEPAGE_PRODUCTS } from "./ProductField";

interface CatalogGridProps {
  products?: FloatingProductData[];
  onHoverProduct?: (slug: string | null) => void;
  className?: string;
}

/**
 * ─── YEEZY-STYLE CLEAN CATALOG GRID (LAYOUT 2) ───
 *
 * Integrated into the SAME Fiery METRONARY Visual World:
 * - Direct cutouts floating over fiery amber gradient background.
 * - Zero card containers, borders, or glass blocks.
 * - Wide screens: 6 columns.
 * - Medium desktop / tablets: 3–4 columns.
 * - Mobile: 2 columns.
 * - High-contrast, minimal centered typography underneath.
 */
export function CatalogGrid({
  products = HOMEPAGE_PRODUCTS,
  onHoverProduct,
  className = "",
}: CatalogGridProps) {
  return (
    <div
      className={`w-full min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto ${className}`}
      aria-label="Metronary Catalog Grid"
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-x-4 sm:gap-x-8 lg:gap-x-10 gap-y-12 sm:gap-y-16">
        {products.map((product, idx) => (
          <Link
            key={product.id}
            href={ROUTES.product(product.slug)}
            className="group flex flex-col items-center text-center select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-lg p-2 transition-transform duration-300"
            aria-label={`View ${product.name}`}
            onMouseEnter={() => onHoverProduct?.(product.slug)}
            onMouseLeave={() => onHoverProduct?.(null)}
            onFocus={() => onHoverProduct?.(product.slug)}
            onBlur={() => onHoverProduct?.(null)}
          >
            {/* ── Floating Product Image Container ── */}
            <div className="relative w-full aspect-square flex items-center justify-center mb-3 sm:mb-4">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1536px) 22vw, 260px"
                priority={idx < 6}
                className="object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)] group-hover:scale-105 group-hover:drop-shadow-[0_24px_48px_rgba(232,93,4,0.45)] transition-all duration-300"
                draggable={false}
              />
            </div>

            {/* ── Minimal Centered Garment Label ── */}
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.18em] uppercase text-[var(--m-cream)] group-hover:text-[var(--m-gold)] transition-colors duration-200 line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
