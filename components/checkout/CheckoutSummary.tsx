"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { CartItem } from "@/lib/cart/types";
import { formatCurrency } from "@/lib/cart/cart-utils";
import type { DeliveryQuoteState } from "./CheckoutForm";
import { LegalModal, type LegalModalType } from "./LegalModal";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number | null;
  isSubtotalCalculable: boolean;
  deliveryQuote: DeliveryQuoteState;
  isFormValid: boolean;
  isSubmitting?: boolean;
  onSubmit: () => void;
}

export function CheckoutSummary({
  items,
  subtotal,
  isSubtotalCalculable,
  deliveryQuote,
  isFormValid,
  isSubmitting = false,
  onSubmit,
}: CheckoutSummaryProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  // Determine if any item in the cart is ineligible for purchase (e.g. stock UNKNOWN/OUT_OF_STOCK or price null)
  const hasIneligibleItems = items.some(
    (item) => item.unitPrice === null || item.stockStatus === "unknown" || item.stockStatus === "out_of_stock" || item.stockStatus === "unavailable"
  );

  // Minor integer calculations (avoids JS float drift)
  let subtotalMinor: number | null = null;
  if (isSubtotalCalculable && items.length > 0) {
    let valid = true;
    let sumMinor = 0;
    for (const item of items) {
      if (item.unitPrice === null || item.unitPrice === undefined || Number.isNaN(item.unitPrice)) {
        valid = false;
        break;
      }
      const priceMinor = Math.round(item.unitPrice * 100);
      sumMinor += priceMinor * item.quantity;
    }
    if (valid) {
      subtotalMinor = sumMinor;
    }
  }

  let totalMinor: number | null = null;
  if (subtotalMinor !== null && deliveryQuote.status === "configured" && deliveryQuote.feeMinor !== null) {
    totalMinor = subtotalMinor + deliveryQuote.feeMinor;
  }

  const isDeliveryConfigured = deliveryQuote.status === "configured" && deliveryQuote.feeMinor !== null;
  const canPlaceOrder =
    items.length > 0 &&
    !hasIneligibleItems &&
    isSubtotalCalculable &&
    subtotal !== null &&
    isFormValid &&
    isDeliveryConfigured &&
    termsAccepted &&
    !isSubmitting;

  const handleCheckboxChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked) {
      setTermsError(null);
    }
  };

  const handlePlaceOrderClick = () => {
    if (!termsAccepted) {
      setTermsError("Please agree to the Terms & Conditions and Privacy Policy to place your order.");
      return;
    }
    setTermsError(null);
    onSubmit();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Summary Title ── */}
      <div className="border-b border-[rgba(245,244,238,0.08)] pb-4 flex items-center justify-between">
        <h2 className="text-[12px] font-bold tracking-[0.24em] uppercase text-[var(--m-cream)]">
          ORDER SUMMARY
        </h2>
        <span className="text-[10px] font-mono tracking-wider text-[var(--m-gold)] font-semibold">
          {items.reduce((acc, curr) => acc + curr.quantity, 0)} PIECE(S)
        </span>
      </div>

      {/* ── Cart Items List ── */}
      <div className="flex flex-col divide-y divide-[rgba(245,244,238,0.06)] max-h-[360px] overflow-y-auto pr-1">
        {items.map((item) => {
          const isItemIneligible =
            item.unitPrice === null ||
            item.stockStatus === "unknown" ||
            item.stockStatus === "out_of_stock" ||
            item.stockStatus === "unavailable";

          const formattedPrice = item.unitPrice !== null ? formatCurrency(item.unitPrice * item.quantity) : null;

          return (
            <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
              {/* Product Thumbnail */}
              <div className="relative w-14 h-14 rounded-lg bg-[rgba(245,244,238,0.04)] border border-[rgba(245,244,238,0.08)] flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src={item.thumbnail}
                  alt={item.displayName}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-xs font-bold tracking-wider uppercase text-[var(--m-cream)] truncate">
                  {item.displayName}
                </span>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[rgba(245,244,238,0.55)]">
                  {item.color && (
                    <>
                      <span>COLOR: <strong className="text-[var(--m-cream)]">{item.color}</strong></span>
                      <span>•</span>
                    </>
                  )}
                  <span>SIZE: <strong className="text-[var(--m-cream)]">{item.size}</strong></span>
                  <span>•</span>
                  <span>QTY: <strong className="text-[var(--m-cream)]">{item.quantity}</strong></span>
                </div>

                {isItemIneligible && (
                  <span className="text-[9px] font-mono text-[var(--m-gold)] tracking-tight uppercase mt-0.5 font-semibold">
                    NOT CURRENTLY AVAILABLE FOR CHECKOUT
                  </span>
                )}
              </div>

              {/* Item Price */}
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-[var(--m-cream)]">
                  {formattedPrice ?? "PRICE UNAVAILABLE"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Commercial Calculation Breakdown ── */}
      <div className="border-t border-[rgba(245,244,238,0.08)] pt-4 flex flex-col gap-2.5">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span className="text-[rgba(245,244,238,0.6)]">SUBTOTAL</span>
          <span className="font-bold text-[var(--m-cream)]">
            {isSubtotalCalculable && subtotalMinor !== null
              ? formatCurrency(subtotalMinor / 100)
              : "PRICING PENDING"}
          </span>
        </div>

        {/* Delivery Fee */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span className="text-[rgba(245,244,238,0.6)]">DELIVERY</span>
          {deliveryQuote.status === "configured" && deliveryQuote.feeMinor !== null ? (
            <span className="font-bold text-[var(--m-cream)]">
              {formatCurrency(deliveryQuote.feeMinor / 100, deliveryQuote.currency)}
            </span>
          ) : deliveryQuote.status === "checking" ? (
            <span className="text-[10px] text-[rgba(245,244,238,0.45)] font-semibold">
              CHECKING...
            </span>
          ) : deliveryQuote.status === "unavailable" ? (
            <span className="text-[10px] text-[var(--m-gold)] font-semibold">
              NOT AVAILABLE
            </span>
          ) : deliveryQuote.status === "error" ? (
            <span className="text-[10px] text-red-400 font-semibold">
              UNAVAILABLE
            </span>
          ) : (
            <span className="text-[10px] text-[rgba(245,244,238,0.45)] font-semibold">
              PENDING AREA
            </span>
          )}
        </div>

        {/* Total (Preview Only) */}
        <div className="border-t border-[rgba(245,244,238,0.08)] pt-3 flex items-center justify-between text-sm font-mono uppercase tracking-wider">
          <span className="font-bold text-[var(--m-cream)]">TOTAL</span>
          {totalMinor !== null ? (
            <span className="font-bold text-[var(--m-gold)]">
              {formatCurrency(totalMinor / 100, deliveryQuote.currency)}
            </span>
          ) : deliveryQuote.status === "checking" ? (
            <span className="text-xs text-[rgba(245,244,238,0.45)] font-semibold">
              CALCULATING...
            </span>
          ) : deliveryQuote.status === "unavailable" ? (
            <span className="text-xs text-[var(--m-gold)] font-semibold">
              DELIVERY NOT AVAILABLE
            </span>
          ) : (
            <span className="text-xs text-[rgba(245,244,238,0.45)] font-semibold">
              PENDING AREA
            </span>
          )}
        </div>
      </div>

      {/* ── Status Banner for Current Catalog ── */}
      {hasIneligibleItems && (
        <div className="p-3.5 rounded-xl bg-[rgba(251,133,0,0.08)] border border-[rgba(251,133,0,0.3)] flex items-start gap-2.5">
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
            className="text-[var(--m-gold)] shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[11px] text-[rgba(245,244,238,0.7)] leading-relaxed">
            One or more items in your bag do not have confirmed pricing or stock availability. Order submission is disabled until pricing and availability are confirmed.
          </p>
        </div>
      )}

      {/* ── Required Terms & Privacy Policy Consent Checkbox ── */}
      <div className="pt-2 flex flex-col gap-2">
        <label
          htmlFor="checkout-terms-checkbox"
          className="flex items-start gap-3 cursor-pointer select-none group min-h-[44px] py-1"
        >
          {/* Custom Checkbox wrapping native input */}
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              id="checkout-terms-checkbox"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="sr-only peer"
              aria-describedby={termsError ? "terms-error" : undefined}
            />
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--m-gold)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--m-dark)] ${
                termsAccepted
                  ? "bg-[var(--m-gold)] border-[var(--m-gold)] text-[var(--m-dark)] shadow-[0_0_12px_rgba(251,133,0,0.35)]"
                  : termsError
                  ? "border-red-500/80 bg-[rgba(239,68,68,0.1)]"
                  : "border-[rgba(245,244,238,0.25)] bg-[rgba(0,0,0,0.3)] group-hover:border-[rgba(245,244,238,0.5)]"
              }`}
            >
              {termsAccepted && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-fadeIn"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>

          <span className="text-xs text-[rgba(245,244,238,0.7)] leading-relaxed">
            I agree to the{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveLegalModal("terms");
              }}
              className="text-[var(--m-gold)] underline underline-offset-2 hover:text-[var(--m-yellow)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded px-0.5"
            >
              Terms & Conditions
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveLegalModal("privacy");
              }}
              className="text-[var(--m-gold)] underline underline-offset-2 hover:text-[var(--m-yellow)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] rounded px-0.5"
            >
              Privacy Policy
            </button>
            .
          </span>
        </label>

        {termsError && (
          <span
            id="terms-error"
            className="text-xs text-red-400 font-mono tracking-wide pl-8 animate-fadeIn"
          >
            {termsError}
          </span>
        )}
      </div>

      {/* ── Place Order Action Button ── */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handlePlaceOrderClick}
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-xl text-xs tracking-[0.24em] uppercase font-bold text-center select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] min-h-[48px] ${
            canPlaceOrder
              ? "bg-[var(--m-gold)] text-[var(--m-dark)] shadow-[0_4px_24px_rgba(251,133,0,0.4)] hover:bg-[var(--m-yellow)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              : "bg-[rgba(245,244,238,0.06)] border border-[rgba(245,244,238,0.1)] text-[rgba(245,244,238,0.35)] cursor-pointer"
          }`}
          aria-disabled={!canPlaceOrder}
        >
          {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
        </button>

        <p className="text-center text-[10px] font-mono text-[rgba(245,244,238,0.4)] mt-2.5 uppercase tracking-wider">
          CASH ON DELIVERY • NO ADVANCE PAYMENT REQUIRED
        </p>
      </div>

      {/* ── Legal Modal ── */}
      <LegalModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />
    </div>
  );
}
