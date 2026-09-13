"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { MiniCartItem } from "./MiniCartItem";
import { formatCurrency } from "@/lib/cart/cart-utils";

interface MiniCartProps {
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function MiniCart({ triggerRef }: MiniCartProps) {
  const {
    items,
    isOpen,
    itemCount,
    subtotal,
    isSubtotalCalculable,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Manage outside click and Escape key behavior
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCart();
        triggerRef?.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeCart, triggerRef]);

  if (!isOpen) return null;

  const formattedSubtotal = formatCurrency(subtotal);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Shopping Bag"
      aria-modal="false"
      className="absolute top-full right-0 mt-2 sm:mt-3 w-[calc(100vw-24px)] sm:w-[460px] max-w-[460px] bg-[rgba(15,12,8,0.97)] backdrop-blur-2xl border border-[rgba(245,244,238,0.16)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_28px_64px_rgba(0,0,0,0.88)] z-50 animate-fadeIn"
      style={{
        transformOrigin: "top right",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(245,244,238,0.1)]">
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[var(--m-cream)]">
            SHOPPING BAG
          </span>
          {itemCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[rgba(251,133,0,0.14)] border border-[rgba(251,133,0,0.28)] text-[10px] font-mono text-[var(--m-gold)] font-bold">
              {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
            </span>
          )}
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={closeCart}
          aria-label="Close bag"
          className="p-2 -mr-1 text-[rgba(245,244,238,0.5)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.06)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
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

      {/* ── Content ── */}
      {items.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(245,244,238,0.04)] border border-[rgba(245,244,238,0.08)] flex items-center justify-center text-[rgba(245,244,238,0.4)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.6)] font-bold">
              YOUR BAG IS EMPTY
            </span>
            <span className="text-[11px] text-[rgba(245,244,238,0.4)]">
              Discover current limited pieces in our spatial gallery.
            </span>
          </div>

          <Link
            href="/"
            onClick={closeCart}
            className="mt-2 text-xs tracking-[0.24em] font-mono uppercase text-[var(--m-gold)] hover:text-[var(--m-yellow)] underline underline-offset-4 decoration-[rgba(251,133,0,0.4)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded py-1.5 px-3"
          >
            EXPLORE STORE
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Scrollable Items List */}
          <div className="max-h-[300px] sm:max-h-[360px] overflow-y-auto pr-1 my-2 divide-y divide-[rgba(245,244,238,0.06)]">
            {items.map((item) => (
              <MiniCartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onItemClick={closeCart}
              />
            ))}
          </div>

          {/* Subtotal Section */}
          <div className="pt-4 mt-1 border-t border-[rgba(245,244,238,0.1)] flex flex-col gap-3.5">
            <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em]">
              <span className="text-[rgba(245,244,238,0.65)] font-semibold">SUBTOTAL</span>
              <span className="font-bold text-[var(--m-cream)] text-sm sm:text-base">
                {isSubtotalCalculable ? formattedSubtotal : "PRICING PENDING"}
              </span>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-4 px-5 rounded-xl text-[11px] sm:text-xs tracking-[0.24em] uppercase font-bold text-center select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] bg-[var(--m-gold)] text-[var(--m-dark)] shadow-[0_4px_20px_rgba(251,133,0,0.38)] hover:bg-[var(--m-yellow)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-[48px] flex items-center justify-center"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
