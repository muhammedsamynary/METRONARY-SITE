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

export interface VariantActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const VALID_STOCK_STATUSES = [
  "UNKNOWN",
  "IN_STOCK",
  "LOW_STOCK",
  "OUT_OF_STOCK",
  "UNAVAILABLE",
] as const;

type ValidStockStatus = (typeof VALID_STOCK_STATUSES)[number];

function parseStockQuantity(
  raw: FormDataEntryValue | null
): { quantity: number | null; error?: string } {
  if (raw === null || raw === undefined) {
    return { quantity: null };
  }
  const str = String(raw).trim();
  if (str === "") {
    return { quantity: null };
  }
  if (!/^\d+$/.test(str)) {
    if (str.startsWith("-")) {
      return { quantity: null, error: "Quantity cannot be negative." };
    }
    return {
      quantity: null,
      error: "Quantity must be a valid integer or blank.",
    };
  }
  const parsed = parseInt(str, 10);
  if (Number.isNaN(parsed) || !Number.isInteger(parsed) || !Number.isFinite(parsed)) {
    return {
      quantity: null,
      error: "Quantity must be a valid integer or blank.",
    };
  }
  if (parsed < 0) {
    return {
      quantity: null,
      error: "Quantity cannot be negative.",
    };
  }
  if (parsed > 1_000_000) {
    return {
      quantity: null,
      error: "Quantity exceeds allowable limit.",
    };
  }
  return { quantity: parsed };
}

/**
 * Secure Server Action for Updating Product Core Attributes
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

    if (sizeGuideId) {
      const existingGuide = await prisma.sizeGuide.findUnique({
        where: { id: sizeGuideId },
        select: { id: true },
      });
      if (!existingGuide) {
        fieldErrors.sizeGuideId = "Selected size guide does not exist.";
      }
    }

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

/**
 * Secure Server Action for Updating an Existing Product Variant
 *
 * Rules:
 * - Independently enforces `requireAdmin()`.
 * - Verifies product exists and variant exists.
 * - STRICT RELATIONSHIP CHECK: Verifies variant.productId === productId.
 * - Validates size, SKU, stockStatus enum, stockQuantity (integer >= 0 or null).
 * - Enforces duplicate active size check within the product.
 * - Atomic Prisma update with no raw error leak.
 */
