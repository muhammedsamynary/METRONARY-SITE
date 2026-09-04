"use client";

import React, { useActionState } from "react";
import { loginAdmin } from "@/app/admin/login/actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <div
          role="alert"
          className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono tracking-wide leading-relaxed"
        >
          {state.error}
        </div>
      )}

      {/* Email input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="admin-email"
          className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)]"
        >
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          disabled={isPending}
          placeholder="admin@metronary.com"
          className="w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.4)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)] outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Password input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="admin-password"
          className="text-[11px] font-mono uppercase tracking-[0.14em] text-[rgba(245,244,238,0.7)]"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          placeholder="••••••••••••"
          className="w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,0.4)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.2)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)] outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[var(--m-gold)] to-[var(--m-orange)] text-black font-mono font-bold text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(251,133,0,0.3)] cursor-pointer"
      >
        {isPending ? "AUTHENTICATING..." : "ENTER ADMIN"}
      </button>
    </form>
  );
}
