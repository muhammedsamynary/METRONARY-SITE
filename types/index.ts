/**
 * METRONARY — Shared TypeScript types
 *
 * These are the core domain types for the application.
 * Database models will conform to these interfaces.
 */

// ─── Product ────────────────────────────────────────────────

export type ProductStatus = "active" | "draft" | "archived";

export interface ProductVariant {
  id: string;
  size: string;
  sku: string;
  stock: number;
  price: number; // in smallest currency unit (e.g. piastres)
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  images: string[]; // public-relative paths, e.g. /products/fearless.png
  variants: ProductVariant[];
  status: ProductStatus;
  createdAt: string; // ISO-8601
  updatedAt: string;
}

// ─── Size Guide ─────────────────────────────────────────────

export interface SizeGuideRow {
  size: string;
  chest?: string;
  shoulder?: string;
  length?: string;
  waist?: string;
  hips?: string;
}

export interface SizeGuide {
  id: string;
  productCategory: string;
  unit: "cm" | "in";
  rows: SizeGuideRow[];
  updatedAt: string;
}

// ─── Cart ───────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  // Denormalised for display speed
  productName: string;
  size: string;
  price: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

// ─── Order ──────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod"; // Cash on Delivery — expand later

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Admin ──────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "staff";
}

// ─── API response wrappers ───────────────────────────────────

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
