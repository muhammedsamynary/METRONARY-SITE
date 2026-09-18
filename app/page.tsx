"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT, getProductHoverTheme } from "@/lib/theme/gradient.presets";
import {
  ProductField,
  CatalogGrid,
  HOMEPAGE_PRODUCTS,
  type HomepageLayoutMode,
} from "@/components/home";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { Footer } from "@/components/Footer";
import { AboutContent } from "@/components/about/AboutContent";

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
 * ─── CINEMATIC HOMEPAGE EXPERIENCE ───
 *
 * Continuous fashion narrative:
 * 1. Product Experience (MESSY spatial composition or GRID wall)
 * 2. Gentle scroll-linked exit motion easing into...
 * 3. Full-Viewport NARY Brand Footer Poster (min-h-[100svh])
 * 4. Seamless continuation into About Us brand story & manifesto
 */
export default function HomePage() {
  const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Subtle scroll-linked exit easing for product field
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Normalized progress towards bottom of products before reaching footer
        const progress = Math.min(1, Math.max(0, (scrollY - 300) / 1200));
        setScrollProgress(progress);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Active theme dynamically shifts based on hovered garment across both layouts
  const activeTheme = hoveredSlug ? getProductHoverTheme(hoveredSlug) : PRESET_DEFAULT;

  // Product exit transition styles (subtle upward drift and soft opacity easing)
  const productExitStyle: React.CSSProperties = {
    transform: `translate3d(0, ${-scrollProgress * 40}px, 0)`,
    opacity: 1 - scrollProgress * 0.25,
    transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
  };

  return (
    <MetronaryBackground
      theme={activeTheme}
      className="w-full min-h-screen flex flex-col transition-colors duration-700"
    >
      {/* ── 1. PRIMARY STOREFRONT PRODUCT EXPERIENCE (MESSY OR GRID) ── */}
      <main
        className="relative w-full flex-1 flex flex-col"
        style={productExitStyle}
        aria-label="Metronary Storefront"
      >
        {layout === "original" ? (
          /* ── LAYOUT 1: ORIGINAL METRONARY SPATIAL / MESSY COMPOSITION ── */
          <ProductField
            products={HOMEPAGE_PRODUCTS}
            onHoverProduct={setHoveredSlug}
          />
        ) : (
          /* ── LAYOUT 2: YEEZY-STYLE CLEAN CATALOG GRID IN SAME FIERY WORLD ── */
          <CatalogGrid
            products={HOMEPAGE_PRODUCTS}
            onHoverProduct={setHoveredSlug}
          />
        )}
      </main>

      {/* ── Floating Minimal Scroll Indicator (Initial Viewport) ── */}
      <ScrollIndicator />

      {/* ── 2. TRANSITIONAL BRIDGE: FULL-VIEWPORT NARY BRAND FOOTER ── */}
      <Footer />

      {/* ── 3. CONTINUOUS SCROLL: ABOUT US CONTENT ── */}
      <section
        id="about"
        aria-label="About METRONARY"
        className="w-full relative border-t border-[var(--m-gold)]/20 bg-gradient-to-b from-[#080604] via-[#0f0b07] to-[var(--m-dark)]"
      >
        <AboutContent />
      </section>
    </MetronaryBackground>
  );
}