export async function updateVariantAction(
  productId: string,
  variantId: string,
  _prevState: VariantActionState,
  formData: FormData
): Promise<VariantActionState> {
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

  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      success: false,
      error: "Database service unavailable. Please try again later.",
    };
  }

  const cleanProductId = productId ? productId.trim() : "";
  const cleanVariantId = variantId ? variantId.trim() : "";

  if (!cleanProductId || !cleanVariantId) {
    return {
      success: false,
      error: "Invalid product or variant identifier.",
    };
  }

  try {
    // 2. Verify Product Exists
    const product = await prisma.product.findUnique({
      where: { id: cleanProductId },
      select: { id: true, slug: true },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    // 3. Verify Variant Exists & Belongs to this Product
    const variant = await prisma.productVariant.findUnique({
      where: { id: cleanVariantId },
      select: { id: true, productId: true },
    });

    if (!variant) {
      return {
        success: false,
        error: "Variant not found.",
      };
    }

    if (variant.productId !== product.id) {
      return {
        success: false,
        error: "Security check failed: Variant does not belong to the specified product.",
      };
    }

    // 4. Validate Fields
    const fieldErrors: Record<string, string> = {};

    // Size
    const rawSize = formData.get("size");
    const size = typeof rawSize === "string" ? rawSize.trim() : "";
    if (!size) {
      fieldErrors.size = "Size is required.";
    } else if (size.length > 50) {
      fieldErrors.size = "Size must not exceed 50 characters.";
    }

    // Active
    const rawActive = formData.get("active");
    const active = rawActive === "true" || rawActive === "on" || rawActive === "1";

    // Duplicate Active Size Protection
    if (size && active) {
      const otherVariants = await prisma.productVariant.findMany({
        where: {
          productId: product.id,
          id: { not: variant.id },
        },
        select: { size: true, active: true },
      });

      const duplicate = otherVariants.some(
        (v) =>
          v.active &&
          v.size?.trim().toLowerCase() === size.trim().toLowerCase()
      );

      if (duplicate) {
        fieldErrors.size = `An active variant with size "${size}" already exists.`;
      }
    }

    // SKU
    const rawSku = formData.get("sku");
    const sku = typeof rawSku === "string" ? rawSku.trim() : "";
    if (sku.length > 100) {
      fieldErrors.sku = "SKU must not exceed 100 characters.";
    }

    // Stock Status
    const rawStockStatus = formData.get("stockStatus");
    const stockStatusCandidate =
      typeof rawStockStatus === "string" ? rawStockStatus.trim() : "";
    if (
      !VALID_STOCK_STATUSES.includes(
        stockStatusCandidate as ValidStockStatus
      )
    ) {
      fieldErrors.stockStatus = "Invalid stock status selected.";
    }
    const stockStatus = stockStatusCandidate as ValidStockStatus;

    // Stock Quantity
    const { quantity: stockQuantity, error: quantityError } =
      parseStockQuantity(formData.get("stockQuantity"));
    if (quantityError) {
      fieldErrors.stockQuantity = quantityError;
    }

    // Sort Order
    const rawSortOrder = formData.get("sortOrder");
    let sortOrder = 0;
    if (rawSortOrder !== null && rawSortOrder !== undefined) {
      const parsedSort = parseInt(String(rawSortOrder).trim(), 10);
      if (Number.isNaN(parsedSort) || !Number.isFinite(parsedSort)) {
        fieldErrors.sortOrder = "Sort order must be an integer.";
      } else {
        sortOrder = parsedSort;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the variant errors before saving.",
        fieldErrors,
      };
    }

    // 5. Execute Variant Update
    await prisma.productVariant.update({
      where: { id: variant.id },
      data: {
        size,
        sku: sku || null,
        stockStatus,
        stockQuantity,
        active,
        sortOrder,
      },
    });

    // 6. Revalidate Routes
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${product.id}`);
    revalidatePath("/");
    revalidatePath("/shop");
    if (product.slug) {
      revalidatePath(`/product/${product.slug}`);
    }

    return {
      success: true,
      message: "Variant updated successfully.",
    };
  } catch (error) {
    console.error(
      `[METRONARY Admin Variant Update] Error updating variant ${cleanVariantId}:`,
      error
    );
    return {
      success: false,
      error: "Unable to update variant. Please try again.",
    };
  }
}

/**
 * Secure Server Action for Creating a New Product Variant
 *
 * Rules:
 * - Independently enforces `requireAdmin()`.
 * - Verifies product exists.
 * - Requires non-empty size string.
 * - Prevents duplicate active size within product.
 * - Default stockStatus is UNKNOWN (not IN_STOCK).
 * - Default stockQuantity is null.
 * - Atomic Prisma create with no raw error leak.
 */
export async function createVariantAction(
  productId: string,
  _prevState: VariantActionState,
  formData: FormData
): Promise<VariantActionState> {
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

  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      success: false,
      error: "Database service unavailable. Please try again later.",
    };
  }

  const cleanProductId = productId ? productId.trim() : "";
  if (!cleanProductId) {
    return {
      success: false,
      error: "Invalid product identifier.",
    };
  }

  try {
    // 2. Verify Product Exists
    const product = await prisma.product.findUnique({
      where: { id: cleanProductId },
      select: { id: true, slug: true },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    // 3. Validate Fields
    const fieldErrors: Record<string, string> = {};

    // Size (Required for fashion garments)
    const rawSize = formData.get("size");
    const size = typeof rawSize === "string" ? rawSize.trim() : "";
    if (!size) {
      fieldErrors.size = "Size is required.";
    } else if (size.length > 50) {
      fieldErrors.size = "Size must not exceed 50 characters.";
    }

    // Active (Default true)
    const rawActive = formData.get("active");
    const active =
      rawActive === null
        ? true
        : rawActive === "true" || rawActive === "on" || rawActive === "1";

    // Duplicate Active Size Protection
    if (size && active) {
      const existingVariants = await prisma.productVariant.findMany({
        where: { productId: product.id },
        select: { size: true, active: true },
      });

      const duplicate = existingVariants.some(
        (v) =>
          v.active &&
          v.size?.trim().toLowerCase() === size.trim().toLowerCase()
      );

      if (duplicate) {
        fieldErrors.size = `An active variant with size "${size}" already exists.`;
      }
    }

    // SKU (Optional)
    const rawSku = formData.get("sku");
    const sku = typeof rawSku === "string" ? rawSku.trim() : "";
    if (sku.length > 100) {
      fieldErrors.sku = "SKU must not exceed 100 characters.";
    }

    // Stock Status (Default UNKNOWN)
    const rawStockStatus = formData.get("stockStatus");
    let stockStatus: ValidStockStatus = "UNKNOWN";
    if (rawStockStatus && typeof rawStockStatus === "string") {
      const candidate = rawStockStatus.trim();
      if (VALID_STOCK_STATUSES.includes(candidate as ValidStockStatus)) {
        stockStatus = candidate as ValidStockStatus;
      } else {
        fieldErrors.stockStatus = "Invalid stock status selected.";
      }
    }

    // Stock Quantity (Optional, Default null)
    const { quantity: stockQuantity, error: quantityError } =
      parseStockQuantity(formData.get("stockQuantity"));
    if (quantityError) {
      fieldErrors.stockQuantity = quantityError;
    }

    // Sort Order
    const rawSortOrder = formData.get("sortOrder");
    let sortOrder = 0;
    if (rawSortOrder !== null && rawSortOrder !== undefined && String(rawSortOrder).trim() !== "") {
      const parsedSort = parseInt(String(rawSortOrder).trim(), 10);
      if (Number.isNaN(parsedSort) || !Number.isFinite(parsedSort)) {
        fieldErrors.sortOrder = "Sort order must be an integer.";
      } else {
        sortOrder = parsedSort;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the variant errors before creating.",
        fieldErrors,
      };
    }

    // 4. Create Variant
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        size,
        sku: sku || null,
        stockStatus,
        stockQuantity,
        active,
        sortOrder,
      },
    });

    // 5. Revalidate Routes
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${product.id}`);
    revalidatePath("/");
    revalidatePath("/shop");
    if (product.slug) {
      revalidatePath(`/product/${product.slug}`);
    }

    return {
      success: true,
      message: "Variant created successfully.",
    };
  } catch (error) {
    console.error(
      `[METRONARY Admin Variant Create] Error creating variant for product ${cleanProductId}:`,
      error
    );
    return {
      success: false,
      error: "Unable to create variant. Please try again.",
    };
  }
}
