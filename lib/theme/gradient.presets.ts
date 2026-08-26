/**
 * METRONARY — Gradient Composition Presets
 *
 * All presets use exclusively the METRONARY fiery palette.
 * Yellow → Gold → Orange → Burnt Orange → Deep Orange → Ember
 *
 * These are the initial compositions. Future phases will allow
 * product data to supply its own GradientTheme directly.
 */

import type { GradientTheme, GradientPresetKey } from "./gradient.types";

// ─── Palette reference (not exported — internal use only) ────
const P = {
  yellow:      "#ffd60a",
  yellowWarm:  "#ffbe0b",
  gold:        "#fb8500",
  orange:      "#e85d04",
  orangeDeep:  "#c44b03",
  ember:       "#9d2d00",
  lava:        "#6b1a00",
  dark:        "#0d0d0b",
} as const;

// ─── Presets ─────────────────────────────────────────────────

/**
 * DEFAULT — balanced composition for the homepage.
 * Yellow glows upper-right, deep orange pours from lower-left.
 * Feels like a sunrise underground.
 */
export const PRESET_DEFAULT: GradientTheme = {
  name: "default",
  baseColor: "#110e09",
  artworkOpacity: 0.32,
  grainOpacity: 0.045,
  blobs: [
    {
      x: 85, y: 10,
      radius: 56,
      color: P.yellowWarm,
      opacity: 0.22,
    },
    {
      x: 78, y: 52,
      radius: 52,
      color: P.gold,
      opacity: 0.20,
    },
    {
      x: 18, y: 75,
      radius: 58,
      color: P.orange,
      opacity: 0.25,
    },
    {
      x: 8, y: 90,
      radius: 54,
      color: P.ember,
      opacity: 0.30,
    },
  ],
};

/**
 * PRODUCT-A — yellow emphasis top-right, deep orange lower-left.
 * Dramatic diagonal pull. Good for bold graphic tees.
 */
export const PRESET_PRODUCT_A: GradientTheme = {
  name: "product-a",
  baseColor: "#0f0c08",
  artworkOpacity: 0.28,
  grainOpacity: 0.05,
  blobs: [
    {
      x: 82, y: 8,
      radius: 60,
      color: P.yellow,
      opacity: 0.32,
    },
    {
      x: 65, y: 20,
      radius: 42,
      color: P.yellowWarm,
      opacity: 0.18,
    },
    {
      x: 30, y: 60,
      radius: 55,
      color: P.orangeDeep,
      opacity: 0.28,
    },
    {
      x: 5, y: 88,
      radius: 50,
      color: P.ember,
      opacity: 0.35,
    },
  ],
};

/**
 * PRODUCT-B — yellow drifts center-left, orange spreads toward right.
 * More even horizontal distribution. Warm and enveloping.
 */
export const PRESET_PRODUCT_B: GradientTheme = {
  name: "product-b",
  baseColor: "#100d09",
  artworkOpacity: 0.32,
  grainOpacity: 0.042,
  blobs: [
    {
      x: 20, y: 35,
      radius: 58,
      color: P.yellowWarm,
      opacity: 0.25,
    },
    {
      x: 45, y: 50,
      radius: 50,
      color: P.gold,
      opacity: 0.20,
    },
    {
      x: 72, y: 42,
      radius: 55,
      color: P.orange,
      opacity: 0.28,
    },
    {
      x: 88, y: 70,
      radius: 48,
      color: P.orangeDeep,
      opacity: 0.22,
    },
  ],
};

/**
 * PRODUCT-C — yellow central glow, deeper orange on outer edges.
 * Circular / radiant. Like looking into something burning.
 */
export const PRESET_PRODUCT_C: GradientTheme = {
  name: "product-c",
  baseColor: "#0d0b07",
  artworkOpacity: 0.30,
  grainOpacity: 0.048,
  blobs: [
    {
      x: 50, y: 45,
      radius: 50,
      color: P.yellow,
      opacity: 0.30,
    },
    {
      x: 50, y: 45,
      radius: 68,
      color: P.gold,
      opacity: 0.20,
    },
    {
      x: 15, y: 20,
      radius: 48,
      color: P.orangeDeep,
      opacity: 0.22,
    },
    {
      x: 82, y: 75,
      radius: 52,
      color: P.ember,
      opacity: 0.28,
    },
    {
      x: 10, y: 80,
      radius: 42,
      color: P.lava,
      opacity: 0.25,
    },
  ],
};

