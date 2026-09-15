import type { Metadata } from "next";
import Link from "next/link";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT } from "@/lib/theme/gradient.presets";
import { SITE, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions — METRONARY",
  description: "Terms and conditions for ordering and delivery at METRONARY.",
  openGraph: {
    title: "Terms & Conditions — METRONARY",
    description: "Terms and conditions for ordering and delivery at METRONARY.",
    url: `${SITE.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <MetronaryBackground
      theme={PRESET_DEFAULT}
      className="w-full min-h-screen flex flex-col pt-24 sm:pt-32 pb-24 text-[var(--m-mist)]"
    >
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 flex flex-col gap-10">
        <div className="border-b border-white/[0.08] pb-6 flex flex-col gap-3">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.24em] uppercase text-[var(--m-gold)]">
            LEGAL PROTOCOL // 02
          </span>
          <h1
            className="text-3xl sm:text-5xl font-black uppercase tracking-[0.06em] text-[var(--m-cream)]"
            style={{ fontFamily: "var(--m-font-heading)" }}
          >
            TERMS &amp; CONDITIONS
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[var(--m-cream)]/60">
            Last updated: 2026 // Cash on Delivery fulfillment protocol
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm font-mono leading-relaxed text-[var(--m-cream)]/80">
          <section className="p-6 sm:p-8 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--m-gold)] uppercase tracking-wider">
              1. CASH ON DELIVERY (COD)
            </h2>
            <p>
              METRONARY orders are fulfilled via Cash on Delivery across supported delivery zones in Egypt. Full payment in Egyptian Pounds (EGP) is collected by the courier upon delivery of your garment.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--m-gold)] uppercase tracking-wider">
              2. ORDER VERIFICATION &amp; DISPATCH
            </h2>
            <p>
              Orders are confirmed upon submission. Our logistics team verifies your contact phone and shipping address before dispatch. Expected delivery timeline is 2–4 business days within Cairo &amp; Giza, and 3–6 business days for other governorates.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--m-gold)] uppercase tracking-wider">
              3. INSPECTION &amp; EXCHANGES
            </h2>
            <p>
              In accordance with Egyptian consumer protection regulations, customers are entitled to inspect the package upon courier arrival. Size exchanges are supported within 14 days of delivery provided the item is in unworn, original condition with all tags attached.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--m-gold)] uppercase tracking-wider">
              4. LIMITED RUNS &amp; ARCHIVE EDITIONS
            </h2>
            <p>
              All METRONARY garments are crafted in limited batches. Inventory allocation is finalized upon order placement.
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
            href="/policy"
            className="text-xs font-mono tracking-widest uppercase text-[var(--m-cream)]/70 hover:text-[var(--m-gold)]"
          >
            VIEW PRIVACY POLICY →
          </Link>
        </div>
      </div>
    </MetronaryBackground>
  );
}
