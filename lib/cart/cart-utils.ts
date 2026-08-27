import type { CartItem, AddItemInput } from "./types";

export const CART_STORAGE_KEY = "metronary_cart_v1";

/**
 * Format currency amount with robust fallback
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency = "EGP"
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "";
  }
  return `${new Intl.NumberFormat("en-US").format(amount)} ${currency}`;
}

/**
 * Calculate cart subtotal safely.
 * Returns null if any item has an unconfirmed (null) price to prevent fake calculations.
 */
export function calculateCartSubtotal(items: CartItem[]): number | null {
  if (items.length === 0) {
    return 0;
  }

  for (const item of items) {
    if (item.unitPrice === null || item.unitPrice === undefined || isNaN(item.unitPrice)) {
      return null; // Subtotal cannot be calculated honestly
    }
  }

  return items.reduce((total, item) => total + (item.unitPrice as number) * item.quantity, 0);
}

/**
 * Generate a stable cart item identifier
 */
export function generateCartItemId(productId: string, variantId: string, size: string): string {
  return `${productId}:${variantId || size}`;
}

/**
 * Validate and sanitize cart items loaded from localStorage
 */
export function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  const sanitized: CartItem[] = [];

  for (const item of raw) {
    if (
      item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.productId === "string" &&
      typeof item.displayName === "string" &&
      typeof item.size === "string" &&
      typeof item.quantity === "number" &&
      !isNaN(item.quantity)
    ) {
      sanitized.push({
        id: item.id,
        productId: item.productId,
        slug: typeof item.slug === "string" ? item.slug : "",
        displayName: item.displayName,
        thumbnail: typeof item.thumbnail === "string" ? item.thumbnail : "/placeholder.png",
        variantId: typeof item.variantId === "string" ? item.variantId : "",
        size: item.size,
        quantity: Math.max(1, Math.floor(item.quantity)),
        unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : null,
        currency: typeof item.currency === "string" ? item.currency : "EGP",
        stockStatus: typeof item.stockStatus === "string" ? item.stockStatus : undefined,
        maxQuantity: typeof item.maxQuantity === "number" ? item.maxQuantity : null,
      });
    }
  }

  return sanitized;
}

/**
 * Pure reducer function to add or update an item in cart items array
 */
export function addItemToCartList(items: CartItem[], input: AddItemInput): CartItem[] {
  const itemId = generateCartItemId(input.productId, input.variantId, input.size);
  const existingIndex = items.findIndex((i) => i.id === itemId);
  const qtyToAdd = Math.max(1, input.quantity ?? 1);

  if (existingIndex > -1) {
    const existing = items[existingIndex];
    const newQty = existing.quantity + qtyToAdd;
    const cappedQty =
      existing.maxQuantity && newQty > existing.maxQuantity
        ? existing.maxQuantity
        : newQty;

    const updated = [...items];
    updated[existingIndex] = {
      ...existing,
      quantity: cappedQty,
    };
    return updated;
  }

  const newItem: CartItem = {
    id: itemId,
    productId: input.productId,
    slug: input.slug,
    displayName: input.displayName,
    thumbnail: input.thumbnail,
    variantId: input.variantId,
    size: input.size,
    quantity: qtyToAdd,
    unitPrice: input.unitPrice ?? null,
    currency: input.currency ?? "EGP",
    stockStatus: input.stockStatus,
    maxQuantity: input.maxQuantity ?? null,
  };

  return [...items, newItem];
}
