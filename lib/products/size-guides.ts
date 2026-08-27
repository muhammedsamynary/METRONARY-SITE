import type { SizeGuide } from "./types";

/**
 * CONFIRMED SIZE GUIDES REGISTRY
 *
 * Designed to be dynamically driven and extended by future Admin CMS / Database.
 */

export const SHORTS_SIZE_GUIDE: SizeGuide = {
  id: "guide-cargo-shorts",
  name: "Cargo Shorts Size Guide",
  unit: "CM",
  columns: [
    { key: "length", label: "LENGTH" },
    { key: "waist", label: "WAIST" },
    { key: "legOpening", label: "LEG OPENING" },
  ],
  rows: [
    {
      size: "S",
      values: {
        length: 52,
        waist: 44,
        legOpening: 30,
      },
    },
    {
      size: "M",
      values: {
        length: 56,
        waist: 48,
        legOpening: 33,
      },
    },
    {
      size: "L",
      values: {
        length: 61,
        waist: 54,
        legOpening: 36,
      },
    },
  ],
};

export const SIZE_GUIDES_REGISTRY: Record<string, SizeGuide> = {
  "guide-cargo-shorts": SHORTS_SIZE_GUIDE,
};

/**
 * Retrieve size guide by ID
 */
export async function getSizeGuideById(id: string): Promise<SizeGuide | undefined> {
  return SIZE_GUIDES_REGISTRY[id];
}
