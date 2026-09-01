import type { Product, ProductCategory, SizeGuide } from "@/lib/products/types";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  getCatalogProducts as getFallbackProducts,
  getProductBySlug as getFallbackProductBySlug,
  getProductsByCategory as getFallbackProductsByCategory,
} from "@/lib/products/catalog";
import { getSizeGuideById as getFallbackSizeGuideById } from "@/lib/products/size-guides";
import {
  mapDbProduct,
  mapDbSizeGuide,
  type DbProductWithRelations,
  type DbSizeGuideWithRelations,
} from "./product-mappers";

const PRODUCT_RELATIONS_INCLUDE = {
  media: true,
  variants: true,
  sizeGuide: {
    include: {
      columns: true,
      rows: {
        include: {
          cells: true,
        },
      },
    },
  },
} as const;

const SIZE_GUIDE_RELATIONS_INCLUDE = {
  columns: true,
  rows: {
    include: {
      cells: true,
    },
  },
} as const;

/**
 * Fetch all active catalog products.
 *
 * Source-of-truth behavior:
 * - If DATABASE_URL is missing: returns verified fallback seed catalog.
 * - If DATABASE_URL is present: queries PostgreSQL via Prisma. If DB query fails, throws genuine error.
 */
export async function getCatalogProducts(): Promise<Product[]> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return getFallbackProducts();
  }

  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: PRODUCT_RELATIONS_INCLUDE,
  });

  return (dbProducts as unknown as DbProductWithRelations[]).map(mapDbProduct);
}

/**
 * Alias for getCatalogProducts
 */
export async function getActiveProducts(): Promise<Product[]> {
  return getCatalogProducts();
}

/**
 * Fetch a single product by unique slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return getFallbackProductBySlug(slug);
  }

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_RELATIONS_INCLUDE,
  });

  if (!dbProduct || !dbProduct.active) {
    return undefined;
  }

  return mapDbProduct(dbProduct as unknown as DbProductWithRelations);
}

/**
 * Fetch products filtered by category.
 */
export async function getProductsByCategory(
  category: ProductCategory | string
): Promise<Product[]> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return getFallbackProductsByCategory(category);
  }

  if (category === "all") {
    return getCatalogProducts();
  }

  const dbProducts = await prisma.product.findMany({
    where: { category, active: true },
    orderBy: { sortOrder: "asc" },
    include: PRODUCT_RELATIONS_INCLUDE,
  });

  return (dbProducts as unknown as DbProductWithRelations[]).map(mapDbProduct);
}

/**
 * Fetch a dynamic Size Guide by unique identifier.
 */
export async function getSizeGuideById(id: string): Promise<SizeGuide | undefined> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return getFallbackSizeGuideById(id);
  }

  const dbGuide = await prisma.sizeGuide.findUnique({
    where: { id },
    include: SIZE_GUIDE_RELATIONS_INCLUDE,
  });

  if (!dbGuide) {
    return undefined;
  }

  return mapDbSizeGuide(dbGuide as unknown as DbSizeGuideWithRelations);
}
