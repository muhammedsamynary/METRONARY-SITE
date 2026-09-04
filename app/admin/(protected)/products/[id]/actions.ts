"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getPrismaClient } from "@/lib/db/prisma";
import { parseEgpToMinor, parseTagsInput } from "@/lib/admin/products";
import { AdminAuthorizationError } from "@/lib/admin/errors";

export interface ProductUpdateActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Secure Server Action for Updating Product Core Attributes
 *
 * Rules:
 * - Independently enforces `requireAdmin()` on every execution.
 * - Product ID and Slug are non-editable (slug is preserved and locked).
 * - Price is deterministically parsed from EGP to priceMinor.
 * - Blank price sets priceMinor = null (unpriced, not 0).
 * - Safe sanitization and validation with zero raw Prisma/SQL error exposure.
 */
export async function updateProductAction(
  productId: string,
  _prevState: ProductUpdateActionState,
  formData: FormData
): Promise<ProductUpdateActionState> {
  // 1. Authoritative Authorization Check
  try {
    await requireAdmin();
  } catch (authError) {
    if (authError instanceof AdminAuthorizationError) {
      return {
        success: false,
        error: authError.message,
      };
    }
    return {
      success: false,
      error: "Unauthorized: Administrator privileges required.",
    };
  }

  // 2. Database Connection
  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      success: false,
      error: "Database service unavailable. Please try again later.",
    };
  }

  // 3. Validate Product ID
  if (!productId || typeof productId !== "string" || !productId.trim()) {
    return {
      success: false,
      error: "Invalid product identifier.",
    };
  }

  try {
    // 4. Verify Product Exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId.trim() },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    // 5. Parse & Validate Form Fields
    const fieldErrors: Record<string, string> = {};

    // Working Name (Required)
    const rawWorkingName = formData.get("workingName");
    const workingName =
      typeof rawWorkingName === "string" ? rawWorkingName.trim() : "";
    if (!workingName) {
      fieldErrors.workingName = "Working name is required.";
    } else if (workingName.length > 200) {
      fieldErrors.workingName = "Working name must not exceed 200 characters.";
    }

    // Official Name (Optional)
    const rawOfficialName = formData.get("officialName");
    const officialName =
      typeof rawOfficialName === "string" ? rawOfficialName.trim() : "";
    if (officialName.length > 200) {
      fieldErrors.officialName = "Official name must not exceed 200 characters.";
    }

    // Category (Required)
    const rawCategory = formData.get("category");
    const category =
      typeof rawCategory === "string" ? rawCategory.trim() : "";
    if (!category) {
      fieldErrors.category = "Category is required.";
    } else if (category.length > 100) {
      fieldErrors.category = "Category must not exceed 100 characters.";
    }

    // Silhouette (Optional)
    const rawSilhouette = formData.get("silhouette");
    const silhouette =
      typeof rawSilhouette === "string" ? rawSilhouette.trim() : "";
    if (silhouette.length > 100) {
      fieldErrors.silhouette = "Silhouette must not exceed 100 characters.";
    }

    // Description (Optional)
    const rawDescription = formData.get("description");
    const description =
      typeof rawDescription === "string" ? rawDescription.trim() : "";
    if (description.length > 5000) {
      fieldErrors.description = "Description must not exceed 5,000 characters.";
    }

    // Price EGP Conversion
    const rawPrice = formData.get("price");
    const priceInput = typeof rawPrice === "string" ? rawPrice.trim() : "";
    const { priceMinor, error: priceError } = parseEgpToMinor(priceInput);
    if (priceError) {
      fieldErrors.price = priceError;
    }

    // Badge (Optional)
    const rawBadge = formData.get("badge");
    const badge = typeof rawBadge === "string" ? rawBadge.trim() : "";
    if (badge.length > 50) {
      fieldErrors.badge = "Badge must not exceed 50 characters.";
    }

    // Sort Order (Integer)
    const rawSortOrder = formData.get("sortOrder");
    let sortOrder = 0;
    if (rawSortOrder !== null && rawSortOrder !== undefined) {
      const parsedSort = parseInt(String(rawSortOrder).trim(), 10);
      if (Number.isNaN(parsedSort) || !Number.isFinite(parsedSort)) {
        fieldErrors.sortOrder = "Sort order must be a valid integer.";
      } else {
        sortOrder = parsedSort;
      }
    }

    // Tags (Comma-separated)
    const rawTags = formData.get("tags");
    const tags = parseTagsInput(typeof rawTags === "string" ? rawTags : "");

    // Booleans
    const rawActive = formData.get("active");
    const active = rawActive === "true" || rawActive === "on" || rawActive === "1";

    const rawFeatured = formData.get("featured");
    const featured =
      rawFeatured === "true" || rawFeatured === "on" || rawFeatured === "1";

    // Size Guide ID (Optional / None)
    const rawSizeGuideId = formData.get("sizeGuideId");
    let sizeGuideId: string | null =
      typeof rawSizeGuideId === "string" && rawSizeGuideId.trim() !== ""
        ? rawSizeGuideId.trim()
        : null;

    if (sizeGuideId === "none" || sizeGuideId === "NONE") {
      sizeGuideId = null;
    }

    // If sizeGuideId provided, ensure it refers to a real SizeGuide
    if (sizeGuideId) {
      const existingGuide = await prisma.sizeGuide.findUnique({
        where: { id: sizeGuideId },
        select: { id: true },
      });
      if (!existingGuide) {
        fieldErrors.sizeGuideId = "Selected size guide does not exist.";
      }
    }

    // Return field validation errors if any
    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the errors in the form before saving.",
        fieldErrors,
      };
    }

    // 6. Execute Product Update
    await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        workingName,
        officialName: officialName || null,
        category,
        silhouette: silhouette || null,
        description: description || null,
        priceMinor,
        badge: badge || null,
        active,
        featured,
        sortOrder,
        tags,
        sizeGuideId,
      },
    });

    // 7. Route Revalidations
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${existingProduct.id}`);
    revalidatePath("/");
    revalidatePath("/shop");
    if (existingProduct.slug) {
      revalidatePath(`/product/${existingProduct.slug}`);
    }

    return {
      success: true,
      message: "Product updated successfully.",
    };
  } catch (error) {
    console.error(
      `[METRONARY Admin Product Update] Error updating product ${productId}:`,
      error
    );
    return {
      success: false,
      error: "Unable to update product. Please try again.",
    };
  }
}
