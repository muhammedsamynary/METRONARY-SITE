import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";

export interface AdminDeliveryZoneItem {
  id: string;
  name: string;
  normalizedKey: string;
  feeMinor: number;
  currency: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDeliveryStats {
  totalZones: number;
  activeCount: number;
  inactiveCount: number;
  lowestFeeMinor: number | null;
  highestFeeMinor: number | null;
}

export interface AdminDeliveryOverviewResult {
  zones: AdminDeliveryZoneItem[];
  stats: AdminDeliveryStats;
}

/**
 * Fetch all delivery zones with aggregated live statistics for admin management
 */
export async function getAdminDeliveryZones(): Promise<AdminDeliveryOverviewResult> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      zones: [],
      stats: {
        totalZones: 0,
        activeCount: 0,
        inactiveCount: 0,
        lowestFeeMinor: null,
        highestFeeMinor: null,
      },
    };
  }

  try {
    const rawZones = await prisma.deliveryZone.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    let activeCount = 0;
    let inactiveCount = 0;
    let lowestFeeMinor: number | null = null;
    let highestFeeMinor: number | null = null;

    const zones: AdminDeliveryZoneItem[] = rawZones.map((z) => {
      if (z.active) {
        activeCount += 1;
        if (lowestFeeMinor === null || z.feeMinor < lowestFeeMinor) {
          lowestFeeMinor = z.feeMinor;
        }
        if (highestFeeMinor === null || z.feeMinor > highestFeeMinor) {
          highestFeeMinor = z.feeMinor;
        }
      } else {
        inactiveCount += 1;
      }

      return {
        id: z.id,
        name: z.name,
        normalizedKey: z.normalizedKey,
        feeMinor: z.feeMinor,
        currency: z.currency || "EGP",
        active: z.active,
        sortOrder: z.sortOrder,
        createdAt: z.createdAt.toISOString(),
        updatedAt: z.updatedAt.toISOString(),
      };
    });

    return {
      zones,
      stats: {
        totalZones: zones.length,
        activeCount,
        inactiveCount,
        lowestFeeMinor,
        highestFeeMinor,
      },
    };
  } catch (error) {
    console.error("[METRONARY Admin Delivery] Failed to fetch delivery zones:", error);
    return {
      zones: [],
      stats: {
        totalZones: 0,
        activeCount: 0,
        inactiveCount: 0,
        lowestFeeMinor: null,
        highestFeeMinor: null,
      },
    };
  }
}
