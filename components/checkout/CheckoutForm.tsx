"use client";

import React from "react";
import type { CustomerDetailsInput } from "@/lib/checkout/types";

interface CheckoutFormProps {
  formData: CustomerDetailsInput;
  onChange: (field: keyof CustomerDetailsInput, value: string) => void;
  errors: Record<string, string>;
  onBlur: (field: keyof CustomerDetailsInput) => void;
}

export function CheckoutForm({
  formData,
  onChange,
  errors,
  onBlur,
}: CheckoutFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-[rgba(245,244,238,0.08)] pb-4">
        <h2 className="text-[12px] font-bold tracking-[0.24em] uppercase text-[var(--m-cream)]">
          DELIVERY INFORMATION
        </h2>
        <p className="text-xs text-[rgba(245,244,238,0.5)] mt-1">
          Please enter your direct delivery contact and shipping address.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="checkout-name"
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)] flex items-center justify-between"
          >
            <span>Full Name <span className="text-[var(--m-gold)]">*</span></span>
          </label>
          <input
            id="checkout-name"
            name="customerName"
            type="text"
            required
            autoComplete="name"
            value={formData.customerName}
            onChange={(e) => onChange("customerName", e.target.value)}
            onBlur={() => onBlur("customerName")}
            placeholder="e.g. Mohamed Samy"
            className={`w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.35)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border transition-colors outline-none ${
              errors.customerName
                ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)]"
            }`}
            aria-invalid={Boolean(errors.customerName)}
            aria-describedby={errors.customerName ? "name-error" : undefined}
          />
          {errors.customerName && (
            <span id="name-error" className="text-xs text-red-400 font-mono tracking-wide mt-0.5">
              {errors.customerName}
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="checkout-phone"
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)] flex items-center justify-between"
          >
            <span>Phone Number <span className="text-[var(--m-gold)]">*</span></span>
          </label>
          <input
            id="checkout-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            onBlur={() => onBlur("phone")}
            placeholder="e.g. 01001234567"
            className={`w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.35)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border transition-colors outline-none ${
              errors.phone
                ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)]"
            }`}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <span id="phone-error" className="text-xs text-red-400 font-mono tracking-wide mt-0.5">
              {errors.phone}
            </span>
          )}
        </div>

        {/* Email (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="checkout-email"
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)] flex items-center justify-between"
          >
            <span>Email Address <span className="text-[rgba(245,244,238,0.4)] text-[10px]">(Optional)</span></span>
          </label>
          <input
            id="checkout-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            placeholder="e.g. name@domain.com"
            className={`w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.35)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border transition-colors outline-none ${
              errors.email
                ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)]"
            }`}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="text-xs text-red-400 font-mono tracking-wide mt-0.5">
              {errors.email}
            </span>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="checkout-address"
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)] flex items-center justify-between"
          >
            <span>Street Address / Building <span className="text-[var(--m-gold)]">*</span></span>
          </label>
          <input
            id="checkout-address"
            name="address"
            type="text"
            required
            autoComplete="street-address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            onBlur={() => onBlur("address")}
            placeholder="e.g. 14 El Gezira St, Apt 4B"
            className={`w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.35)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border transition-colors outline-none ${
              errors.address
                ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)]"
            }`}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? "address-error" : undefined}
          />
          {errors.address && (
            <span id="address-error" className="text-xs text-red-400 font-mono tracking-wide mt-0.5">
              {errors.address}
            </span>
          )}
        </div>

        {/* City / Area */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="checkout-city"
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)] flex items-center justify-between"
          >
            <span>City / Governorate / District <span className="text-[var(--m-gold)]">*</span></span>
          </label>
          <input
            id="checkout-city"
            name="cityOrArea"
            type="text"
            required
            autoComplete="address-level2"
            value={formData.cityOrArea}
            onChange={(e) => onChange("cityOrArea", e.target.value)}
            onBlur={() => onBlur("cityOrArea")}
            placeholder="e.g. Zamalek, Cairo / Dokki, Giza"
            className={`w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.35)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border transition-colors outline-none ${
              errors.cityOrArea
                ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)]"
            }`}
            aria-invalid={Boolean(errors.cityOrArea)}
            aria-describedby={errors.cityOrArea ? "city-error" : undefined}
          />
          {errors.cityOrArea && (
            <span id="city-error" className="text-xs text-red-400 font-mono tracking-wide mt-0.5">
              {errors.cityOrArea}
            </span>
          )}
        </div>

        {/* Notes (Optional) */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="checkout-notes"
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)] flex items-center justify-between"
          >
            <span>Order / Delivery Notes <span className="text-[rgba(245,244,238,0.4)] text-[10px]">(Optional)</span></span>
            <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
              {(formData.notes || "").length}/500
            </span>
          </label>
          <textarea
            id="checkout-notes"
            name="notes"
            rows={3}
            maxLength={500}
            value={formData.notes || ""}
            onChange={(e) => onChange("notes", e.target.value)}
            onBlur={() => onBlur("notes")}
            placeholder="Any special instructions for the courier (e.g. Landmark, preferred delivery time)..."
            className={`w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.35)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border resize-none transition-colors outline-none ${
              errors.notes
                ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)]"
            }`}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? "notes-error" : undefined}
          />
          {errors.notes && (
            <span id="notes-error" className="text-xs text-red-400 font-mono tracking-wide mt-0.5">
              {errors.notes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
