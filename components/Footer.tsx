"use client";

import React from "react";
import Link from "next/link";
import { SITE, ROUTES } from "@/lib/constants";

/**
 * ─── REFERENCE-ACCURATE NARY BRAND FOOTER ───
 *
 * Visually matched to `references/nary-footer-reference.png`:
 * - Warm glowing fiery background (burnt orange, deep amber, golden top-right glow).
 * - Thin golden/orange divider grid lines.
 * - Left column: Large, elegant Quranic verse (Surah Saba: 39).
 * - Center column: SHOP, ABOUT US, POLICY, TERMS.
 * - Right column: FOLLOW NARY with outlined square Instagram and Facebook icons.
 * - Giant solid off-white NARY® wordmark spanning full width.
 * - Copyright row: "© 2026 NARY" and "ALL RIGHTS RESERVED".
 * - Bottom strip: Large repeating Arabic "ناري" in warm gold.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative w-full border-t border-[#d97706]/70 text-[#faf6f0] overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 85% 15%, #a84200 0%, #682200 40%, #3a1000 75%, #240a00 100%)",
      }}
      aria-label="NARY Brand Footer"
    >
      <div className="w-full">
        {/* ── 1. UPPER SECTION: 3-Column Grid with Golden Dividers ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#d97706]/70">
          {/* ── LEFT COLUMN: Holy Quranic Verse (Saba: 39) ── */}
          <div className="md:col-span-5 p-6 sm:p-10 lg:p-12 flex items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#d97706]/70">
            <p
              dir="rtl"
              className="text-base sm:text-lg md:text-xl lg:text-[22px] font-serif leading-[2.1] sm:leading-[2.2] text-[#fdfcf8] font-medium tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] max-w-lg"
              style={{
                fontFamily:
                  "'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', Georgia, serif",
              }}
            >
              ﴿إِنَّ رَبِّي يَبْسُطُ الرِّزْقَ لِمَنْ يَشَاءُ مِنْ عِبَادِهِ وَيَقْدِرُ لَهُ وَمَا أَنْفَقْتُمْ مِنْ شَيْءٍ فَهُوَ يُخْلِفُهُ وَهُوَ خَيْرُ الرَّازِقِينَ﴾ [سبأ: 39].
            </p>
          </div>

          {/* ── CENTER COLUMN: Directory Navigation Links ── */}
          <div className="md:col-span-4 p-6 sm:p-10 lg:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#d97706]/70">
            <nav aria-label="Footer Navigation">
              <ul className="flex flex-col gap-3.5 sm:gap-4 list-none m-0 p-0 font-mono text-xs sm:text-sm tracking-[0.22em] uppercase font-bold text-[#faf6f0]">
                <li>
                  <Link
                    href={ROUTES.shop}
                    className="hover:text-[var(--m-gold)] transition-colors inline-block py-0.5"
                  >
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.about}
                    className="hover:text-[var(--m-gold)] transition-colors inline-block py-0.5"
                  >
                    ABOUT US
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.policy}
                    className="hover:text-[var(--m-gold)] transition-colors inline-block py-0.5"
                  >
                    POLICY
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.terms}
                    className="hover:text-[var(--m-gold)] transition-colors inline-block py-0.5"
                  >
                    TERMS
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* ── RIGHT COLUMN: Follow NARY Social Outlined Boxes ── */}
          <div className="md:col-span-3 p-6 sm:p-10 lg:p-12 flex flex-col justify-center gap-4 sm:gap-5">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.24em] text-[#faf6f0]">
              FOLLOW NARY
            </span>

            <div className="flex items-center gap-3.5">
              {/* Instagram Box */}
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-12 sm:h-12 border border-[#faf6f0]/90 flex items-center justify-center text-[#faf6f0] hover:text-[var(--m-gold)] hover:border-[var(--m-gold)] transition-all duration-200"
                aria-label="Follow NARY on Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
                className="w-11 h-11 sm:w-12 sm:h-12 border border-[#faf6f0]/90 flex items-center justify-center text-[#faf6f0] cursor-default"
                aria-label="Follow NARY on Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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

        {/* ── 2. GIANT NARY® MONUMENTAL WORDMARK SECTION ── */}
        <div className="w-full px-4 sm:px-8 py-2 sm:py-4 flex items-center justify-center border-b border-[#d97706]/70 overflow-hidden">
          <div className="relative flex items-center justify-center max-w-full">
            <span
              className="font-black uppercase text-[#faf6f0] tracking-[-0.02em] sm:tracking-[-0.01em] leading-none whitespace-nowrap select-none drop-shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
              style={{
                fontFamily: "var(--m-font-heading)",
                fontSize: "clamp(5.5rem, 24vw, 24rem)",
              }}
            >
              NARY
            </span>
            {/* Registered Trademark Symbol ® */}
            <span
              className="font-bold text-[#faf6f0] leading-none select-none align-top -translate-y-8 sm:-translate-y-16 md:-translate-y-24 lg:-translate-y-28 ml-1 sm:ml-2"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 4.5rem)",
              }}
            >
              ®
            </span>
          </div>
        </div>

        {/* ── 3. COPYRIGHT ROW ── */}
        <div className="w-full px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] text-[#faf6f0] uppercase border-b border-[#d97706]/70">
          <p>© {year} NARY</p>
          <p>ALL RIGHTS RESERVED</p>
        </div>

        {/* ── 4. VERY BOTTOM FULL-WIDTH REPEATING ARABIC STRIP ── */}
        <div className="w-full py-4 px-4 bg-[#260a00] flex items-center justify-center overflow-hidden">
          <div className="w-full flex items-center justify-between gap-4 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#f59e0b] tracking-[0.3em] whitespace-nowrap overflow-hidden">
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
            <span>ناري</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