/**
 * SHOP — cooler/darker, lets products stand out.
 * Orange burns at lower intensity, more darkness between blobs.
 */
export const PRESET_SHOP: GradientTheme = {
  name: "shop",
  baseColor: "#0c0a07",
  artworkOpacity: 0.20,
  grainOpacity: 0.038,
  blobs: [
    {
      x: 88, y: 5,
      radius: 45,
      color: P.yellowWarm,
      opacity: 0.16,
    },
    {
      x: 55, y: 40,
      radius: 50,
      color: P.orange,
      opacity: 0.14,
    },
    {
      x: 8, y: 90,
      radius: 55,
      color: P.ember,
      opacity: 0.22,
    },
  ],
};

// ─── Subtle Product-Specific Gradient Responses ──────────────

export const PRESET_HOVER_FEARLESS: GradientTheme = {
  name: "hover-fearless",
  baseColor: "#110e09",
  artworkOpacity: 0.38,
  grainOpacity: 0.045,
  blobs: [
    { x: 68, y: 16, radius: 52, color: P.yellow, opacity: 0.26 },
    { x: 48, y: 34, radius: 50, color: P.gold, opacity: 0.26 },
    { x: 28, y: 48, radius: 56, color: P.orange, opacity: 0.32 },
    { x: 12, y: 76, radius: 60, color: P.ember, opacity: 0.30 },
  ],
};

export const PRESET_HOVER_1973: GradientTheme = {
  name: "hover-1973",
  baseColor: "#110e09",
  artworkOpacity: 0.38,
  grainOpacity: 0.045,
  blobs: [
    { x: 80, y: 10, radius: 58, color: P.yellow, opacity: 0.34 },
    { x: 66, y: 24, radius: 46, color: P.gold, opacity: 0.24 },
    { x: 38, y: 58, radius: 50, color: P.orange, opacity: 0.24 },
    { x: 10, y: 82, radius: 58, color: P.ember, opacity: 0.28 },
  ],
};

export const PRESET_HOVER_TIME: GradientTheme = {
  name: "hover-time",
  baseColor: "#110e09",
  artworkOpacity: 0.36,
  grainOpacity: 0.045,
  blobs: [
    { x: 60, y: 18, radius: 50, color: P.yellow, opacity: 0.25 },
    { x: 35, y: 22, radius: 48, color: P.gold, opacity: 0.28 },
    { x: 25, y: 50, radius: 54, color: P.orange, opacity: 0.28 },
    { x: 8, y: 78, radius: 60, color: P.ember, opacity: 0.32 },
  ],
};

export const PRESET_HOVER_LOOK_AT_SKY: GradientTheme = {
  name: "hover-look-at-sky",
  baseColor: "#110e09",
  artworkOpacity: 0.38,
  grainOpacity: 0.045,
  blobs: [
    { x: 74, y: 18, radius: 52, color: P.yellow, opacity: 0.26 },
    { x: 68, y: 42, radius: 50, color: P.gold, opacity: 0.26 },
    { x: 55, y: 64, radius: 56, color: P.orange, opacity: 0.30 },
    { x: 22, y: 82, radius: 58, color: P.ember, opacity: 0.30 },
  ],
};

export const PRESET_HOVER_DECORATIVE: GradientTheme = {
  name: "hover-decorarive",
  baseColor: "#110e09",
  artworkOpacity: 0.36,
  grainOpacity: 0.045,
  blobs: [
    { x: 72, y: 15, radius: 54, color: P.yellow, opacity: 0.26 },
    { x: 50, y: 35, radius: 48, color: P.gold, opacity: 0.22 },
    { x: 24, y: 62, radius: 58, color: P.orange, opacity: 0.30 },
    { x: 10, y: 80, radius: 62, color: P.ember, opacity: 0.34 },
  ],
};

export const PRESET_HOVER_OLD_BOY: GradientTheme = {
  name: "hover-old-boy",
  baseColor: "#110e09",
  artworkOpacity: 0.36,
  grainOpacity: 0.045,
  blobs: [
    { x: 75, y: 14, radius: 52, color: P.yellow, opacity: 0.28 },
    { x: 62, y: 38, radius: 52, color: P.gold, opacity: 0.28 },
    { x: 42, y: 52, radius: 50, color: P.orange, opacity: 0.26 },
    { x: 12, y: 80, radius: 58, color: P.ember, opacity: 0.28 },
  ],
};

