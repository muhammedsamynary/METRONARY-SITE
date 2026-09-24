"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/lib/cart/types";
import { formatCurrency } from "@/lib/cart/cart-utils";

interface MiniCartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onItemClick?: () => void;
}

export function MiniCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onItemClick,
}: MiniCartItemProps) {
  const { id, slug, displayName, thumbnail, size, color, quantity, unitPrice, currency } = item;
  const formattedPrice = formatCurrency(unitPrice ? unitPrice * quantity : null, currency);
  const formattedUnitPrice = formatCurrency(unitPrice, currency);

  return (
    <div className="flex items-start gap-3 sm:gap-5 py-3.5 sm:py-5 border-b border-[rgba(245,244,238,0.08)] last:border-b-0 group">
      {/* ── Product Thumbnail (80px–96px on mobile, 112px on desktop) ── */}
      <Link
        href={`/product/${slug}`}
        onClick={onItemClick}
        className="relative w-20 h-24 sm:w-28 sm:h-32 shrink-0 bg-[rgba(245,244,238,0.04)] border border-[rgba(245,244,238,0.12)] rounded-xl overflow-hidden flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] transition-transform"
      >
        <Image
          src={thumbnail}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 80px, 112px"
          className="object-contain p-1.5 sm:p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* ── Product Information & Controls (Right Stack) ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5 sm:gap-2">
        {/* Top: Title, Meta, and Price */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {/* Title with multi-line wrap support */}
          <Link
            href={`/product/${slug}`}
            onClick={onItemClick}
            className="text-xs sm:text-sm font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[var(--m-cream)] line-clamp-2 hover:text-[var(--m-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded leading-snug"
          >
            {displayName}
          </Link>

          {/* Variant Info (Color + Size) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-mono text-[rgba(245,244,238,0.65)]">
            {color && color.trim().toLowerCase() !== "null" ? (
              <span>
                COLOR: <strong className="text-[var(--m-cream)] font-semibold">{color.toUpperCase()}</strong> • SIZE: <strong className="text-[var(--m-cream)] font-semibold">{size}</strong>
              </span>
            ) : (
              <span>
                SIZE: <strong className="text-[var(--m-cream)] font-semibold">{size}</strong>
              </span>
            )}
          </div>

          {/* Price & Unit Calculation */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-xs sm:text-sm font-mono font-bold text-[var(--m-gold)]">
              {formattedPrice ?? "PRICE PENDING"}
            </span>
            {quantity > 1 && formattedUnitPrice && (
              <span className="text-[10px] sm:text-[11px] font-mono text-[rgba(245,244,238,0.45)]">
                ({formattedUnitPrice} each)
              </span>
            )}
          </div>
        </div>

        {/* Bottom: Quantity Stepper & Remove Action (Full mobile width row) */}
        <div className="flex items-center justify-between pt-1 sm:pt-0 gap-2">
          {/* Compact Touch Quantity Stepper (~108px–116px) */}
          <div className="flex items-center border border-[rgba(245,244,238,0.16)] rounded-lg bg-[rgba(0,0,0,0.45)] shadow-inner w-[108px] sm:w-[116px] h-[34px] sm:h-[36px]">
            <button
              type="button"
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              aria-label={`Decrease quantity of ${displayName} size ${size}`}
              className="w-[36px] sm:w-[38px] h-full flex items-center justify-center text-sm font-bold text-[rgba(245,244,238,0.75)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.08)] rounded-l transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] active:bg-[rgba(251,133,0,0.2)]"
            >
              −
            </button>
            <span
              className="flex-1 text-center text-xs sm:text-sm font-mono font-bold text-[var(--m-cream)]"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              aria-label={`Increase quantity of ${displayName} size ${size}`}
              className="w-[36px] sm:w-[38px] h-full flex items-center justify-center text-sm font-bold text-[rgba(245,244,238,0.75)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.08)] rounded-r transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] active:bg-[rgba(251,133,0,0.2)]"
            >
              +
            </button>
          </div>

          {/* Remove Icon (Subtle & ergonomic) */}
          <button
            type="button"
            onClick={() => onRemove(id)}
            aria-label={`Remove ${displayName} size ${size} from bag`}
            className="p-2 text-[rgba(245,244,238,0.4)] hover:text-rose-400 hover:bg-[rgba(245,244,238,0.06)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
