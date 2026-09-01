import type {
  Product,
  ProductVariant,
  StockStatus as DomainStockStatus,
  SizeGuide,
  SizeGuideColumn,
  SizeGuideRow,
} from "@/lib/products/types";
import type {
  Product as DbProduct,
  ProductMedia as DbProductMedia,
  ProductVariant as DbProductVariant,
  SizeGuide as DbSizeGuide,
  SizeGuideColumn as DbSizeGuideColumn,
  SizeGuideRow as DbSizeGuideRow,
  SizeGuideCell as DbSizeGuideCell,
  StockStatus as DbStockStatus,
} from "@/generated/prisma/client";

/**
 * Map Prisma database StockStatus enum to storefront domain string literal
 */
export function mapDbStockStatus(status: DbStockStatus): DomainStockStatus {
  switch (status) {
    case "IN_STOCK":
      return "in_stock";
    case "LOW_STOCK":
      return "low_stock";
    case "OUT_OF_STOCK":
      return "out_of_stock";
    case "UNAVAILABLE":
      return "unavailable";
    case "UNKNOWN":
    default:
      return "unknown";
  }
}

/**
 * Map database price in minor units (e.g. piastres) to commercial price or null
 */
export function mapDbPriceMinor(priceMinor: number | null | undefined): number | null {
  if (priceMinor === null || priceMinor === undefined || isNaN(priceMinor)) {
    return null;
  }
  return priceMinor / 100;
}

/**
 * Map database ProductVariant to storefront ProductVariant
 */
export function mapDbVariant(variant: DbProductVariant): ProductVariant {
  return {
    id: variant.id,
    size: variant.size ?? "OS",
    sku: variant.sku ?? undefined,
    stockStatus: mapDbStockStatus(variant.stockStatus),
    stockQuantity: variant.stockQuantity ?? null,
    measurements: (variant.measurements as Record<string, string> | null) ?? undefined,
    active: variant.active,
  };
}

/**
 * Full composite DB SizeGuide with columns, rows, and cells
 */
export type DbSizeGuideWithRelations = DbSizeGuide & {
  columns: DbSizeGuideColumn[];
  rows: (DbSizeGuideRow & {
    cells: DbSizeGuideCell[];
  })[];
};

/**
 * Reconstruct normalized database SizeGuide into flexible storefront SizeGuide
 */
export function mapDbSizeGuide(guide: DbSizeGuideWithRelations): SizeGuide {
  // Sort columns by sortOrder
  const sortedColumns = [...guide.columns].sort((a, b) => a.sortOrder - b.sortOrder);
  const domainColumns: SizeGuideColumn[] = sortedColumns.map((col) => ({
    key: col.key,
    label: col.label,
  }));

  // Create columnId -> columnKey lookup map
  const columnIdToKey = new Map<string, string>();
  for (const col of sortedColumns) {
    columnIdToKey.set(col.id, col.key);
  }

  // Sort rows by sortOrder and assemble cell values
  const sortedRows = [...guide.rows].sort((a, b) => a.sortOrder - b.sortOrder);
  const domainRows: SizeGuideRow[] = sortedRows.map((row) => {
    const values: Record<string, string | number> = {};
    for (const cell of row.cells) {
      const colKey = columnIdToKey.get(cell.columnId);
      if (colKey) {
        // Parse numeric strings if pure numbers, otherwise preserve string
        const numVal = Number(cell.value);
        values[colKey] = !isNaN(numVal) && cell.value.trim() !== "" ? numVal : cell.value;
      }
    }
    return {
      size: row.label,
      values,
    };
  });

  return {
    id: guide.id,
    name: guide.name,
    unit: guide.unit,
    notes: guide.notes ?? null,
    columns: domainColumns,
    rows: domainRows,
  };
}

/**
 * Full composite DB Product with media, variants, and optional size guide
 */
export type DbProductWithRelations = DbProduct & {
  media?: DbProductMedia[];
  variants?: DbProductVariant[];
  sizeGuide?: DbSizeGuideWithRelations | null;
};

/**
 * Map database Product record and relations to storefront Product domain model
 */
export function mapDbProduct(dbProduct: DbProductWithRelations): Product {
  // Sort media by sortOrder
  const sortedMedia = dbProduct.media
    ? [...dbProduct.media].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  const images = sortedMedia.map((m) => m.src);
  const primaryMedia = sortedMedia.find((m) => m.isPrimary) || sortedMedia[0];
  const thumbnail = dbProduct.thumbnail || primaryMedia?.src || "/products/fearless.png";

  const variants = dbProduct.variants
    ? [...dbProduct.variants]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(mapDbVariant)
    : [];

  const sizeGuide = dbProduct.sizeGuide ? mapDbSizeGuide(dbProduct.sizeGuide) : null;

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    workingName: dbProduct.workingName,
    officialName: dbProduct.officialName ?? null,
    category: dbProduct.category,
    silhouette: dbProduct.silhouette ?? undefined,
    description: dbProduct.description ?? null,
    price: mapDbPriceMinor(dbProduct.priceMinor),
    currency: dbProduct.currency,
    images: images.length > 0 ? images : [thumbnail],
    thumbnail,
    hasAlpha: dbProduct.hasAlpha,
    gradientKey: dbProduct.gradientKey ?? undefined,
    active: dbProduct.active,
    featured: dbProduct.featured,
    badge: dbProduct.badge ?? undefined,
    tags: dbProduct.tags,
    variants,
    sizeGuideId: dbProduct.sizeGuideId ?? null,
    sizeGuide,
  };
}
