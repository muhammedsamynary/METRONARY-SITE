"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE, ROUTES } from "@/lib/constants";

/**
 * ─── FULL-SCREEN NARY BRAND FOOTER SCENE ───
 *
 * Full-viewport poster experience (min-h-[100svh]):
 * - Upper section: Generous vertical breathing room, 3-column grid with golden dividers.
 * - Giant NARY® wordmark: Dominant central hero scaling up to 26rem.
 * - Copyright row: Cleanly spaced.
 * - Bottom strip: Full-width repeating Arabic "ناري" in warm amber.
 * - Scroll-linked cinematic reveal with prefers-reduced-motion support.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="nary-footer"
      className="relative w-full min-h-[100svh] flex flex-col justify-between border-t border-[#d97706]/70 text-[#faf6f0] overflow-hidden select-none transition-colors duration-700"
      style={{
        background:
          "radial-gradient(circle at 85% 15%, #a84200 0%, #682200 40%, #3a1000 75%, #240a00 100%)",
      }}
      aria-label="NARY Brand Footer"
    >
      {/* ── Top Golden Flare Accent ── */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[1.5px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent transition-opacity duration-1000 ${
          isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75"
        }`}
        aria-hidden="true"
      />

      <div className="w-full flex-1 flex flex-col justify-between">
        {/* ── 1. UPPER SECTION: 3-Column Grid with Golden Dividers ── */}
        <div
          className={`grid grid-cols-1 md:grid-cols-12 border-b border-[#d97706]/70 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* ── LEFT COLUMN: Holy Quranic Verse (Saba: 39) ── */}
          <div className="md:col-span-5 p-8 sm:p-12 lg:p-16 flex items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#d97706]/70">
            <p
              dir="rtl"
              className="text-base sm:text-xl md:text-2xl lg:text-[24px] font-serif leading-[2.2] sm:leading-[2.3] text-[#fdfcf8] font-medium tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] max-w-xl"
              style={{
                fontFamily:
                  "'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', Georgia, serif",
              }}
            >
              ﴿إِنَّ رَبِّي يَبْسُطُ الرِّزْقَ لِمَنْ يَشَاءُ مِنْ عِبَادِهِ وَيَقْدِرُ لَهُ وَمَا أَنْفَقْتُمْ مِنْ شَيْءٍ فَهُوَ يُخْلِفُهُ وَهُوَ خَيْرُ الرَّازِقِينَ﴾ [سبأ: 39].
            </p>
          </div>

          {/* ── CENTER COLUMN: Directory Navigation Links ── */}
          <div className="md:col-span-4 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#d97706]/70">
            <nav aria-label="Footer Navigation">
              <ul className="flex flex-col gap-4 sm:gap-5 list-none m-0 p-0 font-mono text-xs sm:text-sm tracking-[0.24em] uppercase font-bold text-[#faf6f0]">
                <li>
                  <Link
                    href={ROUTES.shop}
                    className="hover:text-[var(--m-gold)] hover:translate-x-1 transition-all inline-block py-0.5"
                  >
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.about}
                    className="hover:text-[var(--m-gold)] hover:translate-x-1 transition-all inline-block py-0.5"
                  >
                    ABOUT US
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.policy}
                    className="hover:text-[var(--m-gold)] hover:translate-x-1 transition-all inline-block py-0.5"
                  >
                    POLICY
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.terms}
                    className="hover:text-[var(--m-gold)] hover:translate-x-1 transition-all inline-block py-0.5"
                  >
                    TERMS
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* ── RIGHT COLUMN: Follow NARY Social Outlined Boxes ── */}
          <div className="md:col-span-3 p-8 sm:p-12 lg:p-16 flex flex-col justify-center gap-5 sm:gap-6">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.26em] text-[#faf6f0]">
              FOLLOW NARY
            </span>

            <div className="flex items-center gap-4">
              {/* Instagram Box */}
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 border border-[#faf6f0]/90 flex items-center justify-center text-[#faf6f0] hover:text-[var(--m-gold)] hover:border-[var(--m-gold)] hover:scale-105 transition-all duration-200"
                aria-label="Follow NARY on Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Facebook Box */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 border border-[#faf6f0]/90 flex items-center justify-center text-[#faf6f0] cursor-default"
                aria-label="Follow NARY on Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. GIANT NARY® MONUMENTAL WORDMARK SECTION (Dominant Centerpiece) ── */}
        <div className="w-full flex-1 min-h-[220px] sm:min-h-[300px] lg:min-h-[360px] px-4 sm:px-8 py-6 sm:py-10 flex items-center justify-center border-b border-[#d97706]/70 overflow-hidden">
          <div
            className={`relative flex items-center justify-center max-w-full transition-all duration-1000 delay-100 ease-out ${
              isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
            }`}
          >
            <span
              className="font-black uppercase text-[#faf6f0] tracking-[-0.03em] sm:tracking-[-0.02em] leading-none whitespace-nowrap select-none drop-shadow-[0_4px_40px_rgba(0,0,0,0.65)]"
              style={{
                fontFamily: "var(--m-font-heading)",
                fontSize: "clamp(6.5rem, 26vw, 26rem)",
              }}
            >
              NARY
            </span>
            {/* Registered Trademark Symbol ® */}
            <span
              className="font-bold text-[#faf6f0] leading-none select-none align-top -translate-y-10 sm:-translate-y-20 md:-translate-y-28 lg:-translate-y-36 ml-1.5 sm:ml-3"
              style={{
                fontSize: "clamp(1.8rem, 6vw, 5rem)",
              }}
            >
              ®
            </span>
          </div>
        </div>

        {/* ── 3. COPYRIGHT ROW ── */}
        <div className="w-full px-8 sm:px-14 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-mono tracking-[0.24em] text-[#faf6f0] uppercase border-b border-[#d97706]/70">
          <p>© {year} NARY</p>
          <p>ALL RIGHTS RESERVED</p>
        </div>

        {/* ── 4. VERY BOTTOM FULL-WIDTH REPEATING ARABIC CONTINUOUS MARQUEE BANNER ── */}
        <div
          className="w-full py-4 sm:py-5 bg-[#240a00] flex items-center overflow-hidden select-none border-t border-[#d97706]/40"
          aria-label="NARY Arabic Marquee Banner"
        >
          <div className="flex shrink-0 items-center justify-around min-w-full gap-8 sm:gap-14 pr-8 sm:pr-14 animate-marquee-rtl">
            {Array.from({ length: 24 }).map((_, idx) => (
              <span
                key={`nary-track1-${idx}`}
                className="text-lg sm:text-2xl lg:text-[26px] font-bold text-[#f59e0b] tracking-[0.35em] whitespace-nowrap drop-shadow-[0_0_12px_rgba(251,133,0,0.4)]"
                dir="rtl"
              >
                ناري
              </span>
            ))}
          </div>
          <div
            className="flex shrink-0 items-center justify-around min-w-full gap-8 sm:gap-14 pr-8 sm:pr-14 animate-marquee-rtl"
            aria-hidden="true"
          >
            {Array.from({ length: 24 }).map((_, idx) => (
              <span
                key={`nary-track2-${idx}`}
                className="text-lg sm:text-2xl lg:text-[26px] font-bold text-[#f59e0b] tracking-[0.35em] whitespace-nowrap drop-shadow-[0_0_12px_rgba(251,133,0,0.4)]"
                dir="rtl"
              >
                ناري
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
