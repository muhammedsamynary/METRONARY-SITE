import type { Product, ProductCategory } from "./types";

/**
 * TEMPORARY SEED CATALOG DATA
 *
 * NOTE: This is temporary seed data for development of the Storefront & Catalog UI.
 * In later phases, this source will be replaced by database queries and Admin CMS.
 *
 * RULES:
 * 1. Product names are WORKING / INTERNAL labels.
 * 2. Prices are set to null until officially confirmed (NO invented pricing).
 * 3. Real supplied assets only.
 */

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: "prod-fearless",
    slug: "fearless",
    workingName: "FEARLESS",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: "Heavyweight cotton jersey graphic garment with signature back blaze artwork.",
    price: null,
    currency: "EGP",
    images: ["/products/fearless.png"],
    thumbnail: "/products/fearless.png",
    hasAlpha: true,
    gradientKey: "fearless",
    active: true,
    featured: true,
    badge: "DROP 01",
    tags: ["tee", "heavyweight", "graphic", "fearless"],
  },
  {
    id: "prod-orange-work-shirt",
    slug: "orange-work-shirt",
    workingName: "CAMP-COLLAR WORK SHIRT",
    officialName: null,
    category: "tops",
    silhouette: "Work Shirt",
    description: "Structured cotton camp-collar buttoned shirt in vibrant underground orange.",
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
  },
  {
    id: "prod-1973",
    slug: "1973",
    workingName: "1973",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: "Archival 1973 edition graphic tee engineered in premium black cotton.",
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
  },
  {
    id: "prod-look-at-sky",
    slug: "look-at-sky",
    workingName: "LOOK AT THE SKY",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: "Look at the Sky edition graphic tee with subterranean gradient back print.",
    price: null,
    currency: "EGP",
    images: ["/products/look-at-sky.png"],
    thumbnail: "/products/look-at-sky.png",
    hasAlpha: true,
    gradientKey: "look-at-sky",
    active: true,
    featured: true,
    tags: ["tee", "graphic", "black"],
  },
  {
    id: "prod-old-boy-w",
    slug: "old-boy-w",
    workingName: "OLD BOY WHITE",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: "Raw white / cream heavyweight cotton tee featuring understated chest typography.",
    price: null,
    currency: "EGP",
    images: ["/products/old-boy-w.png"],
    thumbnail: "/products/old-boy-w.png",
    hasAlpha: true,
    gradientKey: "old-boy-w",
    active: true,
    featured: true,
    tags: ["tee", "white", "raw-cotton"],
  },
  {
    id: "prod-old-boy",
    slug: "old-boy",
    workingName: "OLD BOY",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: "Core black edition of the Old Boy graphic tee silhouette.",
    price: null,
    currency: "EGP",
    images: ["/products/old-boy.png"],
    thumbnail: "/products/old-boy.png",
    hasAlpha: true,
    gradientKey: "old-boy",
    active: true,
    featured: false,
    tags: ["tee", "black", "graphic"],
  },
  {
    id: "prod-time",
    slug: "time",
    workingName: "TIME",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: "Time series graphic garment with high-density underground screenprint.",
    price: null,
    currency: "EGP",
    images: ["/products/time.png"],
    thumbnail: "/products/time.png",
    hasAlpha: true,
    gradientKey: "time",
    active: true,
    featured: false,
    tags: ["tee", "time", "graphic"],
  },
  {
    id: "prod-decorative",
    slug: "decorarive",
    workingName: "DECORATIVE",
    officialName: null,
    category: "tops",
    silhouette: "Graphic Tee",
    description: "Decorative series graphic tee with custom typography placement.",
    price: null,
    currency: "EGP",
    images: ["/products/decorarive.png"],
    thumbnail: "/products/decorarive.png",
    hasAlpha: true,
    gradientKey: "decorarive",
    active: true,
    featured: false,
    tags: ["tee", "decorative", "graphic"],
  },
  {
    id: "prod-digital-camo-shorts",
    slug: "digital-camo-shorts",
    workingName: "DIGITAL CAMO SHORTS",
    officialName: null,
    category: "shorts",
    silhouette: "Cargo Shorts",
    description: "Technical relaxed-fit shorts featuring digital camo pattern and reinforced pockets.",
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
  },
  {
    id: "prod-desert-camo-shorts",
    slug: "desert-camo-shorts",
    workingName: "DESERT CAMO SHORTS",
    officialName: null,
    category: "shorts",
    silhouette: "Cargo Shorts",
    description: "Desert camo edition technical cargo shorts tailored from durable ripstop cotton.",
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