export const PRESET_HOVER_OLD_BOY_W: GradientTheme = {
  name: "hover-old-boy-w",
  baseColor: "#110e09",
  artworkOpacity: 0.36,
  grainOpacity: 0.045,
  blobs: [
    { x: 70, y: 18, radius: 50, color: P.yellowWarm, opacity: 0.26 },
    { x: 50, y: 38, radius: 48, color: P.gold, opacity: 0.24 },
    { x: 32, y: 65, radius: 56, color: P.orange, opacity: 0.30 },
    { x: 12, y: 84, radius: 58, color: P.ember, opacity: 0.30 },
  ],
};

export const PRESET_HOVER_ORANGE_SHIRT: GradientTheme = {
  name: "hover-orange-shirt",
  baseColor: "#130e08",
  artworkOpacity: 0.38,
  grainOpacity: 0.045,
  blobs: [
    { x: 45, y: 35, radius: 56, color: P.orange, opacity: 0.34 },
    { x: 68, y: 20, radius: 50, color: P.yellow, opacity: 0.26 },
    { x: 28, y: 65, radius: 54, color: P.gold, opacity: 0.28 },
    { x: 10, y: 82, radius: 60, color: P.ember, opacity: 0.32 },
  ],
};

export const PRESET_HOVER_DIGITAL_CAMO: GradientTheme = {
  name: "hover-digital-camo",
  baseColor: "#110e08",
  artworkOpacity: 0.36,
  grainOpacity: 0.045,
  blobs: [
    { x: 25, y: 30, radius: 54, color: P.gold, opacity: 0.30 },
    { x: 70, y: 25, radius: 52, color: P.yellowWarm, opacity: 0.24 },
    { x: 35, y: 70, radius: 58, color: P.orange, opacity: 0.30 },
    { x: 10, y: 85, radius: 60, color: P.ember, opacity: 0.32 },
  ],
};

export const PRESET_HOVER_DESERT_CAMO: GradientTheme = {
  name: "hover-desert-camo",
  baseColor: "#110e08",
  artworkOpacity: 0.36,
  grainOpacity: 0.045,
  blobs: [
    { x: 75, y: 35, radius: 56, color: P.yellow, opacity: 0.28 },
    { x: 30, y: 20, radius: 48, color: P.gold, opacity: 0.24 },
    { x: 65, y: 75, radius: 56, color: P.orange, opacity: 0.30 },
    { x: 15, y: 88, radius: 58, color: P.ember, opacity: 0.32 },
  ],
};

export const PRODUCT_HOVER_THEMES: Record<string, GradientTheme> = {
  fearless: PRESET_HOVER_FEARLESS,
  "1973": PRESET_HOVER_1973,
  time: PRESET_HOVER_TIME,
  "look-at-sky": PRESET_HOVER_LOOK_AT_SKY,
  decorarive: PRESET_HOVER_DECORATIVE,
  "old-boy": PRESET_HOVER_OLD_BOY,
  "old-boy-w": PRESET_HOVER_OLD_BOY_W,
  "orange-work-shirt": PRESET_HOVER_ORANGE_SHIRT,
  "digital-camo-shorts": PRESET_HOVER_DIGITAL_CAMO,
  "desert-camo-shorts": PRESET_HOVER_DESERT_CAMO,
};

export function getProductHoverTheme(slug: string | null): GradientTheme {
  if (!slug) return PRESET_DEFAULT;
  return PRODUCT_HOVER_THEMES[slug] ?? PRESET_DEFAULT;
}

// ─── Preset registry ─────────────────────────────────────────

export const GRADIENT_PRESETS: Record<GradientPresetKey, GradientTheme> = {
  "default":   PRESET_DEFAULT,
  "product-a": PRESET_PRODUCT_A,
  "product-b": PRESET_PRODUCT_B,
  "product-c": PRESET_PRODUCT_C,
  "shop":      PRESET_SHOP,
  "about":     PRESET_DEFAULT,   // reuse default for now
};

export function getGradientPreset(key: GradientPresetKey): GradientTheme {
  return GRADIENT_PRESETS[key] ?? PRESET_DEFAULT;
}

