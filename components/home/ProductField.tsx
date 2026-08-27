"use client";

import { FloatingProduct } from "./FloatingProduct";
import type { FloatingProductData } from "./types";
import { useProductParallax } from "./useProductParallax";

/**
 * ─── CONTINUOUS SPATIAL PRODUCT FIELD (ALL 10 PRODUCTS) ───
 *
 * Final Polish:
 * 1. Dense, cohesive editorial rhythm (condensed height: ~1680px desktop).
 * 2. Protected safe zones (header top >= 130px, footer bottom margin >= 160px, edge margins 8%–16%).
 * 3. Connected shorts placement (starts immediately below DECORATIVE with ~80px gap).
 * 4. Staggered diagonal pacing (zero collisions, zero dead voids).
 */
export const HOMEPAGE_PRODUCTS: FloatingProductData[] = [
  // ─── SCENE 1: Flagship Core Collection (Upper Field) ───
  {
    id: "prod-fearless",
    slug: "fearless",
    name: "FEARLESS",
    image: "/products/fearless.png",
    alt: "METRONARY Fearless Graphic Garment",
    isFocal: true,
    priority: true,
    hasAlpha: true,
    depthTier: "foreground",
    depthFactor: 1.1,
    idleClass: "m-idle-1",
    layout: {
      desktop: {
        top: "150px",
        left: "8%",
        width: "min(22vw, 325px)",
        rotation: -3,
        zIndex: 15,
      },
      tablet: {
        top: "120px",
        left: "7%",
        width: "min(32vw, 265px)",
        rotation: -3,
        zIndex: 15,
      },
      mobile: {
        top: "140px",
        left: "6%",
        width: "min(56vw, 220px)",
        rotation: -3,
        zIndex: 15,
      },
    },
  },
  {
    id: "prod-old-boy-w",
    slug: "old-boy-w",
    name: "OLD BOY WHITE",
    image: "/products/old-boy-w.png",
    alt: "METRONARY Old Boy White Garment",
    hasAlpha: true,
    depthTier: "midground",
    depthFactor: 0.8,
    idleClass: "m-idle-2",
    layout: {
      desktop: {
        top: "130px",
        left: "39%",
        width: "min(20vw, 295px)",
        rotation: 4,
        zIndex: 12,
      },
      tablet: {
        top: "110px",
        left: "46%",
        width: "min(25vw, 210px)",
        rotation: 4,
        zIndex: 12,
      },
      mobile: {
        width: "0px",
        hidden: true,
      },
    },
  },
  {
    id: "prod-1973",
    slug: "1973",
    name: "1973",
    image: "/products/1973.png",
    alt: "METRONARY 1973 Edition Garment",
    hasAlpha: true,
    depthTier: "midground",
    depthFactor: 0.9,
    idleClass: "m-idle-2",
    layout: {
      desktop: {
        top: "160px",
        right: "8%",
        width: "min(21vw, 310px)",
        rotation: -4,
        zIndex: 14,
      },
      tablet: {
        top: "130px",
        right: "7%",
        width: "min(28vw, 235px)",
        rotation: -4,
        zIndex: 14,
      },
      mobile: {
        top: "60px",
        right: "-4%",
        width: "min(42vw, 165px)",
        rotation: 5,
        zIndex: 14,
      },
    },
  },
  {
    id: "prod-orange-work-shirt",
    slug: "orange-work-shirt",
    name: "CAMP-COLLAR WORK SHIRT",
    image: "/products/orange-work-shirt.png",
    alt: "METRONARY Orange Camp-Collar Work Shirt",
    priority: true,
    hasAlpha: true,
    depthTier: "midground",
    depthFactor: 0.7,
    idleClass: "m-idle-3",
    layout: {
      desktop: {
        top: "450px",
        left: "22%",
        width: "min(21vw, 310px)",
        rotation: 3,
        zIndex: 13,
      },
      tablet: {
        top: "390px",
        left: "8%",
        width: "min(29vw, 240px)",
        rotation: 3,
        zIndex: 13,
      },
      mobile: {
        top: "380px",
        left: "-2%",
        width: "min(45vw, 175px)",
        rotation: 3,
        zIndex: 13,
      },
    },
  },
  {
    id: "prod-look-at-sky",
    slug: "look-at-sky",
    name: "LOOK AT THE SKY",
    image: "/products/look-at-sky.png",
    alt: "METRONARY Look at the Sky Garment",
    hasAlpha: true,
    depthTier: "foreground",
    depthFactor: 1.05,
    idleClass: "m-idle-4",
    layout: {
      desktop: {
        top: "480px",
        right: "14%",
        width: "min(22vw, 325px)",
        rotation: 4,
        zIndex: 15,
      },
      tablet: {
        top: "420px",
        right: "8%",
        width: "min(30vw, 250px)",
        rotation: 4,
        zIndex: 14,
      },
      mobile: {
        top: "590px",
        right: "-2%",
        width: "min(46vw, 185px)",
        rotation: 4,
        zIndex: 14,
      },
    },
  },

  // ─── SCENE 2: Archival Graphics (Middle Field) ───
  {
    id: "prod-old-boy",
    slug: "old-boy",
    name: "OLD BOY",
    image: "/products/old-boy.png",
    alt: "METRONARY Old Boy Core Black Garment",
    hasAlpha: true,
    depthTier: "foreground",
    depthFactor: 1.1,
    idleClass: "m-idle-1",
    layout: {
      desktop: {
        top: "760px",
        left: "9%",
        width: "min(22vw, 325px)",
        rotation: 3,
        zIndex: 15,
      },
      tablet: {
        top: "690px",
        left: "8%",
        width: "min(30vw, 250px)",
        rotation: 3,
        zIndex: 15,
      },
      mobile: {
        top: "840px",
        left: "6%",
        width: "min(56vw, 220px)",
        rotation: 2,
        zIndex: 15,
      },
    },
  },
  {
    id: "prod-time",
    slug: "time",
    name: "TIME",
    image: "/products/time.png",
    alt: "METRONARY Time Series Garment",
    hasAlpha: true,
    depthTier: "midground",
    depthFactor: 0.9,
    idleClass: "m-idle-3",
    layout: {
      desktop: {
        top: "800px",
        right: "9%",
        width: "min(21vw, 310px)",
        rotation: -4,
        zIndex: 14,
      },
      tablet: {
        top: "740px",
        right: "7%",
        width: "min(28vw, 235px)",
        rotation: -4,
        zIndex: 14,
      },
      mobile: {
        top: "1090px",
        right: "-4%",
        width: "min(44vw, 175px)",
        rotation: -4,
        zIndex: 14,
      },
    },
  },
  {
    id: "prod-decorative",
    slug: "decorarive",
    name: "DECORATIVE",
    image: "/products/decorarive.png",
    alt: "METRONARY Decorative Edition Garment",
    hasAlpha: true,
    depthTier: "midground",
    depthFactor: 0.75,
    idleClass: "m-idle-4",
    layout: {
      desktop: {
        top: "1060px",
        left: "36%",
        width: "min(21vw, 310px)",
        rotation: 4,
        zIndex: 13,
      },
      tablet: {
        top: "990px",
        left: "26%",
        width: "min(27vw, 225px)",
        rotation: 4,
        zIndex: 13,
      },
      mobile: {
        top: "1340px",
        left: "12%",
        width: "min(48vw, 190px)",
        rotation: 4,
        zIndex: 13,
      },
    },
  },

  // ─── SCENE 3: Tactical Cargo Shorts (Integrated Lower Field) ───
  {
    id: "prod-digital-camo-shorts",
    slug: "digital-camo-shorts",
    name: "DIGITAL CAMO SHORTS",
    image: "/products/digital-camo-shorts.png",
    alt: "METRONARY Digital Camo Shorts",
    hasAlpha: true,
    depthTier: "foreground",
    depthFactor: 1.0,
    idleClass: "m-idle-2",
    layout: {
      desktop: {
        top: "1300px",
        left: "16%",
        width: "min(23vw, 335px)",
        rotation: -3,
        zIndex: 14,
      },
      tablet: {
        top: "1240px",
        left: "10%",
        width: "min(31vw, 260px)",
        rotation: -3,
        zIndex: 14,
      },
      mobile: {
        top: "1590px",
        left: "8%",
        width: "min(54vw, 215px)",
        rotation: -3,
        zIndex: 14,
      },
    },
  },
  {
    id: "prod-desert-camo-shorts",
    slug: "desert-camo-shorts",
    name: "DESERT CAMO SHORTS",
    image: "/products/desert-camo-shorts.png",
    alt: "METRONARY Desert Camo Shorts",
    hasAlpha: true,
    depthTier: "foreground",
    depthFactor: 0.95,
    idleClass: "m-idle-4",
    layout: {
      desktop: {
        top: "1330px",
        right: "16%",
        width: "min(23vw, 335px)",
        rotation: 4,
        zIndex: 14,
      },
      tablet: {
        top: "1280px",
        right: "8%",
        width: "min(31vw, 260px)",
        rotation: 4,
        zIndex: 14,
      },
      mobile: {
        top: "1850px",
        right: "6%",
        width: "min(54vw, 215px)",
        rotation: 4,
        zIndex: 14,
      },
    },
  },
];

interface ProductFieldProps {
  products?: FloatingProductData[];
  onHoverProduct?: (slug: string | null) => void;
  className?: string;
}

export function ProductField({
  products = HOMEPAGE_PRODUCTS,
  onHoverProduct,
  className = "",
}: ProductFieldProps) {
  const containerRef = useProductParallax({ sensitivity: 0.9, maxOffset: 14 });

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[1680px] sm:min-h-[1780px] max-sm:min-h-[2250px] pb-24 pointer-events-none overflow-hidden ${className}`}
      aria-label="Metronary spatial product field"
    >
      {products.map((product) => (
        <FloatingProduct
          key={product.id}
          product={product}
          onHover={onHoverProduct}
        />
      ))}
    </div>
  );
}

// Backward compatibility alias for scenes
export const SCENE_1_PRODUCTS = HOMEPAGE_PRODUCTS.slice(0, 5);
export const SCENE_2_PRODUCTS = HOMEPAGE_PRODUCTS.slice(5, 8);
export const SCENE_3_PRODUCTS = HOMEPAGE_PRODUCTS.slice(8, 10);
export const SpatialScene = ProductField;
