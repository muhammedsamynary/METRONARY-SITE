"use server";

import { createOrder } from "@/lib/orders/create-order";
import type { CustomerDetailsInput, CheckoutCartItemInput } from "@/lib/checkout/types";

export interface SubmitOrderActionInput {
  customer: CustomerDetailsInput;
  items: CheckoutCartItemInput[];
}

export interface SubmitOrderActionSuccess {
  success: true;
  orderNumber: string;
  confirmationToken: string;
}

export interface SubmitOrderActionError {
  code: string;
  message: string;
  field?: string;
}

export interface SubmitOrderActionFailure {
  success: false;
  errors: SubmitOrderActionError[];
}

export type SubmitOrderActionResult = SubmitOrderActionSuccess | SubmitOrderActionFailure;

/**
 * Maps server domain validation codes to customer-safe, polished error messages.
 * Prevents raw Prisma, SQL, or internal architectural details from leaking to the browser.
 */
function mapCustomerSafeMessage(code: string, originalMessage: string): string {
  switch (code) {
    case "UNKNOWN_STOCK":
      return "This item is not currently available to order.";
    case "PRICE_UNAVAILABLE":
      return "The official price for this item is not currently available.";
    case "DELIVERY_FEE_UNAVAILABLE":
      return "Delivery pricing is not currently configured for this order.";
    case "INSUFFICIENT_STOCK":
      return "The requested quantity is no longer available.";
    case "OUT_OF_STOCK":
      return "One or more items in your cart are currently sold out.";
    case "UNAVAILABLE":
      return "One or more items in your cart are unavailable for purchase.";
    case "EMPTY_CART":
      return "Your bag is empty. Please add items before placing an order.";
    case "PRODUCT_NOT_FOUND":
    case "VARIANT_NOT_FOUND":
    case "VARIANT_MISMATCH":
      return "One or more items in your cart could not be verified. Please refresh your bag.";
    case "DATABASE_UNAVAILABLE":
    case "ORDER_CREATION_FAILED":
      return "Unable to complete order placement at this time. Please try again in a few moments.";
    default:
      return originalMessage || "An unexpected error occurred while placing your order.";
  }
}

/**
 * METRONARY Server Action: Submit Cash on Delivery Order
 *
 * Security & Data Model Guarantees:
 * - Accepts ONLY customer details and an array of { productId, variantId, quantity }.
 * - Ignores all client-provided prices, subtotals, currencies, titles, and stock flags.
 * - Delegates authoritative validation and transaction execution directly to lib/orders/createOrder.
 */
export async function submitOrderAction(
  input: SubmitOrderActionInput
): Promise<SubmitOrderActionResult> {
  try {
    // 1. Basic structural sanity check
    if (!input || typeof input !== "object") {
      return {
        success: false,
        errors: [{ code: "INVALID_PAYLOAD", message: "Invalid order request." }],
      };
    }

    if (!input.customer || !input.items || !Array.isArray(input.items)) {
      return {
        success: false,
        errors: [{ code: "INVALID_PAYLOAD", message: "Missing customer details or cart items." }],
      };
    }

    // 2. Execute authoritative order creation engine
    const result = await createOrder({
      customer: input.customer,
      items: input.items,
    });

    if (!result.success) {
      return {
        success: false,
        errors: result.errors.map((err) => ({
          code: err.code,
          message: mapCustomerSafeMessage(err.code, err.message),
          field: err.field,
        })),
      };
    }

    return {
      success: true,
      orderNumber: result.orderNumber,
      confirmationToken: result.confirmationToken,
    };
  } catch {
    // Defensive catch-all preventing unhandled exceptions or internal stack traces from leaking
    return {
      success: false,
      errors: [
        {
          code: "ORDER_CREATION_FAILED",
          message: "Unable to process order at this time. Please try again.",
        },
      ],
    };
  }
}
