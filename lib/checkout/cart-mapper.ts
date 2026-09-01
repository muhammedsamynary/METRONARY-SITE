import type { CartItem } from "@/lib/cart/types";
import type { CheckoutCartItemInput } from "./types";

/**
 * Maps client CartItem[] to minimum untrusted CheckoutCartItemInput[] payload.
 *
 * Explicitly strips all client-side pricing, subtotals, descriptions, and stock statuses.
 */
export function mapCartItemsToCheckoutInput(items: CartItem[]): CheckoutCartItemInput[] {
  return items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
  }));
}
