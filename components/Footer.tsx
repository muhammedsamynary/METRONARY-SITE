import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { LogoPrimary } from "@/components/brand/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative w-full border-t border-white/[0.08] bg-[#0c0c0a] text-[var(--m-mist)] overflow-hidden"
      aria-label="Site Footer"
    >
      {/* Top subtle fiery amber ambient light */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--m-gold)]/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 pt-16 sm:pt-20 pb-12 flex flex-col gap-12 sm:gap-16">
        {/* ── TOP LAYER: Editorial Brand Identity & Navigation Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-12 border-b border-white/[0.06]">
          {/* Brand Identity / Core Summary (Left 5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <LogoPrimary
                size={32}
                className="filter drop-shadow-[0_0_12px_rgba(232,93,4,0.5)]"
              />
              <span
                className="font-black uppercase tracking-[0.24em] text-[var(--m-cream)] text-lg"
                style={{ fontFamily: "var(--m-font-heading)" }}
              >
                METRONARY
              </span>
            </div>

            <p className="text-xs sm:text-sm font-mono text-[var(--m-cream)]/70 leading-relaxed max-w-sm">
              Metronary—derived from Metro &amp; Nary (ناري)—means a blazing,
              fiery metro racing with unstoppable speed. Born in Giza, Egypt.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--m-gold)] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[var(--m-gold)]">
                BORN IN GIZA, EGYPT
              </span>
            </div>
          </div>

          {/* Navigation Links (Middle 3 Cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[var(--m-gold)]">
              NAVIGATION
            </span>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3 list-none m-0 p-0 font-mono text-xs">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-[var(--m-cream)]/75 hover:text-[var(--m-gold)] transition-colors duration-200 tracking-wider uppercase"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Direct Connect & Origin (Right 4 Cols) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[var(--m-gold)]">
              DISPATCH & CONNECT
            </span>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[var(--m-cream)]/40 block mb-0.5 uppercase tracking-wider">
                  DIRECT INQUIRIES
                </span>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-block py-1 text-[var(--m-cream)]/85 hover:text-[var(--m-gold)] transition-colors duration-200"
                >
                  {SITE.email}
                </a>
              </div>

              {SITE.social.instagram && (
                <div>
                  <span className="text-[10px] text-[var(--m-cream)]/40 block mb-0.5 uppercase tracking-wider">
                    SOCIAL ARCHIVE
                  </span>
                  <a
                    href={SITE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1 text-[var(--m-cream)]/85 hover:text-[var(--m-gold)] transition-colors duration-200"
                  >
                    <span>INSTAGRAM</span>
                    <span className="text-[10px] text-[var(--m-gold)]">↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MIDDLE LAYER: Large Clamped Brand Wordmark Statement ── */}
        <div
          className="w-full flex flex-col items-center justify-center text-center select-none py-2"
          aria-hidden="true"
        >
          <span
            className="w-full font-black uppercase text-center text-transparent bg-clip-text bg-gradient-to-b from-white/[0.16] to-white/[0.02] tracking-[0.14em] sm:tracking-[0.18em] leading-none"
            style={{
              fontFamily: "var(--m-font-heading)",
              fontSize: "clamp(2.5rem, 11vw, 7.5rem)",
            }}
          >
            METRONARY
          </span>
          <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--m-gold)]/60 mt-2">
            UNDERGROUND ENERGY • WEARABLE FIRE
          </span>
        </div>

        {/* ── BOTTOM BAR: Copyright & Coordinate Details ── */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] font-mono text-[var(--m-cream)]/45">
          <p>© {year} METRONARY. ALL RIGHTS RESERVED.</p>

          <div className="flex items-center gap-3">
            <span>GIZA, EGYPT</span>
            <span>•</span>
            <span className="text-[var(--m-gold)] font-bold">ناري</span>
            <span>•</span>
            <span>29.9870° N, 31.2118° E</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
