"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT, getProductHoverTheme } from "@/lib/theme/gradient.presets";
import {
  ProductField,
  CatalogGrid,
  LayoutToggle,
  HOMEPAGE_PRODUCTS,
  type HomepageLayoutMode,
} from "@/components/home";

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
    // Ignore localStorage access failures (e.g. private browsing)
  }
  return "original";
}

function getServerSnapshot(): HomepageLayoutMode {
  return "original";
}

export default function HomePage() {
  const [localLayout, setLocalLayout] = useState<HomepageLayoutMode | null>(null);
  const syncedLayout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const layout = localLayout ?? syncedLayout;

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const handleSelectLayout = useCallback((mode: HomepageLayoutMode) => {
    setLocalLayout(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore localStorage access failures
    }
  }, []);

  // Active theme dynamically shifts based on hovered garment in Layout 1
  const activeTheme = hoveredSlug ? getProductHoverTheme(hoveredSlug) : PRESET_DEFAULT;

  return (
    <>
      {layout === "original" ? (
        /* ── LAYOUT 1: ORIGINAL METRONARY SPATIAL / MESSY COMPOSITION ── */
        <MetronaryBackground
          theme={activeTheme}
          className="w-full min-h-screen flex flex-col"
        >
          <main
            className="relative w-full flex-1 flex flex-col overflow-hidden"
            aria-label="Metronary Storefront"
          >
            <ProductField
              products={HOMEPAGE_PRODUCTS}
              onHoverProduct={setHoveredSlug}
            />
          </main>
        </MetronaryBackground>
      ) : (
        /* ── LAYOUT 2: YEEZY-STYLE CLEAN CATALOG GRID ── */
        <div
          className="w-full min-h-screen bg-[#ebebeb] text-[#141210] flex flex-col transition-colors duration-500"
          style={{ backgroundColor: "#ebebeb" }}
        >
          <main
            className="relative w-full flex-1 flex flex-col"
            aria-label="Metronary Catalog Grid"
          >
            <CatalogGrid products={HOMEPAGE_PRODUCTS} />
          </main>
        </div>
      )}

      {/* ── Minimal Layout Switcher ── */}
      <LayoutToggle layout={layout} onSelectLayout={handleSelectLayout} />
    </>
  );
}
