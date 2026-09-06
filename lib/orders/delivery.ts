import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";
import { normalizeDeliveryKey } from "@/lib/admin/delivery-utils";
import type { DeliveryFeeResolution } from "./types";

/**
 * Server-Side Delivery Fee Resolver
 *
 * Resolves delivery fee for Egyptian destinations:
 * 1. Normalizes the customer input (trim, lowercase, normalize spaces/punctuation).
 * 2. Queries active DeliveryZone records in PostgreSQL by normalizedKey.
 * 3. Returns configured: true with authoritative integer deliveryFeeMinor if active match exists.
 * 4. Returns configured: false with safe error message if unconfigured or inactive.
 */
export async function resolveDeliveryFee(
  cityOrArea?: string
): Promise<DeliveryFeeResolution> {
  const normalizedKey = normalizeDeliveryKey(cityOrArea || "");

  if (!normalizedKey) {
    return {
      configured: false,
      deliveryFeeMinor: null,
      currency: "EGP",
      error: "Delivery destination area is required to calculate shipping fee.",
    };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      configured: false,
      deliveryFeeMinor: null,
      currency: "EGP",
      error: "Delivery service is currently unavailable. Please try again later.",
    };
  }

  try {
    const zone = await prisma.deliveryZone.findFirst({
      where: {
        normalizedKey,
        active: true,
      },
    });

    if (!zone) {
      return {
        configured: false,
        deliveryFeeMinor: null,
        currency: "EGP",
        error: "Delivery fee is not configured for this destination.",
      };
    }

    return {
      configured: true,
      deliveryFeeMinor: zone.feeMinor,
      currency: zone.currency || "EGP",
      zoneId: zone.id,
      zoneName: zone.name,
    };
  } catch (error) {
    console.error("[METRONARY Delivery Resolver] Database error resolving delivery fee:", error);
    return {
      configured: false,
      deliveryFeeMinor: null,
      currency: "EGP",
      error: "Unable to calculate delivery fee. Please try again.",
    };
  }
}
