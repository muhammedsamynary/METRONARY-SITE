import { getPrismaClient } from "@/lib/db/prisma";
import type {
  CheckoutValidationInput,
  CheckoutValidationResult,
  CheckoutValidationError,
  ValidatedOrderItemSnapshot,
} from "./types";
import { validateCustomerDetails } from "./customer-validation";

/**
 * Server-Side Pure Checkout Validation Service
 *
 * Core Security Guarantee:
 * - Browser cart data (prices, subtotals, stock states) is never trusted.
 * - Authoritative product names, prices (priceMinor), and stock states are re-fetched from PostgreSQL.
 * - This function is strictly READ-ONLY and performs zero database mutations.
 */
export async function validateCheckout(
  input: CheckoutValidationInput
): Promise<CheckoutValidationResult> {
  const errors: CheckoutValidationError[] = [];
  const validatedItems: ValidatedOrderItemSnapshot[] = [];

  // 1. Validate customer data if provided
  let sanitizedCustomer = undefined;
  if (input.customer) {
    const customerValidation = validateCustomerDetails(input.customer);
    if (customerValidation.errors.length > 0) {
      errors.push(...customerValidation.errors);
    } else {
      sanitizedCustomer = customerValidation.sanitized;
    }
  }

  // 2. Validate Cart Item Array
  if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
    errors.push({
      code: "EMPTY_CART",
      message: "Your bag is empty. Please add items to proceed.",
    });

    return {
      success: false,
      errors,
      validatedCustomer: sanitizedCustomer,
      validatedItems: [],
      subtotalMinor: null,
      deliveryFeeMinor: null,
      totalMinor: null,
      currency: "EGP",
    };
  }

  // 3. Obtain PostgreSQL client
  const prisma = getPrismaClient();
  if (!prisma) {
    errors.push({
      code: "DATABASE_UNAVAILABLE",
      message: "Checkout service is currently offline. Please try again later.",
    });

    return {
      success: false,
      errors,
      validatedCustomer: sanitizedCustomer,
      validatedItems: [],
      subtotalMinor: null,
      deliveryFeeMinor: null,
      totalMinor: null,
      currency: "EGP",
    };
  }

  // 4. Validate each cart item against PostgreSQL
  for (let index = 0; index < input.items.length; index++) {
    const item = input.items[index];

    // Structural validation
    if (!item || typeof item !== "object") {
      errors.push({
        code: "INVALID_CART_ITEM",
        message: `Cart item at index ${index} is invalid.`,
      });
      continue;
    }

    if (!item.productId || typeof item.productId !== "string" || item.productId.trim() === "") {
      errors.push({
        code: "PRODUCT_NOT_FOUND",
        field: `items[${index}].productId`,
        message: "Missing product identifier.",
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    if (!item.variantId || typeof item.variantId !== "string" || item.variantId.trim() === "") {
      errors.push({
        code: "VARIANT_NOT_FOUND",
        field: `items[${index}].variantId`,
        message: "Missing size/variant identifier.",
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      errors.push({
        code: "INVALID_QUANTITY",
        field: `items[${index}].quantity`,
        message: "Item quantity must be a positive whole number (minimum 1).",
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    // Authoritative fetch from database
    const dbVariant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: true },
    });

    if (!dbVariant) {
      errors.push({
        code: "VARIANT_NOT_FOUND",
        field: `items[${index}].variantId`,
        message: "The requested size/variant could not be found.",
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    // Verify variant belongs to submitted product
    if (dbVariant.productId !== item.productId) {
      errors.push({
        code: "VARIANT_MISMATCH",
        message: "Variant mismatch: The selected size does not match the product.",
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    // Verify variant is active
    if (!dbVariant.active) {
      errors.push({
        code: "VARIANT_INACTIVE",
        message: "This product size is currently inactive.",
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    // Verify parent product exists and is active
    if (!dbVariant.product || !dbVariant.product.active) {
      errors.push({
        code: "PRODUCT_INACTIVE",
        message: "This product is currently inactive.",
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    const product = dbVariant.product;
    const productName = product.officialName ?? product.workingName;

    // Stock status validation
    if (dbVariant.stockStatus === "UNKNOWN") {
      errors.push({
        code: "UNKNOWN_STOCK",
        message: `Inventory availability is currently unconfirmed for "${productName}" (${dbVariant.size ?? "Standard"}).`,
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    if (dbVariant.stockStatus === "OUT_OF_STOCK") {
      errors.push({
        code: "OUT_OF_STOCK",
        message: `"${productName}" (${dbVariant.size ?? "Standard"}) is currently sold out.`,
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    if (dbVariant.stockStatus === "UNAVAILABLE") {
      errors.push({
        code: "UNAVAILABLE",
        message: `"${productName}" (${dbVariant.size ?? "Standard"}) is unavailable for purchase.`,
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    // Stock quantity check if known
    if (dbVariant.stockQuantity !== null && dbVariant.stockQuantity < item.quantity) {
      errors.push({
        code: "INSUFFICIENT_STOCK",
        message: `Only ${dbVariant.stockQuantity} item(s) available in stock for "${productName}" (${dbVariant.size ?? "Standard"}).`,
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    // Price validation
    if (product.priceMinor === null || product.priceMinor === undefined || product.priceMinor <= 0) {
      errors.push({
        code: "PRICE_UNAVAILABLE",
        message: `Official price is not yet configured for "${productName}".`,
        productId: item.productId,
        variantId: item.variantId,
      });
      continue;
    }

    // Authoritative integer line calculation
    const lineTotalMinor = product.priceMinor * item.quantity;

    validatedItems.push({
      productId: product.id,
      variantId: dbVariant.id,
      productName,
      slug: product.slug,
      size: dbVariant.size,
      quantity: item.quantity,
      unitPriceMinor: product.priceMinor,
      lineTotalMinor,
    });
  }

  // 5. Calculate Subtotal (only if all items validated successfully)
  const isAllItemsValid = errors.length === 0 && validatedItems.length === input.items.length;

  let subtotalMinor: number | null = null;
  if (isAllItemsValid) {
    subtotalMinor = validatedItems.reduce((acc, curr) => acc + curr.lineTotalMinor, 0);
  }

  return {
    success: isAllItemsValid,
    errors,
    validatedCustomer: sanitizedCustomer,
    validatedItems,
    subtotalMinor,
    deliveryFeeMinor: null, // Delivery fee rules not yet configured in Phase 11A
    totalMinor: null,        // Total remains null until delivery fee is officially added
    currency: "EGP",
  };
}
