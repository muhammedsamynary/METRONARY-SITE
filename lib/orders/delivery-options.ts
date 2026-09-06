import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";

export interface StorefrontDeliveryOption {
  value: string;
  label: string;
  feeMinor: number;
  currency: string;
}

/**
 * Server-Side Active Delivery Options Loader for Storefront Checkout
 *
 * Security & Data Privacy Guarantees:
 * - Queries ONLY active delivery zones (where: { active: true }).
 * - Orders deterministically by sortOrder asc, then name asc.
 * - Projects ONLY safe storefront fields: normalizedKey (as value), name (as label), feeMinor, currency.
 * - Strictly hides internal database IDs, timestamps, and admin metadata.
 */
export async function getActiveDeliveryOptions(): Promise<StorefrontDeliveryOption[]> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return [];
  }

  try {
    const zones = await prisma.deliveryZone.findMany({
      where: {
        active: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        normalizedKey: true,
        name: true,
        feeMinor: true,
        currency: true,
      },
    });

    return zones.map((zone) => ({
      value: zone.normalizedKey,
      label: zone.name,
      feeMinor: zone.feeMinor,
      currency: zone.currency || "EGP",
    }));
  } catch (error) {
    console.error("[METRONARY Delivery Options] Database query failed:", error);
    return [];
  }
}
