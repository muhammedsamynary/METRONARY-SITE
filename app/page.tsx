"use client";

import { useState } from "react";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT, getProductHoverTheme } from "@/lib/theme/gradient.presets";
import { ProductField, HomeBrandStatement } from "@/components/home";

export default function HomePage() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeTheme = hoveredSlug ? getProductHoverTheme(hoveredSlug) : PRESET_DEFAULT;

  return (
    <MetronaryBackground
      theme={activeTheme}
      className="w-full min-h-screen flex flex-col"
    >
      {/* ── CONTINUOUS SPATIAL PRODUCT ENVIRONMENT (SKYLRK RHYTHM) ── */}
      <main
        className="relative w-full flex-1 flex flex-col overflow-hidden"
        aria-label="Metronary Storefront"
      >
        <ProductField onHoverProduct={setHoveredSlug} />

        {/* Quiet Editorial Brand Anchor (Lower Left Margin of Initial Viewport) */}
        <HomeBrandStatement />
      </main>
    </MetronaryBackground>
  );
}
