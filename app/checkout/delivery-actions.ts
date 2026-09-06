"use server";

import { resolveDeliveryFee } from "@/lib/orders/delivery";

export interface DeliveryQuoteResult {
  success: boolean;
  configured: boolean;
  zoneName: string | null;
  deliveryFeeMinor: number | null;
  currency: string;
  message?: string;
}

/**
 * Server-Side Delivery Quote Action
 *
 * Security & Reliability Guarantees:
 * - Server-only execution.
 * - Accepts ONLY cityOrArea string; never accepts or trusts delivery fees from the client.
 * - Resolves fee against active DeliveryZone records in PostgreSQL via resolveDeliveryFee().
 * - Returns safe typed response without exposing internal identifiers or database errors.
 */
export async function quoteDeliveryAction(
  cityOrArea: string
): Promise<DeliveryQuoteResult> {
  try {
    if (!cityOrArea || typeof cityOrArea !== "string" || !cityOrArea.trim()) {
      return {
        success: true,
        configured: false,
        zoneName: null,
        deliveryFeeMinor: null,
        currency: "EGP",
        message: "Delivery destination area is required.",
      };
    }

    const resolution = await resolveDeliveryFee(cityOrArea);

    if (resolution.configured && resolution.deliveryFeeMinor !== null) {
      return {
        success: true,
        configured: true,
        zoneName: resolution.zoneName ?? null,
        deliveryFeeMinor: resolution.deliveryFeeMinor,
        currency: resolution.currency || "EGP",
      };
    }

    return {
      success: true,
      configured: false,
      zoneName: null,
      deliveryFeeMinor: null,
      currency: resolution.currency || "EGP",
      message: resolution.error || "Delivery is not currently configured for this area.",
    };
  } catch (error) {
    console.error("[METRONARY Delivery Quote Action] Unexpected error:", error);
    return {
      success: false,
      configured: false,
      zoneName: null,
      deliveryFeeMinor: null,
      currency: "EGP",
      message: "Unable to calculate delivery fee. Please try again.",
    };
  }
}
