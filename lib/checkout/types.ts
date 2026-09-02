/**
 * METRONARY Server-Side COD Checkout Domain Types
 *
 * Core Security Rule:
 * The client only supplies identifiers (productId, variantId, quantity) and customer details.
 * All commerce attributes (pricing, stock, availability, product titles) are strictly
 * re-fetched from PostgreSQL and validated on the server.
 */

export interface CheckoutCartItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CustomerDetailsInput {
  customerName: string;
  phone: string;
  email?: string | null;
  address: string;
  cityOrArea: string;
  notes?: string | null;
}

export interface CheckoutValidationInput {
  customer?: CustomerDetailsInput;
  items: CheckoutCartItemInput[];
}

export type CheckoutValidationErrorCode =
  | "EMPTY_CART"
  | "INVALID_CART_ITEM"
  | "INVALID_QUANTITY"
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_INACTIVE"
  | "VARIANT_NOT_FOUND"
  | "VARIANT_MISMATCH"
  | "VARIANT_INACTIVE"
  | "UNKNOWN_STOCK"
  | "OUT_OF_STOCK"
  | "UNAVAILABLE"
  | "INSUFFICIENT_STOCK"
  | "PRICE_UNAVAILABLE"
  | "DELIVERY_FEE_UNAVAILABLE"
  | "ORDER_CREATION_FAILED"
  | "INVALID_CUSTOMER_NAME"
  | "INVALID_PHONE"
  | "INVALID_EMAIL"
  | "INVALID_ADDRESS"
  | "INVALID_CITY_OR_AREA"
  | "INVALID_NOTES"
  | "DATABASE_UNAVAILABLE";

export interface CheckoutValidationError {
  code: CheckoutValidationErrorCode;
  message: string;
  field?: string;
  productId?: string;
  variantId?: string;
}

export interface ValidatedOrderItemSnapshot {
  productId: string;
  variantId: string;
  productName: string;
  slug: string;
  size: string | null;
  quantity: number;
  unitPriceMinor: number;
  lineTotalMinor: number;
}

export interface CheckoutValidationResult {
  success: boolean;
  errors: CheckoutValidationError[];
  validatedCustomer?: CustomerDetailsInput;
  validatedItems: ValidatedOrderItemSnapshot[];
  subtotalMinor: number | null;
  deliveryFeeMinor: number | null;
  totalMinor: number | null;
  currency: string;
}
