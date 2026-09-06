"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getPrismaClient } from "@/lib/db/prisma";
import { AdminAuthorizationError } from "@/lib/admin/errors";
import { normalizeDeliveryKey, parseDeliveryFeeEgp } from "@/lib/admin/delivery-utils";

export interface DeliveryActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Revalidate delivery and checkout routes
 */
async function revalidateDeliveryPaths() {
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
}

/**
 * Secure Server Action to Create a Delivery Zone
 */
export async function createDeliveryZoneAction(
  _prevState: DeliveryActionState,
  formData: FormData
): Promise<DeliveryActionState> {
  // 1. Authoritative authorization check
  try {
    await requireAdmin();
  } catch (authError) {
    if (authError instanceof AdminAuthorizationError) {
      return { success: false, error: authError.message };
    }
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return { success: false, error: "Database service unavailable. Please try again later." };
  }

  try {
    const fieldErrors: Record<string, string> = {};

    // Name validation
    const rawName = formData.get("name");
    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (!name) {
      fieldErrors.name = "Zone name is required (e.g. Cairo, Giza, Alexandria).";
    } else if (name.length > 100) {
      fieldErrors.name = "Zone name must not exceed 100 characters.";
    }

    // Match Key normalization & validation
    const rawMatchKey = formData.get("matchKey");
    let normalizedKey = typeof rawMatchKey === "string" ? normalizeDeliveryKey(rawMatchKey) : "";
    if (!normalizedKey && name) {
      normalizedKey = normalizeDeliveryKey(name);
    }

    if (!normalizedKey) {
      fieldErrors.matchKey = "Match key is required (e.g. cairo, new-cairo).";
    } else if (normalizedKey.length > 100) {
      fieldErrors.matchKey = "Match key must not exceed 100 characters.";
    } else {
      // Check duplicate normalizedKey
      const existing = await prisma.deliveryZone.findUnique({
        where: { normalizedKey },
      });
      if (existing) {
        fieldErrors.matchKey = `A delivery zone with key "${normalizedKey}" already exists.`;
      }
    }

    // Fee validation (minor units)
    const rawFee = formData.get("fee");
    const feeParsed = parseDeliveryFeeEgp(typeof rawFee === "string" ? rawFee : "");
    if (!feeParsed.valid || feeParsed.feeMinor === undefined) {
      fieldErrors.fee = feeParsed.error || "Valid delivery fee in EGP is required.";
    }

    // Active status
    const rawActive = formData.get("active");
    const active = rawActive === "on" || rawActive === "true" || rawActive === "1";

    // Sort order
    const rawSortOrder = formData.get("sortOrder");
    let sortOrder = 0;
    if (rawSortOrder !== null && rawSortOrder !== undefined && String(rawSortOrder).trim() !== "") {
      const parsed = parseInt(String(rawSortOrder).trim(), 10);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        sortOrder = parsed;
      }
    } else {
      const count = await prisma.deliveryZone.count();
      sortOrder = count;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the validation errors before creating the delivery zone.",
        fieldErrors,
      };
    }

    // Create record
    await prisma.deliveryZone.create({
      data: {
        name,
        normalizedKey,
        feeMinor: feeParsed.feeMinor!,
        currency: "EGP",
        active,
        sortOrder,
      },
    });

    await revalidateDeliveryPaths();

    return {
      success: true,
      message: `Delivery zone "${name}" created successfully.`,
    };
  } catch (error) {
    console.error("[METRONARY Admin Delivery Create] Error creating zone:", error);
    return {
      success: false,
      error: "Unable to create delivery zone. Please try again.",
    };
  }
}

/**
 * Secure Server Action to Update an Existing Delivery Zone
 */
export async function updateDeliveryZoneAction(
  zoneId: string,
  _prevState: DeliveryActionState,
  formData: FormData
): Promise<DeliveryActionState> {
  // 1. Authoritative authorization check
  try {
    await requireAdmin();
  } catch (authError) {
    if (authError instanceof AdminAuthorizationError) {
      return { success: false, error: authError.message };
    }
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return { success: false, error: "Database service unavailable. Please try again later." };
  }

  const cleanZoneId = zoneId ? zoneId.trim() : "";
  if (!cleanZoneId) {
    return { success: false, error: "Invalid delivery zone identifier." };
  }

  try {
    const zone = await prisma.deliveryZone.findUnique({
      where: { id: cleanZoneId },
    });

    if (!zone) {
      return { success: false, error: "Delivery zone not found." };
    }

    const fieldErrors: Record<string, string> = {};

    // Name validation
    const rawName = formData.get("name");
    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (!name) {
      fieldErrors.name = "Zone name is required.";
    } else if (name.length > 100) {
      fieldErrors.name = "Zone name must not exceed 100 characters.";
    }

    // Match key validation
    const rawMatchKey = formData.get("matchKey");
    let normalizedKey = typeof rawMatchKey === "string" ? normalizeDeliveryKey(rawMatchKey) : "";
    if (!normalizedKey && name) {
      normalizedKey = normalizeDeliveryKey(name);
    }

    if (!normalizedKey) {
      fieldErrors.matchKey = "Match key is required.";
    } else if (normalizedKey.length > 100) {
      fieldErrors.matchKey = "Match key must not exceed 100 characters.";
    } else {
      // Check duplicate on other zones
      const duplicate = await prisma.deliveryZone.findFirst({
        where: {
          normalizedKey,
          id: { not: zone.id },
        },
      });
      if (duplicate) {
        fieldErrors.matchKey = `Another delivery zone with key "${normalizedKey}" already exists.`;
      }
    }

    // Fee validation
    const rawFee = formData.get("fee");
    const feeParsed = parseDeliveryFeeEgp(typeof rawFee === "string" ? rawFee : "");
    if (!feeParsed.valid || feeParsed.feeMinor === undefined) {
      fieldErrors.fee = feeParsed.error || "Valid delivery fee in EGP is required.";
    }

    // Active
    const rawActive = formData.get("active");
    const active = rawActive === "on" || rawActive === "true" || rawActive === "1";

    // Sort order
    const rawSortOrder = formData.get("sortOrder");
    let sortOrder = zone.sortOrder;
    if (rawSortOrder !== null && rawSortOrder !== undefined && String(rawSortOrder).trim() !== "") {
      const parsed = parseInt(String(rawSortOrder).trim(), 10);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        sortOrder = parsed;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the validation errors before saving.",
        fieldErrors,
      };
    }

    // Atomic update
    await prisma.deliveryZone.update({
      where: { id: zone.id },
      data: {
        name,
        normalizedKey,
        feeMinor: feeParsed.feeMinor!,
        active,
        sortOrder,
      },
    });

    await revalidateDeliveryPaths();

    return {
      success: true,
      message: `Delivery zone "${name}" updated successfully.`,
    };
  } catch (error) {
    console.error(`[METRONARY Admin Delivery Update] Error updating zone ${cleanZoneId}:`, error);
    return {
      success: false,
      error: "Unable to update delivery zone. Please try again.",
    };
  }
}
