/**
 * Product Data Types — METRONARY Catalog Foundation
 *
 * Designed to seamlessly interface with future database models and admin CMS.
 */

export type ProductCategory = "all" | "tops" | "shorts" | "accessories";

export interface ProductVariant {
  id: string;
  size: "S" | "M" | "L" | "XL" | "XXL" | string;
  sku?: string;
  inStock?: boolean;
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
  /** Product narrative / description (null during early development) */
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
}
