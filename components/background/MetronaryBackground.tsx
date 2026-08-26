"use client";

/**
 * MetronaryBackground — Dynamic Gradient Engine with Smooth Thermal Shifts
 *
 * Architecture (4 layers, bottom → top):
 *
 *  Layer 0 · Warm base color fill (#110e09)
 *  Layer 1 · Resolution-independent CSS radial-gradient blobs (GPU-accelerated, multi-stop falloff, blur-diffused)
 *  Layer 2 · Supplied gradient artwork (gradient-bg.png) softly diffused as analog ambient haze (opacity ~0.12, blur-smoothed)
 *  Layer 3 · Ultra-fine procedural micro-grain (feTurbulence baseFrequency 1.85, opacity ~0.02)
 *
 * Strictly preserves the permanent METRONARY fiery palette:
 * Yellow (#ffd60a) → Gold (#fb8500) → Orange (#e85d04) → Ember (#9d2d00)
 */

import React, { useId, useState, useEffect } from "react";
import type { GradientTheme, GradientBlob } from "@/lib/theme/gradient.types";
import { PRESET_DEFAULT } from "@/lib/theme/gradient.presets";

interface MetronaryBackgroundProps {
  theme?: GradientTheme;
  /** Additional CSS class for the wrapper */
  className?: string;
  /** Children are rendered above all layers */
  children?: React.ReactNode;
}

/**
 * Convert a blob definition into a high-resolution, multi-stop CSS radial gradient
 * with an ultra-smooth quadratic falloff curve to eliminate color banding on Retina/4K.
 */
function blobToRadialGradient(blob: GradientBlob): string {
  const { x, y, radius, color, opacity } = blob;

  // Convert to CSS color with alpha
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Multi-stop eased falloff curve for liquid-smooth transitions
  const c100 = `rgba(${r},${g},${b},${(opacity * 1.1).toFixed(3)})`;
  const c75 = `rgba(${r},${g},${b},${(opacity * 0.75).toFixed(3)})`;
  const c40 = `rgba(${r},${g},${b},${(opacity * 0.38).toFixed(3)})`;
  const c10 = `rgba(${r},${g},${b},${(opacity * 0.08).toFixed(3)})`;

  return (
    `radial-gradient(ellipse ${radius * 1.15}% ${radius * 0.9}% at ${x}% ${y}%, ` +
    `${c100} 0%, ${c75} 25%, ${c40} 50%, ${c10} 75%, transparent 100%)`
  );
}

export function MetronaryBackground({
  theme = PRESET_DEFAULT,
  className = "",
  children,
}: MetronaryBackgroundProps) {
  const uid = useId();
  const [themeState, setThemeState] = useState<{
    active: GradientTheme;
    prev: GradientTheme | null;
    isCrossfading: boolean;
  }>({
    active: theme,
    prev: null,
    isCrossfading: false,
  });

  // Adjust state during render when prop changes (official React pattern)
  if (theme.name !== themeState.active.name) {
    setThemeState({
      active: theme,
      prev: themeState.active,
      isCrossfading: true,
    });
  }

  const { active, prev, isCrossfading } = themeState;

  // Clear previous theme after crossfade completes
  useEffect(() => {
    if (isCrossfading) {
      const timer = setTimeout(() => {
        setThemeState((curr) => ({
          ...curr,
          prev: null,
          isCrossfading: false,
        }));
      }, 950);
      return () => clearTimeout(timer);
    }
  }, [isCrossfading]);

  // Micro-fine grain and soft atmospheric haze controls
  const grainOpacity = Math.min(active.grainOpacity ?? 0.02, 0.025);
  const artworkOpacity = Math.min(active.artworkOpacity ?? 0.12, 0.16);
  const rotation = active.rotation ?? 0;

  // Build multi-layer CSS background (blobs, stacked)
  const activeGradients = active.blobs.map(blobToRadialGradient).join(", ");
  const prevGradients = prev ? prev.blobs.map(blobToRadialGradient).join(", ") : null;

  return (
    <div
      className={`m-bg-root relative w-full min-h-screen overflow-hidden ${className}`}
      style={{ "--m-bg-rotation": `${rotation}deg` } as React.CSSProperties}
    >
      {/* ── Background visual layers (aria-hidden) ── */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        {/* Layer 0: warm dark base */}
        <div
          className="absolute inset-0 transition-colors duration-700 ease-out"
          style={{
            backgroundColor: active.baseColor,
            zIndex: 0,
          }}
        />

        {/* Layer 1a: previous blob gradients (cross-fading out) */}
        {prevGradients && (
          <div
            className="absolute -inset-10 m-bg-blobs transition-opacity duration-900 ease-out"
            style={{
              background: prevGradients,
              filter: "blur(32px)",
              zIndex: 1,
              opacity: isCrossfading ? 0 : 1,
              animation: "m-drift 28s ease-in-out infinite",
              willChange: "opacity, transform",
            }}
          />
        )}

        {/* Layer 1b: active blob gradients (smooth CSS multi-stop color field) */}
        <div
          className="absolute -inset-10 m-bg-blobs transition-opacity duration-900 ease-out"
          style={{
            background: activeGradients,
            filter: "blur(32px)",
            transform: rotation ? `rotate(${rotation}deg) scale(1.1)` : undefined,
            zIndex: 2,
            opacity: 1,
            animation: "m-drift 28s ease-in-out infinite",
            willChange: "opacity, transform",
          }}
        />

        {/* Layer 2: supplied gradient artwork — softly diffused as subtle analog haze */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/backgrounds/gradient-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-900 ease-out"
          style={{
            opacity: artworkOpacity,
            filter: "blur(24px)",
            mixBlendMode: "soft-light",
            zIndex: 3,
            animation: "m-breathe 18s ease-in-out infinite",
            willChange: "opacity, transform",
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
          id={`${uid}-artwork`}
        />

        {/* Layer 3: ultra-fine micro-grain texture (high-frequency, ultra-low opacity) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n${uid.replace(/:/g, "")}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n${uid.replace(/:/g, "")})' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
            opacity: grainOpacity,
            zIndex: 4,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* ── Content slot (guaranteed full dimensions and stacking) ── */}
      {children && (
        <div className="relative w-full h-full min-h-screen flex flex-col flex-1" style={{ zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}
