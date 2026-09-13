"use client";

import React, { useEffect, useRef } from "react";

export type LegalModalType = "terms" | "privacy" | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!type) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[rgba(17,14,9,0.96)] border border-[rgba(245,244,238,0.16)] p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col gap-5 text-[rgba(245,244,238,0.85)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(245,244,238,0.1)]">
          <h2
            id="legal-modal-title"
            className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-[var(--m-cream)]"
          >
            {type === "terms" ? "TERMS & CONDITIONS" : "PRIVACY POLICY"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 -mr-2 text-[rgba(245,244,238,0.5)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.06)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)]"
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="text-xs sm:text-sm font-sans leading-relaxed space-y-4 text-[rgba(245,244,238,0.75)] pr-1">
          {type === "terms" ? (
            <>
              <div>
                <h3 className="font-bold text-[var(--m-cream)] uppercase tracking-wider mb-1">
                  1. CASH ON DELIVERY (COD)
                </h3>
                <p>
                  METRONARY orders are fulfilled via Cash on Delivery across supported delivery zones in Egypt. Full payment in Egyptian Pounds (EGP) is collected by the courier upon delivery of your garment.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[var(--m-cream)] uppercase tracking-wider mb-1">
                  2. ORDER VERIFICATION & DISPATCH
                </h3>
                <p>
                  Orders are confirmed upon submission. Our logistics team verifies your contact phone and shipping address before dispatch. Expected delivery timeline is 2–4 business days within Cairo & Giza, and 3–6 business days for other governorates.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[var(--m-cream)] uppercase tracking-wider mb-1">
                  3. INSPECTION & EXCHANGES
                </h3>
                <p>
                  In accordance with Egyptian consumer protection regulations, customers are entitled to inspect the package upon courier arrival. Size exchanges are supported within 14 days of delivery provided the item is in unworn, original condition with all tags attached.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[var(--m-cream)] uppercase tracking-wider mb-1">
                  4. LIMITED RUNS & ARCHIVE EDITIONS
                </h3>
                <p>
                  All METRONARY garments are crafted in limited batches. Inventory allocation is finalized upon order placement.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-bold text-[var(--m-cream)] uppercase tracking-wider mb-1">
                  1. INFORMATION WE COLLECT
                </h3>
                <p>
                  To fulfill your order, we collect direct shipping details including your full name, mobile phone number, delivery address, and city/area in Egypt.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[var(--m-cream)] uppercase tracking-wider mb-1">
                  2. USE OF DATA
                </h3>
                <p>
                  Your information is used exclusively to process, coordinate delivery, and provide order status updates via SMS/Phone. We never sell, rent, or share customer data with unauthorized third parties.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[var(--m-cream)] uppercase tracking-wider mb-1">
                  3. DATA SECURITY
                </h3>
                <p>
                  All order communications are securely processed and protected. Access is restricted strictly to authorized store administrators for order fulfillment purposes.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[rgba(245,244,238,0.1)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[var(--m-gold)] text-[var(--m-dark)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--m-yellow)] transition-colors"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
}
