"use client";

import React from "react";

export function CheckoutPaymentMethod() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--m-cream)]">
          PAYMENT METHOD
        </span>
        <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--m-gold)]">
          CASH ON DELIVERY
        </span>
      </div>

      <div className="relative flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[rgba(251,133,0,0.06)] border border-[rgba(251,133,0,0.35)] shadow-[0_0_24px_rgba(251,133,0,0.08)]">
        {/* Selected Radio Indicator (Fixed COD) */}
        <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-[var(--m-gold)] flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-[var(--m-gold)]" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-wide text-[var(--m-cream)]">
              Cash on Delivery (COD)
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[rgba(251,133,0,0.2)] text-[var(--m-yellow)] uppercase tracking-wider font-bold">
              ONLY OPTION
            </span>
          </div>

          <p className="text-xs text-[rgba(245,244,238,0.55)] leading-relaxed">
            Pay with cash directly to the courier when your package arrives at your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}
