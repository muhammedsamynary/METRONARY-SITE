"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";
import type { FloatingProductData } from "./types";
import { HOMEPAGE_PRODUCTS } from "./ProductField";

interface CatalogGridProps {
  products?: FloatingProductData[];
  className?: string;
}

/**
 * ─── YEEZY-STYLE CLEAN CATALOG GRID (LAYOUT 2) ───
 *
 * Structural Reference:
 * - Clean, static catalog wall with zero card containers, borders, or glass cards.
 * - Generous and minimal spacing.
 * - Wide screens: 6 columns.
 * - Medium desktop / tablets: 3–4 columns.
 * - Mobile: 2 columns.
 * - Minimal centered typography beneath each floating product image.
 */
export function CatalogGrid({
  products = HOMEPAGE_PRODUCTS,
  className = "",
}: CatalogGridProps) {
  return (
    <div
      className={`w-full min-h-screen pt-24 sm:pt-28 pb-32 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto ${className}`}
      aria-label="Metronary Catalog Grid"
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-x-4 sm:gap-x-8 lg:gap-x-10 gap-y-10 sm:gap-y-14">
        {products.map((product, idx) => (
          <Link
            key={product.id}
            href={ROUTES.product(product.slug)}
            className="group flex flex-col items-center text-center select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-lg p-2 transition-transform duration-300"
            aria-label={`View ${product.name}`}
          >
            {/* ── Floating Product Image Container ── */}
            <div className="relative w-full aspect-square flex items-center justify-center mb-3 sm:mb-4">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1536px) 22vw, 260px"
                priority={idx < 6}
                className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] group-hover:scale-105 group-hover:drop-shadow-[0_18px_32px_rgba(0,0,0,0.2)] transition-all duration-300"
                draggable={false}
              />
            </div>

            {/* ── Minimal Centered Garment Label ── */}
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.16em] uppercase text-[#141210] group-hover:text-[var(--m-gold)] transition-colors duration-200 line-clamp-1">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
