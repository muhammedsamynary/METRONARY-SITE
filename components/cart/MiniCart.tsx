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
      className="absolute top-full right-0 mt-2.5 w-[calc(100vw-32px)] sm:w-[380px] max-w-[380px] bg-[rgba(17,14,9,0.96)] backdrop-blur-2xl border border-[rgba(245,244,238,0.14)] rounded-2xl p-5 shadow-[0_24px_56px_rgba(0,0,0,0.85)] z-50 animate-fadeIn"
      style={{
        transformOrigin: "top right",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(245,244,238,0.1)]">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-[var(--m-cream)]">
            BAG
          </span>
          {itemCount > 0 && (
            <span className="text-[10px] font-mono text-[var(--m-gold)] font-semibold">
              ({itemCount})
            </span>
          )}
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={closeCart}
          aria-label="Close bag"
          className="p-1.5 -mr-1 text-[rgba(245,244,238,0.5)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.06)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
        <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
            YOUR BAG IS EMPTY
          </span>

          <Link
            href="/"
            onClick={closeCart}
            className="text-[10px] tracking-[0.24em] font-mono uppercase text-[var(--m-gold)] hover:text-[var(--m-yellow)] underline underline-offset-4 decoration-[rgba(251,133,0,0.3)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded py-1 px-2"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Scrollable Items List */}
          <div className="max-h-[280px] overflow-y-auto pr-1 my-2">
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
          <div className="pt-3.5 mt-1 border-t border-[rgba(245,244,238,0.1)] flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em]">
              <span className="text-[rgba(245,244,238,0.6)]">SUBTOTAL</span>
              <span className="font-bold text-[var(--m-cream)]">
                {isSubtotalCalculable ? formattedSubtotal : "PRICING PENDING"}
              </span>
            </div>

            {/* Checkout CTA (Navigation enabled whenever items exist in bag) */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 px-4 rounded-lg text-[10px] tracking-[0.24em] uppercase font-semibold text-center select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] bg-[var(--m-gold)] text-[var(--m-dark)] shadow-[0_4px_16px_rgba(251,133,0,0.35)] hover:bg-[var(--m-yellow)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
