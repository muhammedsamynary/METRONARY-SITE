/**
 * Product, Variant & Size Guide Data Types — METRONARY Catalog Foundation
 *
 * Designed to seamlessly interface with future database models and admin CMS.
 */

export type ProductCategory = "all" | "tops" | "shorts" | "accessories";

export type StockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "unavailable"
  | "unknown";

export interface VariantMeasurement {
  length?: string;
  waist?: string;
  legOpening?: string;
  chest?: string;
  shoulder?: string;
  sleeve?: string;
  [key: string]: string | undefined;
}

export interface ProductVariant {
  /** Internal unique variant ID */
  id: string;
  /** Size label (e.g. S, M, L) */
  size: "S" | "M" | "L" | "XL" | "XXL" | string;
  /** Optional SKU identifier */
  sku?: string;
  /** Real stock status */
  stockStatus: StockStatus;
  /** Optional stock quantity (null when unknown) */
  stockQuantity?: number | null;
  /** Confirmed physical garment measurements */
  measurements?: VariantMeasurement;
  /** Active status */
  active?: boolean;
}

/**
 * Dynamic Size Guide Schema (Admin-compatible & Multi-Product Reusable)
 */
export interface SizeGuideColumn {
  /** Unique column identifier (e.g. "length", "waist", "chest") */
  key: string;
  /** Column header label (e.g. "LENGTH", "WAIST", "CHEST") */
  label: string;
}

export interface SizeGuideRow {
  /** Size label matching variant (e.g. "S", "M", "L") */
  size: string;
  /** Cell values keyed by column key */
  values: Record<string, string | number>;
}

export interface SizeGuide {
  /** Unique size guide identifier */
  id: string;
  /** Human-readable guide name */
  name: string;
  /** Measurement unit (e.g. "CM" or "IN") */
  unit: string;
  /** Dynamic columns definition */
  columns: SizeGuideColumn[];
  /** Dynamic row entries */
  rows: SizeGuideRow[];
  /** Optional guide notes */
  notes?: string | null;
}

export interface Product {
  /** Internal unique identifier */
  id: string;
  /** SEO-friendly unique URL slug */
  slug: string;
  /** Working / internal development label (e.g. FEARLESS, 1973) */
  workingName: string;
  /** Official commercial product title (null until approved) */
  officialName?: string | null;
  /** Primary category */
  category: "tops" | "shorts" | "accessories" | string;
  /** Sub-category / silhouette type (e.g. "Graphic Tee", "Camp-Collar Shirt", "Cargo Shorts") */
  silhouette?: string;
  /** Product narrative / description (null when unconfirmed) */
  description?: string | null;
  /** Confirmed commercial price (null if unconfirmed — no fake prices) */
  price?: number | null;
  /** Currency code */
  currency: string;
  /** All associated product media assets */
  images: string[];
  /** Primary showcase image */
  thumbnail: string;
  /** Whether thumbnail is a transparent cutout (true) or studio frame (false) */
  hasAlpha?: boolean;
  /** Associated ambient gradient theme key */
  gradientKey?: string;
  /** Storefront visibility status */
  active: boolean;
  /** Homepage / feature highlight */
  featured: boolean;
  /** Editorial label badge (e.g. "DROP 01", "EDITION 2026") */
  badge?: string;
  /** Tag metadata */
  tags?: string[];
  /** Configured product variants (e.g. confirmed sizes) */
  variants?: ProductVariant[];
  /** Assigned size guide ID */
  sizeGuideId?: string | null;
  /** Attached dynamic size guide */
  sizeGuide?: SizeGuide | null;
}
