"use client";

import { useState } from "react";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT, getProductHoverTheme } from "@/lib/theme/gradient.presets";
import {
  SpatialScene,
  HomeBrandStatement,
  SCENE_1_PRODUCTS,
  SCENE_2_PRODUCTS,
  SCENE_3_PRODUCTS,
} from "@/components/home";

export default function HomePage() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeTheme = hoveredSlug ? getProductHoverTheme(hoveredSlug) : PRESET_DEFAULT;

  return (
    <MetronaryBackground
      theme={activeTheme}
      className="w-full min-h-screen flex flex-col"
    >
      {/* ── SPATIAL SCENE 1: Flagship Core Collection (First Viewport) ── */}
      <section
        className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-between overflow-hidden"
        aria-label="Metronary Core Spatial Scene"
      >
        <SpatialScene
          products={SCENE_1_PRODUCTS}
          onHoverProduct={setHoveredSlug}
          aria-label="Core collection garments"
        />

        {/* Quiet Editorial Brand Anchor (Lower Left Margin) */}
        <HomeBrandStatement />
      </section>

      {/* ── SPATIAL SCENE 2: Archival Graphics Field (Second Viewport) ── */}
      <section
        className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-center overflow-hidden"
        aria-label="Metronary Archival Graphics Scene"
      >
        <SpatialScene
          products={SCENE_2_PRODUCTS}
          onHoverProduct={setHoveredSlug}
          aria-label="Archival graphic garments"
        />
      </section>

      {/* ── SPATIAL SCENE 3: Tactical Cargo Shorts (Third Viewport) ── */}
      <section
        className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-center overflow-hidden pb-16"
        aria-label="Metronary Cargo Shorts Scene"
      >
        <SpatialScene
          products={SCENE_3_PRODUCTS}
          onHoverProduct={setHoveredSlug}
          aria-label="Cargo shorts collection"
        />
      </section>
    </MetronaryBackground>
  );
}
