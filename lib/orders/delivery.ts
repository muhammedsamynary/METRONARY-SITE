import "server-only";
import type { DeliveryFeeResolution } from "./types";

/**
 * Server-Side Delivery Fee Resolver
 *
 * Current Policy:
 * - Delivery rates are currently unconfigured in the production catalog.
 * - Resolves to configured: false and deliveryFeeMinor: null.
 * - Structured to seamlessly support future flat, governorate, or area-based rate tables
 *   without requiring changes to the checkout or order creation pipeline.
 */
export async function resolveDeliveryFee(
  cityOrArea?: string
): Promise<DeliveryFeeResolution> {
  // Normalize input if provided for future lookup tables
  const normalizedArea = cityOrArea?.trim().toLowerCase();

  // Currently, METRONARY delivery fee structure is pending official rates
  if (!normalizedArea || normalizedArea.length === 0) {
    return {
      configured: false,
      deliveryFeeMinor: null,
      currency: "EGP",
      error: "Delivery destination area is required to calculate shipping fee.",
    };
  }

  // Future area/governorate rate resolution logic will be placed here
  return {
    configured: false,
    deliveryFeeMinor: null,
    currency: "EGP",
    error: "Delivery fee for Egypt is not yet configured.",
  };
}
