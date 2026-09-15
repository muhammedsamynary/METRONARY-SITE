"use client";

import React, { useState, useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoPrimary, Wordmark } from "@/components/brand/Logo";
import { ROUTES } from "@/lib/constants";
import { CartTrigger } from "@/components/cart/CartTrigger";
import type { HomepageLayoutMode } from "@/components/home/LayoutToggle";

const STORAGE_KEY = "metronary_homepage_layout";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): HomepageLayoutMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "original" || saved === "grid") {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return "original";
}

function getServerSnapshot(): HomepageLayoutMode {
  return "original";
}

/**
 * ─── FLOATING THREE-GROUP STOREFRONT HEADER ───
 *
 * No full-width dark rectangle background.
 * Page background remains fully visible between three floating UI islands:
 * 1. LEFT: METRONARY logo + wordmark floating independently.
 * 2. CENTER: Rounded glass navigation pill.
 * 3. RIGHT: Compact MESSY / GRID switcher + Cart trigger.
 */
export function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const syncedLayout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localLayout, setLocalLayout] = useState<HomepageLayoutMode | null>(null);
  const layout = localLayout ?? syncedLayout;

  const handleSelectLayout = useCallback((mode: HomepageLayoutMode) => {
    setLocalLayout(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomepage) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const aboutElement = document.getElementById("about");
      if (aboutElement) {
        aboutElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full pointer-events-none bg-transparent border-none"
      style={{ zIndex: "var(--m-z-header)" }}
      aria-label="Site Navigation"
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between gap-3 pointer-events-auto">
        {/* ── 1. LEFT: METRONARY Mark + Wordmark (Floating Independently) ── */}
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-md py-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
          aria-label="METRONARY homepage"
        >
          <LogoPrimary
            size={34}
            priority
            className="filter drop-shadow-[0_2px_14px_rgba(232,93,4,0.65)] transition-transform duration-300 group-hover:scale-105 sm:w-[38px] sm:h-[38px]"
          />
          <Wordmark
            size="sm"
            className="tracking-[0.2em] sm:tracking-[0.24em] opacity-95 group-hover:opacity-100 transition-opacity drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-xs sm:text-sm font-black text-[var(--m-cream)]"
          />
        </Link>

        {/* ── 2. CENTER: Floating Rounded Glass Nav Pill (Desktop Only) ── */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[rgba(18,14,9,0.8)] backdrop-blur-2xl border border-[rgba(245,244,238,0.16)] shadow-[0_12px_36px_rgba(0,0,0,0.55)]">
            <Link
              href={ROUTES.home}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
                isHomepage
                  ? "text-[var(--m-gold)] bg-white/[0.06] shadow-[0_1px_8px_rgba(251,133,0,0.3)]"
                  : "text-[rgba(245,244,238,0.75)] hover:text-[var(--m-cream)] hover:bg-white/[0.04]"
              }`}
            >
              HOME
            </Link>

            <Link
              href={ROUTES.about}
              onClick={handleAboutClick}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[rgba(245,244,238,0.75)] hover:text-[var(--m-cream)] hover:bg-white/[0.04] transition-all duration-200"
            >
              ABOUT US
            </Link>

            <Link
              href={ROUTES.policy}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
                pathname === "/policy"
                  ? "text-[var(--m-gold)] bg-white/[0.06] shadow-[0_1px_8px_rgba(251,133,0,0.3)]"
                  : "text-[rgba(245,244,238,0.75)] hover:text-[var(--m-cream)] hover:bg-white/[0.04]"
              }`}
            >
              POLICY
            </Link>
          </div>
        </nav>

        {/* ── 3. RIGHT: Homepage Layout Switcher + Cart (Floating Group) ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Layout Control (MESSY <-> GRID) */}
          {isHomepage && (
            <div
              className="flex items-center p-1 rounded-full bg-[rgba(18,14,9,0.85)] backdrop-blur-2xl border border-[rgba(245,244,238,0.16)] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
              aria-label="Product layout selector"
            >
              <button
                type="button"
                onClick={() => handleSelectLayout("original")}
                aria-pressed={layout === "original"}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.16em] uppercase transition-all duration-200 min-h-[28px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] ${
                  layout === "original"
                    ? "bg-[var(--m-gold)] text-black shadow-[0_2px_10px_rgba(251,133,0,0.45)] font-black"
                    : "text-[rgba(245,244,238,0.65)] hover:text-white"
                }`}
              >
                MESSY
              </button>

              <button
                type="button"
                onClick={() => handleSelectLayout("grid")}
                aria-pressed={layout === "grid"}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.16em] uppercase transition-all duration-200 min-h-[28px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] ${
                  layout === "grid"
                    ? "bg-[var(--m-gold)] text-black shadow-[0_2px_10px_rgba(251,133,0,0.45)] font-black"
                    : "text-[rgba(245,244,238,0.65)] hover:text-white"
                }`}
              >
                GRID
              </button>
            </div>
          )}

          {/* Dynamic Cart Trigger */}
          <CartTrigger />

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(18,14,9,0.85)] backdrop-blur-2xl border border-white/[0.14] text-[var(--m-cream)] hover:text-[var(--m-gold)] shadow-[0_4px_16px_rgba(0,0,0,0.45)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)]"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Dropdown ── */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-xs mx-auto mt-1 px-4 pointer-events-auto">
          <div className="rounded-2xl border border-white/[0.12] bg-[rgba(16,12,8,0.96)] backdrop-blur-2xl px-6 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex flex-col gap-3 animate-fadeIn select-none">
            <nav aria-label="Mobile Navigation">
              <ul className="flex flex-col gap-2.5 list-none m-0 p-0 font-mono text-xs tracking-[0.2em] uppercase">
                <li>
                  <Link
                    href={ROUTES.home}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 ${
                      isHomepage ? "text-[var(--m-gold)] font-bold" : "text-[var(--m-cream)]/85"
                    }`}
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.about}
                    onClick={handleAboutClick}
                    className="block py-1.5 text-[var(--m-cream)]/85 hover:text-[var(--m-gold)]"
                  >
                    ABOUT US
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.policy}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 ${
                      pathname === "/policy"
                        ? "text-[var(--m-gold)] font-bold"
                        : "text-[var(--m-cream)]/85 hover:text-[var(--m-gold)]"
                    }`}
                  >
                    POLICY
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.terms}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 ${
                      pathname === "/terms"
                        ? "text-[var(--m-gold)] font-bold"
                        : "text-[var(--m-cream)]/85 hover:text-[var(--m-gold)]"
                    }`}
                  >
                    TERMS
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
