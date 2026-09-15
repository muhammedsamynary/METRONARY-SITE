import type { Metadata } from "next";
import Link from "next/link";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT } from "@/lib/theme/gradient.presets";
import { SITE, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy — METRONARY",
  description: "Privacy policy and customer data security at METRONARY.",
  openGraph: {
    title: "Privacy Policy — METRONARY",
    description: "Privacy policy and customer data security at METRONARY.",
    url: `${SITE.url}/policy`,
  },
};

export default function PolicyPage() {
  return (
    <MetronaryBackground
      theme={PRESET_DEFAULT}
      className="w-full min-h-screen flex flex-col pt-24 sm:pt-32 pb-24 text-[var(--m-mist)]"
    >
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 flex flex-col gap-10">
        <div className="border-b border-white/[0.08] pb-6 flex flex-col gap-3">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.24em] uppercase text-[var(--m-gold)]">
            LEGAL PROTOCOL // 01
          </span>
          <h1
            className="text-3xl sm:text-5xl font-black uppercase tracking-[0.06em] text-[var(--m-cream)]"
            style={{ fontFamily: "var(--m-font-heading)" }}
          >
            PRIVACY POLICY
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[var(--m-cream)]/60">
            Last updated: 2026 // Cash on Delivery fulfillment protocol
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm font-mono leading-relaxed text-[var(--m-cream)]/80">
          <section className="p-6 sm:p-8 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--m-gold)] uppercase tracking-wider">
              1. INFORMATION WE COLLECT
            </h2>
            <p>
              To fulfill your order, we collect direct shipping details including your full name, mobile phone number, delivery address, and city/area in Egypt.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--m-gold)] uppercase tracking-wider">
              2. USE OF DATA
            </h2>
            <p>
              Your information is used exclusively to process, coordinate delivery, and provide order status updates via SMS/Phone. We never sell, rent, or share customer data with unauthorized third parties.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--m-gold)] uppercase tracking-wider">
              3. DATA SECURITY
            </h2>
            <p>
              All order communications are securely processed and protected. Access is restricted strictly to authorized store administrators for order fulfillment purposes.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
          <Link
            href={ROUTES.home}
            className="text-xs font-mono tracking-widest uppercase text-[var(--m-gold)] hover:underline"
          >
            ← RETURN TO STORE
          </Link>
          <Link
            href="/terms"
            className="text-xs font-mono tracking-widest uppercase text-[var(--m-cream)]/70 hover:text-[var(--m-gold)]"
          >
            VIEW TERMS →
          </Link>
        </div>
      </div>
    </MetronaryBackground>
  );
}
