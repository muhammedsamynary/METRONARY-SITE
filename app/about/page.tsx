import type { Metadata } from "next";
import Link from "next/link";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT } from "@/lib/theme/gradient.presets";
import { LogoPrimary } from "@/components/brand/Logo";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — METRONARY",
  description:
    "The story of METRONARY. Derived from Metro and Nary (ناري) — a fiery metro racing with unstoppable speed. Born in Giza, Egypt.",
  openGraph: {
    title: "About — METRONARY",
    description:
      "Derived from Metro and Nary (ناري) — a fiery metro racing with unstoppable speed. Born in Giza, Egypt.",
  },
};

export default function AboutPage() {
  return (
    <MetronaryBackground
      theme={PRESET_DEFAULT}
      className="w-full min-h-screen flex flex-col"
    >
      <div className="w-full min-h-screen flex flex-col pt-24 sm:pt-32 pb-24 px-5 sm:px-8 md:px-12 max-w-[1240px] mx-auto text-[var(--m-mist)]">
        {/* ── 1. HERO SECTION ── */}
        <section
          aria-labelledby="about-hero-title"
          className="w-full flex flex-col items-start pt-6 sm:pt-12 pb-16 sm:pb-24 border-b border-white/[0.08]"
        >
          {/* Technical Origin Badge */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
            <span className="px-2.5 py-1 rounded-sm text-[10px] sm:text-xs font-mono font-bold tracking-[0.24em] uppercase bg-[var(--m-gold)]/15 text-[var(--m-gold)] border border-[var(--m-gold)]/30">
              ORIGIN // GIZA, EG
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[var(--m-cream)]/40 uppercase">
              ARCHIVE 001
            </span>
          </div>

          {/* Main Hero Typography */}
          <h1
            id="about-hero-title"
            className="font-black uppercase tracking-[0.06em] text-[var(--m-cream)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl mb-6 sm:mb-8"
            style={{ fontFamily: "var(--m-font-heading)" }}
          >
            BORN IN GIZA.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--m-yellow)] via-[var(--m-gold)] to-[var(--m-orange)]">
              BUILT FOR MOVEMENT.
            </span>
          </h1>

          {/* Hero Equation & Subtitle */}
          <div className="w-full max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 text-xs sm:text-sm font-mono text-[var(--m-cream)]/70">
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[var(--m-cream)]">
              <span className="tracking-[0.16em] uppercase">METRO</span>
              <span className="text-[var(--m-gold)]">+</span>
              <span className="tracking-[0.16em] uppercase">NARY</span>
              <span className="text-[var(--m-gold)] font-normal text-lg sm:text-xl font-sans mr-1">
                /
              </span>
              <span className="text-[var(--m-gold)] font-bold text-base sm:text-lg">
                ناري
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--m-cream)]/60 font-mono tracking-wide">
              A fiery underground metro racing with unstoppable velocity.
            </p>
          </div>
        </section>

        {/* ── 2. BRAND ORIGIN: THE EQUATION ── */}
        <section
          aria-labelledby="brand-origin-heading"
          className="w-full py-16 sm:py-24 border-b border-white/[0.08]"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--m-gold)] shadow-[0_0_8px_rgba(251,133,0,0.8)]" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.24em] uppercase text-[var(--m-gold)]">
              THE FORMULA // METRO + NARY
            </span>
          </div>

          <h2
            id="brand-origin-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.08em] text-[var(--m-cream)] leading-tight mb-12 sm:mb-16 max-w-3xl"
            style={{ fontFamily: "var(--m-font-heading)" }}
          >
            WHERE TRANSIT VELOCITY MEETS WEARABLE HEAT.
          </h2>

          {/* 2-Column Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Card 1: METRO */}
            <div className="p-8 sm:p-10 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] backdrop-blur-md flex flex-col justify-between gap-6 hover:border-[var(--m-gold)]/40 transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span className="text-xs font-mono font-bold tracking-[0.24em] uppercase text-[var(--m-gold)]">
                  01 // THE METRO
                </span>
                <span className="text-xs font-mono tracking-widest text-[var(--m-cream)]/40 uppercase">
                  مترو
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[var(--m-cream)]">
                  MOVEMENT & SPEED
                </h3>
                <p className="text-xs sm:text-sm text-[var(--m-cream)]/70 leading-relaxed font-mono">
                  The subterranean pulse of city transit. An underground
                  subculture in continuous momentum, pushing through tunnels,
                  unbound by static routines and constantly racing forward.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["VELOCITY", "UNDERGROUND", "MOMENTUM", "TRANSIT"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider bg-white/[0.04] text-[var(--m-cream)]/80 border border-white/[0.06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: NARY */}
            <div className="p-8 sm:p-10 rounded-xl bg-[rgba(20,20,18,0.65)] border border-white/[0.08] backdrop-blur-md flex flex-col justify-between gap-6 hover:border-[var(--m-gold)]/40 transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span className="text-xs font-mono font-bold tracking-[0.24em] uppercase text-[var(--m-gold)]">
                  02 // NARY / ناري
                </span>
                <span className="text-xs font-mono tracking-widest text-[var(--m-gold)] uppercase font-bold">
                  FIERY • BLAZING
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[var(--m-cream)]">
                  HEAT & INTENSITY
                </h3>
                <p className="text-xs sm:text-sm text-[var(--m-cream)]/70 leading-relaxed font-mono">
                  Egyptian Arabic for fiery, blazing, and intense. The kinetic
                  heat that sparks creativity, bold self-expression, and raw
                  energy across graphics, typography, and tailored silhouettes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["BLAZE", "RAW HEAT", "INTENSITY", "EGYPTIAN"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider bg-white/[0.04] text-[var(--m-gold)] border border-[var(--m-gold)]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. GIZA SECTION: GEOGRAPHY & IDENTITY ── */}
        <section
          aria-labelledby="giza-origin-heading"
          className="w-full py-16 sm:py-24 border-b border-white/[0.08]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Manifest / Statement */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.2em] bg-[var(--m-gold)]/20 text-[var(--m-gold)] border border-[var(--m-gold)]/30 font-bold">
                  GEOGRAPHIC ANCHOR
                </span>
              </div>

              <h2
                id="giza-origin-heading"
                className="text-3xl sm:text-5xl font-black uppercase tracking-[0.06em] text-[var(--m-cream)] leading-tight"
                style={{ fontFamily: "var(--m-font-heading)" }}
              >
                BORN IN GIZA, EGYPT.
              </h2>

              <div className="flex flex-col gap-4 text-xs sm:text-sm font-mono text-[var(--m-cream)]/80 leading-relaxed max-w-2xl">
                <p className="text-sm sm:text-base text-[var(--m-cream)] font-bold">
                  Not inspired by somewhere else. Built from where we are.
                </p>
                <p>
                  METRONARY is grounded in the raw rhythm and restless pulse of
                  Giza. From bustling transit hubs to experimental street culture,
                  the brand channels the unfiltered momentum of our home city.
                </p>
                <p className="text-[var(--m-cream)]/60">
                  We don&apos;t chase borrowed aesthetics. We engineer streetwear
                  that carries the local intensity of Giza into modern,
                  high-concept garments built for those who stay ahead of the curve.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-[11px] font-mono text-[var(--m-cream)]/50 uppercase tracking-widest">
                <span>COORD // 29.9870° N, 31.2118° E</span>
                <span>ORIGIN // GIZA PROVINCE</span>
              </div>
            </div>

            {/* Right: Graphic Brand Accent */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-sm p-8 sm:p-10 rounded-2xl bg-[rgba(20,20,18,0.8)] border border-[var(--m-gold)]/30 shadow-[0_0_32px_rgba(251,133,0,0.15)] flex flex-col items-center text-center gap-6">
                <LogoPrimary
                  size={72}
                  className="filter drop-shadow-[0_0_20px_rgba(232,93,4,0.6)]"
                />

                <div className="flex flex-col gap-1">
                  <span
                    className="font-black uppercase tracking-[0.24em] text-[var(--m-cream)] text-xl"
                    style={{ fontFamily: "var(--m-font-heading)" }}
                  >
                    METRONARY
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--m-gold)]">
                    GIZA, EGYPT
                  </span>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--m-gold)]/40 to-transparent" />

                <p className="text-[11px] font-mono text-[var(--m-cream)]/60 uppercase tracking-wider leading-relaxed">
                  Underground Energy • Wearable Fire • Engineered for Movement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. BRAND PHILOSOPHY / KINETIC PILLARS ── */}
        <section
          aria-labelledby="philosophy-heading"
          className="w-full py-16 sm:py-24 border-b border-white/[0.08]"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.24em] uppercase text-[var(--m-gold)] block mb-2">
                KINETIC PILLARS
              </span>
              <h2
                id="philosophy-heading"
                className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.08em] text-[var(--m-cream)]"
                style={{ fontFamily: "var(--m-font-heading)" }}
              >
                HOW WE MOVE
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[var(--m-cream)]/50 uppercase tracking-wider max-w-xs sm:text-right">
              FOUR CORE PRINCIPLES DRIVING EVERY SILHOUETTE.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-xl bg-[rgba(20,20,18,0.55)] border border-white/[0.06] flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-[var(--m-gold)] tracking-widest">
                01 //
              </span>
              <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--m-cream)]">
                MOVEMENT
              </h3>
              <p className="text-xs font-mono text-[var(--m-cream)]/70 leading-relaxed">
                Never static. Our garments are cut for active everyday velocity,
                engineered with generous volume and natural drape.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-xl bg-[rgba(20,20,18,0.55)] border border-white/[0.06] flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-[var(--m-gold)] tracking-widest">
                02 //
              </span>
              <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--m-cream)]">
                HEAT
              </h3>
              <p className="text-xs font-mono text-[var(--m-cream)]/70 leading-relaxed">
                Warm tones, fiery energy, and vivid tactile prints. A visual
                temperature that stands apart from muted minimalism.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-xl bg-[rgba(20,20,18,0.55)] border border-white/[0.06] flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-[var(--m-gold)] tracking-widest">
                03 //
              </span>
              <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--m-cream)]">
                SPEED
              </h3>
              <p className="text-xs font-mono text-[var(--m-cream)]/70 leading-relaxed">
                Ahead of the curve. Racing ahead of transient micro-trends with
                assertive, enduring streetwear silhouettes.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-xl bg-[rgba(20,20,18,0.55)] border border-white/[0.06] flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-[var(--m-gold)] tracking-widest">
                04 //
              </span>
              <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--m-cream)]">
                EXPERIMENT
              </h3>
              <p className="text-xs font-mono text-[var(--m-cream)]/70 leading-relaxed">
                Bold graphics, customized color treatments, and meticulous
                screenprint layering crafted through relentless sampling.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. CLOSING MANIFESTO & ACTION ── */}
        <section
          aria-labelledby="manifesto-heading"
          className="w-full pt-16 sm:pt-24 flex flex-col items-center text-center gap-8"
        >
          <div className="flex flex-col items-center gap-4 max-w-2xl">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.28em] uppercase text-[var(--m-gold)]">
              UNSTOPPABLE MOMENTUM
            </span>
            <h2
              id="manifesto-heading"
              className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.06em] text-[var(--m-cream)] leading-tight"
              style={{ fontFamily: "var(--m-font-heading)" }}
            >
              WEARABLE FIRE.
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[var(--m-cream)]/70 leading-relaxed">
              Explore the current catalog of high-concept garments born in Giza, Egypt.
            </p>
          </div>

          <Link
            href={ROUTES.shop}
            className="px-8 py-3.5 rounded-lg text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] transition-all shadow-[0_0_24px_rgba(251,133,0,0.35)] flex items-center gap-2"
          >
            <span>DISCOVER THE PIECES</span>
            <span>→</span>
          </Link>
        </section>
      </div>
    </MetronaryBackground>
  );
}
