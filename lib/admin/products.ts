import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";

export type StockSummary =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "UNAVAILABLE"
  | "UNKNOWN"
  | "MIXED"
  | "NO_VARIANTS";

export interface AdminProductListItem {
  id: string;
  slug: string;
  workingName: string;
  officialName: string | null;
  displayName: string;
  category: string;
  silhouette: string | null;
  description: string | null;
  priceMinor: number | null;
  currency: string;
  thumbnail: string | null;
  hasAlpha: boolean;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  badge: string | null;
  tags: string[];
  sizeGuideId: string | null;
  sizeGuideName: string | null;
  mediaCount: number;
  variantCount: number;
  stockSummary: StockSummary;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductCatalogStats {
  total: number;
  active: number;
  inactive: number;
  priced: number;
  unpriced: number;
  featured: number;
}

export interface AdminProductCatalogResult {
  products: AdminProductListItem[];
  stats: AdminProductCatalogStats;
}

export interface AdminProductDetailVariant {
  id: string;
  size: string | null;
  sku: string | null;
  stockStatus: string;
  stockQuantity: number | null;
  active: boolean;
  sortOrder: number;
}

export interface AdminProductDetailMedia {
  id: string;
  src: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  hasAlpha: boolean;
}

export interface AdminProductDetailResult {
  id: string;
  slug: string;
  workingName: string;
  officialName: string | null;
  displayName: string;
  category: string;
  silhouette: string | null;
  description: string | null;
  priceMinor: number | null;
  currency: string;
  thumbnail: string | null;
  hasAlpha: boolean;
  gradientKey: string | null;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  badge: string | null;
  tags: string[];
  sizeGuideId: string | null;
  sizeGuideName: string | null;
  sizeGuideUnit: string | null;
  media: AdminProductDetailMedia[];
  variants: AdminProductDetailVariant[];
  stockSummary: StockSummary;
  createdAt: string;
  updatedAt: string;
}

export function deriveStockSummary(
  variants: { stockStatus: string }[]
): StockSummary {
  if (!variants || variants.length === 0) {
    return "NO_VARIANTS";
  }

  const statuses = new Set(variants.map((v) => v.stockStatus));
  if (statuses.size === 1) {
    const singleStatus = Array.from(statuses)[0];
    return (singleStatus as StockSummary) || "UNKNOWN";
  }

  return "MIXED";
}

/**
 * Fetch All Products for Admin Management (Read-Only)
 */
export async function getAdminProducts(): Promise<AdminProductCatalogResult> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      products: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        priced: 0,
        unpriced: 0,
        featured: 0,
      },
    };
  }

  try {
    const rawProducts = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        media: {
          select: { id: true },
        },
        variants: {
          select: {
            id: true,
            size: true,
            sku: true,
            stockStatus: true,
            stockQuantity: true,
            active: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        sizeGuide: {
          select: {
            id: true,
            name: true,
            unit: true,
          },
        },
      },
    });

    let activeCount = 0;
    let pricedCount = 0;
    let featuredCount = 0;

    const products: AdminProductListItem[] = rawProducts.map((p) => {
      if (p.active) activeCount++;
      if (p.priceMinor !== null && p.priceMinor !== undefined) pricedCount++;
      if (p.featured) featuredCount++;

      const displayName = p.officialName?.trim() || p.workingName;
      const stockSummary = deriveStockSummary(p.variants);

      return {
        id: p.id,
        slug: p.slug,
        workingName: p.workingName,
        officialName: p.officialName,
        displayName,
        category: p.category,
        silhouette: p.silhouette,
        description: p.description,
        priceMinor: p.priceMinor,
        currency: p.currency,
        thumbnail: p.thumbnail,
        hasAlpha: p.hasAlpha,
        active: p.active,
        featured: p.featured,
        sortOrder: p.sortOrder,
        badge: p.badge,
        tags: p.tags,
        sizeGuideId: p.sizeGuideId,
        sizeGuideName: p.sizeGuide?.name || null,
        mediaCount: p.media.length,
        variantCount: p.variants.length,
        stockSummary,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    const total = products.length;
    const inactiveCount = total - activeCount;
    const unpricedCount = total - pricedCount;

    return {
      products,
      stats: {
        total,
        active: activeCount,
        inactive: inactiveCount,
        priced: pricedCount,
        unpriced: unpricedCount,
        featured: featuredCount,
      },
    };
  } catch (error) {
    console.error("[METRONARY Admin Products] Failed to fetch catalog:", error);
    return {
      products: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        priced: 0,
        unpriced: 0,
        featured: 0,
      },
    };
  }
}

/**
 * Fetch Single Product Detail for Admin Management (Read-Only)
 */
export async function getAdminProductById(
  id: string
): Promise<AdminProductDetailResult | null> {
  const prisma = getPrismaClient();
  if (!prisma) return null;

  try {
    const p = await prisma.product.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          orderBy: { sortOrder: "asc" },
        },
        sizeGuide: true,
      },
    });

    if (!p) return null;

    const displayName = p.officialName?.trim() || p.workingName;
    const stockSummary = deriveStockSummary(p.variants);

    return {
      id: p.id,
      slug: p.slug,
      workingName: p.workingName,
      officialName: p.officialName,
      displayName,
      category: p.category,
      silhouette: p.silhouette,
      description: p.description,
      priceMinor: p.priceMinor,
      currency: p.currency,
      thumbnail: p.thumbnail,
      hasAlpha: p.hasAlpha,
      gradientKey: p.gradientKey,
      active: p.active,
      featured: p.featured,
      sortOrder: p.sortOrder,
      badge: p.badge,
      tags: p.tags,
      sizeGuideId: p.sizeGuideId,
      sizeGuideName: p.sizeGuide?.name || null,
      sizeGuideUnit: p.sizeGuide?.unit || null,
      media: p.media.map((m) => ({
        id: m.id,
        src: m.src,
        alt: m.alt,
        sortOrder: m.sortOrder,
        isPrimary: m.isPrimary,
        hasAlpha: m.hasAlpha,
      })),
      variants: p.variants.map((v) => ({
        id: v.id,
        size: v.size,
        sku: v.sku,
        stockStatus: v.stockStatus,
        stockQuantity: v.stockQuantity,
        active: v.active,
        sortOrder: v.sortOrder,
      })),
      stockSummary,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`[METRONARY Admin Products] Failed to fetch product ${id}:`, error);
    return null;
  }
}
