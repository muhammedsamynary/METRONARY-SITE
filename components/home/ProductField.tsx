"use client";

import { FloatingProduct } from "./FloatingProduct";
import type { FloatingProductData } from "./types";
import { useProductParallax } from "./useProductParallax";

/**
 * ─── SCENE 1: Flagship Core Collection (First Viewport) ───
 */
export const SCENE_1_PRODUCTS: FloatingProductData[] = [
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
    depthFactor: 1.15,
    idleClass: "m-idle-1",
    layout: {
      desktop: {
        top: "22%",
        left: "6%",
        width: "min(26vw, 360px)",
        rotation: -4,
        zIndex: 15,
      },
      tablet: {
        top: "20%",
        left: "6%",
        width: "min(34vw, 300px)",
        rotation: -4,
        zIndex: 15,
      },
      mobile: {
        top: "24%",
        left: "5%",
        width: "min(62vw, 250px)",
        rotation: -3,
        zIndex: 15,
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
    depthFactor: 0.65,
    idleClass: "m-idle-3",
    layout: {
      desktop: {
        top: "44%",
        left: "29%",
        width: "min(21vw, 290px)",
        rotation: 3,
        zIndex: 12,
      },
      tablet: {
        bottom: "16%",
        left: "14%",
        width: "min(30vw, 260px)",
        rotation: 2,
        zIndex: 12,
      },
      mobile: {
        bottom: "12%",
        left: "-6%",
        width: "min(44vw, 175px)",
        rotation: 3,
        zIndex: 13,
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
        top: "14%",
        right: "7%",
        width: "min(22vw, 310px)",
        rotation: -3,
        zIndex: 14,
      },
      tablet: {
        top: "10%",
        right: "5%",
        width: "min(28vw, 240px)",
        rotation: 4,
        zIndex: 14,
      },
      mobile: {
        top: "8%",
        right: "-10%",
        width: "min(42vw, 165px)",
        rotation: 6,
        zIndex: 14,
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
    depthFactor: 0.85,
    idleClass: "m-idle-4",
    layout: {
      desktop: {
        bottom: "5%",
        right: "8%",
        width: "min(24vw, 340px)",
        rotation: 4,
        zIndex: 14,
      },
      tablet: {
        bottom: "6%",
        right: "6%",
        width: "min(32vw, 270px)",
        rotation: 4,
        zIndex: 13,
      },
      mobile: {
        bottom: "4%",
        right: "-6%",
        width: "min(48vw, 190px)",
        rotation: 5,
        zIndex: 14,
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
    depthFactor: 0.75,
    idleClass: "m-idle-2",
    layout: {
      desktop: {
        top: "8%",
        right: "34%",
        width: "min(18vw, 250px)",
        rotation: 4,
        zIndex: 11,
      },
      tablet: {
        top: "8%",
        right: "26%",
        width: "min(22vw, 190px)",
        rotation: 4,
        zIndex: 11,
      },
      mobile: {
        width: "0px",
        hidden: true,
      },
    },
  },
];

/**
 * ─── SCENE 2: Archival Graphics Field (Second Viewport) ───
 */
export const SCENE_2_PRODUCTS: FloatingProductData[] = [
  {
    id: "prod-old-boy",
    slug: "old-boy",
    name: "OLD BOY",
    image: "/products/old-boy.png",
    alt: "METRONARY Old Boy Core Black Garment",
    hasAlpha: true,
    depthTier: "foreground",
    depthFactor: 1.05,
    idleClass: "m-idle-1",
    layout: {
      desktop: {
        top: "24%",
        left: "10%",
        width: "min(25vw, 350px)",
        rotation: 3,
        zIndex: 15,
      },
      tablet: {
        top: "18%",
        left: "8%",
        width: "min(32vw, 280px)",
        rotation: 3,
        zIndex: 15,
      },
      mobile: {
        top: "20%",
        left: "4%",
        width: "min(58vw, 230px)",
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
        top: "16%",
        right: "11%",
        width: "min(23vw, 320px)",
        rotation: -4,
        zIndex: 14,
      },
      tablet: {
        top: "14%",
        right: "8%",
        width: "min(28vw, 250px)",
        rotation: -4,
        zIndex: 14,
      },
      mobile: {
        top: "10%",
        right: "-8%",
        width: "min(46vw, 180px)",
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
    depthFactor: 0.7,
    idleClass: "m-idle-4",
    layout: {
      desktop: {
        bottom: "10%",
        left: "36%",
        width: "min(22vw, 300px)",
        rotation: 5,
        zIndex: 13,
      },
      tablet: {
        bottom: "12%",
        left: "26%",
        width: "min(26vw, 230px)",
        rotation: 4,
        zIndex: 13,
      },
      mobile: {
        bottom: "8%",
        left: "12%",
        width: "min(50vw, 200px)",
        rotation: 4,
        zIndex: 13,
      },
    },
  },
];

/**
 * ─── SCENE 3: Tactical Cargo Shorts (Third Viewport) ───
 */
export const SCENE_3_PRODUCTS: FloatingProductData[] = [
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
        top: "22%",
        left: "14%",
        width: "min(25vw, 350px)",
        rotation: -3,
        zIndex: 14,
      },
      tablet: {
        top: "18%",
        left: "10%",
        width: "min(32vw, 270px)",
        rotation: -3,
        zIndex: 14,
      },
      mobile: {
        top: "18%",
        left: "6%",
        width: "min(54vw, 210px)",
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
    depthFactor: 0.9,
    idleClass: "m-idle-4",
    layout: {
      desktop: {
        top: "34%",
        right: "16%",
        width: "min(25vw, 350px)",
        rotation: 4,
        zIndex: 14,
      },
      tablet: {
        bottom: "16%",
        right: "10%",
        width: "min(32vw, 270px)",
        rotation: 4,
        zIndex: 14,
      },
      mobile: {
        bottom: "12%",
        right: "4%",
        width: "min(54vw, 210px)",
        rotation: 4,
        zIndex: 14,
      },
    },
  },
];

interface SpatialSceneProps {
  products: FloatingProductData[];
  onHoverProduct?: (slug: string | null) => void;
  className?: string;
  "aria-label"?: string;
}

export function SpatialScene({
  products,
  onHoverProduct,
  className = "",
  "aria-label": ariaLabel = "Spatial garment field",
}: SpatialSceneProps) {
  const containerRef = useProductParallax({ sensitivity: 0.9, maxOffset: 14 });

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[100dvh] min-h-[640px] pointer-events-none overflow-hidden ${className}`}
      aria-label={ariaLabel}
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

// Backward compatibility alias for single product field
export function ProductField({
  products = SCENE_1_PRODUCTS,
  onHoverProduct,
}: {
  products?: FloatingProductData[];
  onHoverProduct?: (slug: string | null) => void;
}) {
  return <SpatialScene products={products} onHoverProduct={onHoverProduct} />;
}
