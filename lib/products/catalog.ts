import type { Product, ProductCategory } from "./types";
import { SHORTS_SIZE_GUIDE } from "./size-guides";

/**
 * TEMPORARY SEED CATALOG DATA
 *
 * RULES:
 * 1. Product names are WORKING / INTERNAL labels unless officially approved.
 * 2. Prices are set to null until officially confirmed (NO invented pricing).
 * 3. Descriptions are set to null until officially provided (NO invented descriptions).
 * 4. Sizes: S / M / L for both shorts (confirmed). Tops have no confirmed sizes yet.
 * 5. Inventory: Unknown until database/inventory phase.
 * 6. Size Guide: Assigned to shorts (confirmed). Tops have no size guide.
 */

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: "prod-fearless",
    slug: "fearless",
    workingName: "FEARLESS",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/fearless.png"],
    thumbnail: "/products/fearless.png",
    hasAlpha: true,
    gradientKey: "fearless",
    active: true,
    featured: true,
    badge: "DROP 01",
    tags: ["tee", "graphic", "fearless"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-orange-work-shirt",
    slug: "orange-work-shirt",
    workingName: "CAMP-COLLAR WORK SHIRT",
    officialName: null,
    category: "tops",
    silhouette: "Work Shirt",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/orange-work-shirt.png"],
    thumbnail: "/products/orange-work-shirt.png",
    hasAlpha: true,
    gradientKey: "orange-work-shirt",
    active: true,
    featured: true,
    badge: "NEW SILHOUETTE",
    tags: ["shirt", "camp-collar", "orange", "workwear"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-1973",
    slug: "1973",
    workingName: "1973",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/1973.png"],
    thumbnail: "/products/1973.png",
    hasAlpha: true,
    gradientKey: "1973",
    active: true,
    featured: true,
    badge: "ARCHIVE",
    tags: ["tee", "1973", "black", "graphic"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-look-at-sky",
    slug: "look-at-sky",
    workingName: "LOOK AT THE SKY",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/look-at-sky.png"],
    thumbnail: "/products/look-at-sky.png",
    hasAlpha: true,
    gradientKey: "look-at-sky",
    active: true,
    featured: true,
    tags: ["tee", "graphic", "black"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-old-boy-w",
    slug: "old-boy-w",
    workingName: "OLD BOY WHITE",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/old-boy-w.png"],
    thumbnail: "/products/old-boy-w.png",
    hasAlpha: true,
    gradientKey: "old-boy-w",
    active: true,
    featured: true,
    tags: ["tee", "white"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-old-boy",
    slug: "old-boy",
    workingName: "OLD BOY",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/old-boy.png"],
    thumbnail: "/products/old-boy.png",
    hasAlpha: true,
    gradientKey: "old-boy",
    active: true,
    featured: false,
    tags: ["tee", "black", "graphic"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-time",
    slug: "time",
    workingName: "TIME",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/time.png"],
    thumbnail: "/products/time.png",
    hasAlpha: true,
    gradientKey: "time",
    active: true,
    featured: false,
    tags: ["tee", "time", "graphic"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-decorative",
    slug: "decorarive",
    workingName: "DECORATIVE",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/decorarive.png"],
    thumbnail: "/products/decorarive.png",
    hasAlpha: true,
    gradientKey: "decorarive",
    active: true,
    featured: false,
    tags: ["tee", "decorative", "graphic"],
    variants: [],
    sizeGuideId: null,
    sizeGuide: null,
  },
  {
    id: "prod-digital-camo-shorts",
    slug: "digital-camo-shorts",
    workingName: "DIGITAL CAMO SHORTS",
    officialName: null,
    category: "shorts",
    silhouette: "Cargo Shorts",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/digital-camo-shorts.png"],
    thumbnail: "/products/digital-camo-shorts.png",
    hasAlpha: true,
    gradientKey: "digital-camo-shorts",
    active: true,
    featured: true,
    badge: "COLLECTION",
    tags: ["shorts", "camo", "digital", "bottoms"],
    variants: [
      {
        id: "var-digital-s",
        size: "S",
        stockStatus: "unknown",
        measurements: { length: "52 cm", waist: "44 cm", legOpening: "30 cm" },
      },
      {
        id: "var-digital-m",
        size: "M",
        stockStatus: "unknown",
        measurements: { length: "56 cm", waist: "48 cm", legOpening: "33 cm" },
      },
      {
        id: "var-digital-l",
        size: "L",
        stockStatus: "unknown",
        measurements: { length: "61 cm", waist: "54 cm", legOpening: "36 cm" },
      },
    ],
    sizeGuideId: "guide-cargo-shorts",
    sizeGuide: SHORTS_SIZE_GUIDE,
  },
  {
    id: "prod-desert-camo-shorts",
    slug: "desert-camo-shorts",
    workingName: "DESERT CAMO SHORTS",
    officialName: null,
    category: "shorts",
    silhouette: "Cargo Shorts",
    description: null,
    price: null,
    currency: "EGP",
    images: ["/products/desert-camo-shorts.png"],
    thumbnail: "/products/desert-camo-shorts.png",
    hasAlpha: true,
    gradientKey: "desert-camo-shorts",
    active: true,
    featured: true,
    badge: "COLLECTION",
    tags: ["shorts", "desert", "camo", "bottoms"],
    variants: [
      {
        id: "var-desert-s",
        size: "S",
        stockStatus: "unknown",
        measurements: { length: "52 cm", waist: "44 cm", legOpening: "30 cm" },
      },
      {
        id: "var-desert-m",
        size: "M",
        stockStatus: "unknown",
        measurements: { length: "56 cm", waist: "48 cm", legOpening: "33 cm" },
      },
      {
        id: "var-desert-l",
        size: "L",
        stockStatus: "unknown",
        measurements: { length: "61 cm", waist: "54 cm", legOpening: "36 cm" },
      },
    ],
    sizeGuideId: "guide-cargo-shorts",
    sizeGuide: SHORTS_SIZE_GUIDE,
  },
];

/**
 * Fetch all active catalog products
 */
export async function getCatalogProducts(): Promise<Product[]> {
  return CATALOG_PRODUCTS.filter((p) => p.active);
}

/**
 * Fetch product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug && p.active);
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: ProductCategory | string): Promise<Product[]> {
  if (category === "all") {
    return CATALOG_PRODUCTS.filter((p) => p.active);
  }
  return CATALOG_PRODUCTS.filter((p) => p.category === category && p.active);
}
