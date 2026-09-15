"use client";

import { useState, useSyncExternalStore } from "react";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT, getProductHoverTheme } from "@/lib/theme/gradient.presets";
import {
  ProductField,
  CatalogGrid,
  HOMEPAGE_PRODUCTS,
  type HomepageLayoutMode,
} from "@/components/home";
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

export default function HomePage() {
  const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Active theme dynamically shifts based on hovered garment across both layouts
  const activeTheme = hoveredSlug ? getProductHoverTheme(hoveredSlug) : PRESET_DEFAULT;

  return (
    <MetronaryBackground
      theme={activeTheme}
      className="w-full min-h-screen flex flex-col transition-colors duration-700"
    >
      {/* ── 1. PRIMARY STOREFRONT PRODUCT EXPERIENCE (MESSY OR GRID) ── */}
      <main
        className="relative w-full flex-1 flex flex-col"
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

      {/* ── 2. TRANSITIONAL BRIDGE: NEW NARY BRAND FOOTER ── */}
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
