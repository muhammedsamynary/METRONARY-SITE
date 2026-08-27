"use client";

import React, { useRef } from "react";
import { useCart } from "./CartProvider";
import { MiniCart } from "./MiniCart";

export function CartTrigger() {
  const { itemCount, isOpen, toggleCart } = useCart();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id="cart-toggle"
        type="button"
        onClick={toggleCart}
        aria-label={
          itemCount > 0
            ? `Shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
            : "Shopping bag, empty"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative text-[rgba(245,244,238,0.85)] hover:text-[var(--m-gold)] transition-colors p-2 min-w-[40px] min-h-[40px] flex items-center justify-center -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-md drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)] cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>

        {/* Discreet Item Count Badge (Only rendered when bag has items) */}
        {itemCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[var(--m-gold)] text-[var(--m-dark)] text-[9px] font-mono font-bold flex items-center justify-center leading-none shadow-[0_0_8px_rgba(251,133,0,0.6)] animate-scaleUp"
            aria-hidden="true"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {/* Floating Mini-Cart Anchor */}
      <MiniCart triggerRef={triggerRef} />
    </div>
  );
}
