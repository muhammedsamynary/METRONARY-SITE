"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutPaymentMethod } from "./CheckoutPaymentMethod";
import { CheckoutSummary } from "./CheckoutSummary";
import { validateCustomerDetails } from "@/lib/checkout/customer-validation";
import type { CustomerDetailsInput } from "@/lib/checkout/types";

export function CheckoutView() {
  const { items, subtotal, isSubtotalCalculable } = useCart();

  const [formData, setFormData] = useState<CustomerDetailsInput>({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    cityOrArea: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof CustomerDetailsInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on edit
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFieldBlur = (field: keyof CustomerDetailsInput) => {
    const result = validateCustomerDetails(formData);
    const fieldError = result.errors.find((e) => e.field === field);
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isFormValid =
    formData.customerName.trim().length >= 2 &&
    formData.phone.trim().length >= 6 &&
    formData.address.trim().length >= 5 &&
    formData.cityOrArea.trim().length >= 2;

  const handlePlaceOrder = () => {
    const result = validateCustomerDetails(formData);
    if (result.errors.length > 0) {
      const errorMap: Record<string, string> = {};
      for (const err of result.errors) {
        if (err.field) {
          errorMap[err.field] = err.message;
        }
      }
      setErrors(errorMap);
      return;
    }
    // Architecture boundary ready for Phase 11C (no mutations in Phase 11B)
  };

  // ─── 1. Empty Bag State ───
  if (items.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-[rgba(17,14,9,0.7)] backdrop-blur-2xl border border-[rgba(245,244,238,0.12)] shadow-[0_24px_56px_rgba(0,0,0,0.6)] flex flex-col items-center gap-6 max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-[rgba(251,133,0,0.1)] border border-[rgba(251,133,0,0.25)] flex items-center justify-center text-[var(--m-gold)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-[var(--m-cream)]">
              YOUR BAG IS EMPTY
            </h1>
            <p className="text-xs text-[rgba(245,244,238,0.55)] leading-relaxed">
              Explore our continuous spatial gallery to discover current releases and archive pieces.
            </p>
          </div>

          <Link
            href="/"
            className="w-full py-4 px-6 rounded-xl bg-[var(--m-gold)] text-[var(--m-dark)] text-xs tracking-[0.24em] font-bold uppercase shadow-[0_4px_24px_rgba(251,133,0,0.35)] hover:bg-[var(--m-yellow)] transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)]"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  // ─── 2. Real Checkout Layout (2-Column Desktop / Stacked Mobile) ───
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-20">
      {/* ── Page Header ── */}
      <div className="mb-8 sm:mb-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.24em] uppercase text-[rgba(245,244,238,0.4)]">
          <Link href="/" className="hover:text-[var(--m-gold)] transition-colors">
            SHOP
          </Link>
          <span>/</span>
          <span className="text-[var(--m-gold)]">CHECKOUT</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase text-[var(--m-cream)]">
          CASH ON DELIVERY CHECKOUT
        </h1>
      </div>

      {/* ── Main Two-Column Stage ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ── Left Column: Delivery Form + Payment Card (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Customer & Delivery Form */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[rgba(17,14,9,0.72)] backdrop-blur-2xl border border-[rgba(245,244,238,0.12)] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <CheckoutForm
              formData={formData}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              errors={errors}
            />
          </div>

          {/* Payment Method Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[rgba(17,14,9,0.72)] backdrop-blur-2xl border border-[rgba(245,244,238,0.12)] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <CheckoutPaymentMethod />
          </div>
        </div>

        {/* ── Right Column: Sticky Order Summary (5 cols) ── */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="p-6 sm:p-8 rounded-2xl bg-[rgba(17,14,9,0.72)] backdrop-blur-2xl border border-[rgba(245,244,238,0.12)] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              isSubtotalCalculable={isSubtotalCalculable}
              isFormValid={isFormValid}
              onSubmit={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
