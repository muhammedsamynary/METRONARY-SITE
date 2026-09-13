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
    <div className="flex items-start sm:items-center gap-4 py-4 border-b border-[rgba(245,244,238,0.08)] last:border-b-0 group">
      {/* ── Enlarged Product Thumbnail ── */}
      <Link
        href={`/product/${slug}`}
        onClick={onItemClick}
        className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 bg-[rgba(245,244,238,0.04)] border border-[rgba(245,244,238,0.12)] rounded-xl overflow-hidden flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)]"
      >
        <Image
          src={thumbnail}
          alt={displayName}
          fill
          sizes="96px"
          className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-108"
        />
      </Link>

      {/* ── Product Information & Specs ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link
          href={`/product/${slug}`}
          onClick={onItemClick}
          className="text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase text-[var(--m-cream)] truncate hover:text-[var(--m-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded"
        >
          {displayName}
        </Link>

        {/* Variant Badges (Color + Size) */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[rgba(245,244,238,0.6)]">
          {color && (
            <span className="px-1.5 py-0.5 rounded bg-[rgba(245,244,238,0.06)] border border-[rgba(245,244,238,0.1)] text-[rgba(245,244,238,0.85)] uppercase font-semibold">
              {color}
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded bg-[rgba(245,244,238,0.06)] border border-[rgba(245,244,238,0.1)] text-[rgba(245,244,238,0.85)] uppercase font-semibold">
            SIZE: {size}
          </span>
        </div>

        {/* Price & Line Calculation */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs sm:text-sm font-mono font-bold text-[var(--m-gold)]">
            {formattedPrice ?? "PRICE PENDING"}
          </span>
          {quantity > 1 && formattedUnitPrice && (
            <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)]">
              ({formattedUnitPrice} each)
            </span>
          )}
        </div>
      </div>

      {/* ── Quantity Stepper & Remove Action ── */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0 self-center">
        {/* Generous Touch Quantity Stepper */}
        <div className="flex items-center border border-[rgba(245,244,238,0.16)] rounded-lg bg-[rgba(0,0,0,0.4)] shadow-inner">
          <button
            type="button"
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            aria-label={`Decrease quantity of ${displayName} size ${size}`}
            className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold text-[rgba(245,244,238,0.7)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.08)] rounded-l transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] active:bg-[rgba(251,133,0,0.2)]"
          >
            −
          </button>
          <span
            className="w-6 text-center text-xs font-mono font-bold text-[var(--m-cream)]"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            aria-label={`Increase quantity of ${displayName} size ${size}`}
            className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold text-[rgba(245,244,238,0.7)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.08)] rounded-r transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] active:bg-[rgba(251,133,0,0.2)]"
          >
            +
          </button>
        </div>

        {/* Remove Icon */}
        <button
          type="button"
          onClick={() => onRemove(id)}
          aria-label={`Remove ${displayName} size ${size} from bag`}
          className="p-2 text-[rgba(245,244,238,0.35)] hover:text-rose-400 hover:bg-[rgba(245,244,238,0.06)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
  );
}
