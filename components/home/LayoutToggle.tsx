"use client";

import React from "react";

export type HomepageLayoutMode = "original" | "grid";

interface LayoutToggleProps {
  layout: HomepageLayoutMode;
  onSelectLayout: (layout: HomepageLayoutMode) => void;
  className?: string;
}

/**
 * ─── MINIMAL HOMEPAGE LAYOUT SWITCHER ───
 *
 * Switches between:
 * 1. "original" (MESSY): Original Metronary spatial floating composition.
 * 2. "grid" (GRID): Yeezy-style clean catalog grid wall.
 */
export function LayoutToggle({
  layout,
  onSelectLayout,
  className = "",
}: LayoutToggleProps) {
  return (
    <aside
      aria-label="Homepage Layout Mode Switcher"
      className={`fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none ${className}`}
    >
      <div className="flex items-center p-1 rounded-full bg-[rgba(14,11,7,0.85)] backdrop-blur-2xl border border-[rgba(245,244,238,0.16)] shadow-[0_12px_36px_rgba(0,0,0,0.45)] text-[var(--m-cream)]">
        {/* Layout 1: Original Messy */}
        <button
          type="button"
          onClick={() => onSelectLayout("original")}
          aria-pressed={layout === "original"}
          className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.16em] uppercase transition-all duration-200 min-h-[32px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] ${
            layout === "original"
              ? "bg-[var(--m-gold)] text-black shadow-[0_2px_12px_rgba(251,133,0,0.45)]"
              : "text-[rgba(245,244,238,0.65)] hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          MESSY
        </button>

        {/* Layout 2: Yeezy Clean Grid */}
        <button
          type="button"
          onClick={() => onSelectLayout("grid")}
          aria-pressed={layout === "grid"}
          className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.16em] uppercase transition-all duration-200 min-h-[32px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--m-gold)] ${
            layout === "grid"
              ? "bg-[var(--m-gold)] text-black shadow-[0_2px_12px_rgba(251,133,0,0.45)]"
              : "text-[rgba(245,244,238,0.65)] hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          GRID
        </button>
      </div>
    </aside>
  );
}
