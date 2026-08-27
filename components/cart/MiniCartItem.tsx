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
  const { id, slug, displayName, thumbnail, size, quantity, unitPrice, currency } = item;
  const formattedPrice = formatCurrency(unitPrice ? unitPrice * quantity : null, currency);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[rgba(245,244,238,0.08)] last:border-b-0">
      {/* Thumbnail */}
      <Link
        href={`/product/${slug}`}
        onClick={onItemClick}
        className="relative w-12 h-12 shrink-0 bg-[rgba(245,244,238,0.03)] border border-[rgba(245,244,238,0.1)] rounded-lg overflow-hidden flex items-center justify-center group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)]"
      >
        <Image
          src={thumbnail}
          alt={displayName}
          fill
          sizes="48px"
          className="object-contain p-1 transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Link
          href={`/product/${slug}`}
          onClick={onItemClick}
          className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--m-cream)] truncate hover:text-[var(--m-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded"
        >
          {displayName}
        </Link>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[rgba(245,244,238,0.6)]">
          <span>SIZE: {size}</span>
          {formattedPrice && (
            <>
              <span>•</span>
              <span className="text-[var(--m-gold)]">{formattedPrice}</span>
            </>
          )}
        </div>
      </div>

      {/* Quantity & Remove Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Compact Quantity Stepper */}
        <div className="flex items-center border border-[rgba(245,244,238,0.14)] rounded-md bg-[rgba(245,244,238,0.02)]">
          <button
            type="button"
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            aria-label={`Decrease quantity of ${displayName} size ${size}`}
            className="w-6 h-6 flex items-center justify-center text-[11px] text-[rgba(245,244,238,0.7)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.06)] rounded-l transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)]"
          >
            −
          </button>
          <span
            className="w-5 text-center text-[11px] font-mono text-[var(--m-cream)]"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            aria-label={`Increase quantity of ${displayName} size ${size}`}
            className="w-6 h-6 flex items-center justify-center text-[11px] text-[rgba(245,244,238,0.7)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.06)] rounded-r transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)]"
          >
            +
          </button>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(id)}
          aria-label={`Remove ${displayName} size ${size} from bag`}
          className="p-1 text-[rgba(245,244,238,0.4)] hover:text-rose-400 hover:bg-[rgba(245,244,238,0.06)] rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
