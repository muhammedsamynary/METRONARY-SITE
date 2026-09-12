"use client";

import React from "react";

export interface ColorOption {
  name: string;
  disabled?: boolean;
}

interface ProductColorSelectorProps {
  colors: (string | ColorOption)[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
  className?: string;
}

export function ProductColorSelector({
  colors,
  selectedColor,
  onSelectColor,
  className = "",
}: ProductColorSelectorProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  // Normalize options to { name, disabled }
  const normalizedOptions: ColorOption[] = colors.map((c) =>
    typeof c === "string" ? { name: c, disabled: false } : c
  );

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* ── Color Header ── */}
      <div className="flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-[rgba(245,244,238,0.7)] font-medium">
        <span>Color</span>
        {selectedColor && (
          <span className="text-[var(--m-gold)] font-mono text-[10px] tracking-wider">
            {selectedColor}
          </span>
        )}
      </div>

      {/* ── Color Selection Matrix (SKYLRK / METRONARY Aesthetic) ── */}
      <div
        className="flex flex-wrap items-center gap-2.5"
        role="radiogroup"
        aria-label="Select product color"
      >
        {normalizedOptions.map(({ name: color, disabled }) => {
          const isSelected = selectedColor === color;

          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              aria-disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onSelectColor(color);
                }
              }}
              className={`min-w-[56px] h-10 px-4 rounded-lg border text-[11px] font-mono tracking-wider font-semibold uppercase flex items-center justify-center transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] ${
                isSelected
                  ? "border-[var(--m-gold)] bg-[rgba(251,133,0,0.18)] text-[var(--m-cream)] shadow-[0_0_14px_rgba(251,133,0,0.45)] scale-105"
                  : disabled
                  ? "border-[rgba(245,244,238,0.08)] bg-[rgba(245,244,238,0.02)] text-[rgba(245,244,238,0.25)] cursor-not-allowed line-through"
                  : "border-[rgba(245,244,238,0.15)] bg-[rgba(245,244,238,0.04)] text-[rgba(245,244,238,0.85)] hover:border-[var(--m-gold)] hover:text-[var(--m-cream)] hover:bg-[rgba(251,133,0,0.06)] cursor-pointer"
              }`}
            >
              {color}
            </button>
          );
        })}
      </div>
    </div>
  );
}
