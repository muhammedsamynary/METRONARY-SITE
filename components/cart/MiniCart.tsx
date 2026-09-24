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
      className="fixed top-16 left-3 right-3 sm:left-auto sm:right-0 sm:absolute sm:top-full sm:mt-3 w-auto sm:w-[520px] lg:w-[540px] max-w-none sm:max-w-[540px] max-h-[calc(100svh-80px)] sm:max-h-[85vh] bg-[rgba(15,12,8,0.98)] backdrop-blur-2xl border border-[rgba(245,244,238,0.16)] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_32px_72px_rgba(0,0,0,0.95)] z-50 animate-fadeIn flex flex-col"
      style={{
        transformOrigin: "top right",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-3 sm:pb-5 border-b border-[rgba(245,244,238,0.1)] shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-bold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[var(--m-cream)] whitespace-nowrap">
            SHOPPING BAG
          </span>
          {itemCount > 0 && (
            <span className="px-2 py-0.5 sm:px-2.5 rounded-full bg-[rgba(251,133,0,0.14)] border border-[rgba(251,133,0,0.28)] text-[9px] sm:text-[11px] font-mono text-[var(--m-gold)] font-bold whitespace-nowrap">
              {itemCount} {itemCount === 1 ? "PIECE" : "PIECES"}
            </span>
          )}
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={closeCart}
          aria-label="Close bag"
          className="p-2 -mr-1 sm:p-2.5 sm:-mr-1.5 text-[rgba(245,244,238,0.6)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.06)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        <div className="py-10 sm:py-16 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 my-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[rgba(245,244,238,0.04)] border border-[rgba(245,244,238,0.08)] flex items-center justify-center text-[rgba(245,244,238,0.4)]">
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
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.7)] font-bold">
              YOUR BAG IS EMPTY
            </span>
            <span className="text-[11px] sm:text-xs text-[rgba(245,244,238,0.45)] max-w-xs">
              Discover current limited edition pieces in our spatial gallery.
            </span>
          </div>

          <Link
            href="/"
            onClick={closeCart}
            className="mt-2 text-xs tracking-[0.24em] font-mono uppercase text-[var(--m-gold)] hover:text-[var(--m-yellow)] underline underline-offset-4 decoration-[rgba(251,133,0,0.4)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded py-2 px-4"
          >
            EXPLORE STORE
          </Link>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Scrollable Items List */}
          <div className="flex-1 overflow-y-auto pr-1 my-2 divide-y divide-[rgba(245,244,238,0.08)]">
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

          {/* Subtotal & Shipping Summary Section */}
          <div className="pt-3.5 sm:pt-5 border-t border-[rgba(245,244,238,0.1)] flex flex-col gap-3 sm:gap-4 shrink-0">
            {/* Shipping Info Line */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[rgba(245,244,238,0.6)]">
              <span>SHIPPING</span>
              <span className="text-[rgba(245,244,238,0.75)]">Calculated at checkout</span>
            </div>

            {/* Subtotal Line */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-[0.14em] sm:tracking-[0.16em]">
              <span className="text-[rgba(245,244,238,0.75)] font-semibold">SUBTOTAL</span>
              <span className="font-bold text-[var(--m-gold)] text-sm sm:text-base tracking-wide">
                {isSubtotalCalculable ? formattedSubtotal : "PRICING PENDING"}
              </span>
            </div>

            {/* Checkout CTA Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-xl text-xs sm:text-[13px] tracking-[0.22em] sm:tracking-[0.24em] uppercase font-bold text-center select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] bg-[var(--m-gold)] text-[var(--m-dark)] shadow-[0_4px_24px_rgba(251,133,0,0.4)] hover:bg-[var(--m-yellow)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-[50px] sm:min-h-[52px] flex items-center justify-center"
            >
              CHECKOUT
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
