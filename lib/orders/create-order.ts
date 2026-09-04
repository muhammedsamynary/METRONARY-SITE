import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";
import { validateCheckout } from "@/lib/checkout/checkout-service";
import { resolveDeliveryFee } from "./delivery";
import { generateOrderNumber, generateConfirmationToken } from "./order-number";
import type { CreateOrderInput, CreateOrderResult } from "./types";

/**
 * Server-Side Pure Order Creation & Transaction Engine
 *
 * Core Security & Integrity Guarantees:
 * 1. Strictly ignores all client commerce values (prices, stock, subtotals, currency).
 * 2. Re-validates entire cart and customer details against authoritative PostgreSQL state.
 * 3. Enforces Cash on Delivery defaults: orderStatus=NEW, paymentStatus=UNPAID, paymentMethod=CASH_ON_DELIVERY.
 * 4. Resolves server-side delivery fee before committing.
 * 5. Atomically creates Order, OrderItem snapshots, and decrements tracked inventory within a single Prisma transaction.
 * 6. Generates customer-visible orderNumber (MET-XXXXXXXX) and secret anonymous confirmationToken (128-bit hex).
 * 7. Concurrency-safe: Conditional atomic updates prevent stock from decrementing below zero.
 * 8. Clean result types: Never leaks database connection strings, SQL errors, or internal exceptions.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  // 1. Initial Input Sanity Checks
  if (!input || typeof input !== "object") {
    return {
      success: false,
      errors: [
        {
          code: "EMPTY_CART",
          message: "Invalid order payload.",
        },
      ],
    };
  }

  if (!input.customer || typeof input.customer !== "object") {
    return {
      success: false,
      errors: [
        {
          code: "INVALID_CUSTOMER_NAME",
          message: "Customer delivery details are required.",
        },
      ],
    };
  }

  // 2. Perform Full Server Checkout Validation (Re-queries PostgreSQL)
  const validation = await validateCheckout({
    customer: input.customer,
    items: input.items,
  });

  if (!validation.success || validation.errors.length > 0 || !validation.validatedCustomer) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const sanitizedCustomer = validation.validatedCustomer;
  const validatedItems = validation.validatedItems;

  if (validatedItems.length === 0) {
    return {
      success: false,
      errors: [
        {
          code: "EMPTY_CART",
          message: "Your bag is empty. Please add items to proceed.",
        },
      ],
    };
  }

  // 3. Resolve Server-Side Delivery Fee
  const deliveryResolution = await resolveDeliveryFee(sanitizedCustomer.cityOrArea);

  if (!deliveryResolution.configured || deliveryResolution.deliveryFeeMinor === null) {
    return {
      success: false,
      errors: [
        {
          code: "DELIVERY_FEE_UNAVAILABLE",
          message: deliveryResolution.error ?? "Delivery fee is not yet configured for this destination.",
        },
      ],
    };
  }

  const deliveryFeeMinor = deliveryResolution.deliveryFeeMinor;

  // 4. Calculate Authoritative Integer Totals
  const subtotalMinor = validation.subtotalMinor;
  if (subtotalMinor === null || subtotalMinor <= 0) {
    return {
      success: false,
      errors: [
        {
          code: "PRICE_UNAVAILABLE",
          message: "Unable to calculate order subtotal due to unconfirmed item pricing.",
        },
      ],
    };
  }

  const totalMinor = subtotalMinor + deliveryFeeMinor;

  // 5. Connect to PostgreSQL
  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      success: false,
      errors: [
        {
          code: "DATABASE_UNAVAILABLE",
          message: "Order processing service is currently offline. Please try again later.",
        },
      ],
    };
  }

  // 6. Execute Atomic PostgreSQL Transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step A: Re-verify stock inside transaction and atomically decrement tracked inventory
      for (const item of validatedItems) {
        const currentVariant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: {
            id: true,
            active: true,
            stockStatus: true,
            stockQuantity: true,
          },
        });

        if (!currentVariant || !currentVariant.active) {
          throw new Error(`VARIANT_INACTIVE:${item.variantId}`);
        }

        if (
          currentVariant.stockStatus === "OUT_OF_STOCK" ||
          currentVariant.stockStatus === "UNAVAILABLE" ||
          currentVariant.stockStatus === "UNKNOWN"
        ) {
          throw new Error(`STOCK_UNAVAILABLE:${item.variantId}`);
        }

        // If numeric stock quantity is tracked, perform atomic conditional decrement
        if (currentVariant.stockQuantity !== null) {
          if (currentVariant.stockQuantity < item.quantity) {
            throw new Error(`INSUFFICIENT_STOCK:${item.variantId}`);
          }

          const updateCount = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              active: true,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          });

          if (updateCount.count === 0) {
            throw new Error(`INSUFFICIENT_STOCK:${item.variantId}`);
          }
        }
      }

      // Step B: Generate unique order number (with retry safety)
      let orderNumber = generateOrderNumber();
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 5) {
        const existing = await tx.order.findUnique({
          where: { orderNumber },
          select: { id: true },
        });

        if (!existing) {
          isUnique = true;
        } else {
          orderNumber = generateOrderNumber();
          attempts++;
        }
      }

      if (!isUnique) {
        throw new Error("ORDER_NUMBER_COLLISION");
      }

      // Step C: Generate unique 128-bit confirmation token for secret guest URL access
      let confirmationToken = generateConfirmationToken();
      let isTokenUnique = false;
      let tokenAttempts = 0;

      while (!isTokenUnique && tokenAttempts < 5) {
        const existingToken = await tx.order.findUnique({
          where: { confirmationToken },
          select: { id: true },
        });

        if (!existingToken) {
          isTokenUnique = true;
        } else {
          confirmationToken = generateConfirmationToken();
          tokenAttempts++;
        }
      }

      if (!isTokenUnique) {
        throw new Error("CONFIRMATION_TOKEN_COLLISION");
      }

      // Step D: Persist Order & OrderItem Snapshots
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          confirmationToken,
          customerName: sanitizedCustomer.customerName,
          phone: sanitizedCustomer.phone,
          email: sanitizedCustomer.email ?? null,
          address: sanitizedCustomer.address,
          cityOrArea: sanitizedCustomer.cityOrArea,
          notes: sanitizedCustomer.notes ?? null,
          subtotalMinor,
          deliveryFeeMinor,
          totalMinor,
          currency: "EGP",
          orderStatus: "NEW",
          paymentStatus: "UNPAID",
          paymentMethod: "CASH_ON_DELIVERY",
          items: {
            create: validatedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              slug: item.slug,
              size: item.size,
              quantity: item.quantity,
              unitPriceMinor: item.unitPriceMinor,
            })),
          },
        },
        select: {
          id: true,
          orderNumber: true,
          confirmationToken: true,
          subtotalMinor: true,
          deliveryFeeMinor: true,
          totalMinor: true,
          currency: true,
        },
      });

      return createdOrder;
    });

    return {
      success: true,
      orderNumber: result.orderNumber,
      confirmationToken: result.confirmationToken,
      orderId: result.id,
      subtotalMinor: result.subtotalMinor,
      deliveryFeeMinor: result.deliveryFeeMinor,
      totalMinor: result.totalMinor,
      currency: result.currency,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";

    if (message.startsWith("INSUFFICIENT_STOCK")) {
      const variantId = message.split(":")[1];
      return {
        success: false,
        errors: [
          {
            code: "INSUFFICIENT_STOCK",
            message: "Item quantity exceeds available stock.",
            variantId,
          },
        ],
      };
    }

    if (message.startsWith("STOCK_UNAVAILABLE")) {
      const variantId = message.split(":")[1];
      return {
        success: false,
        errors: [
          {
            code: "OUT_OF_STOCK",
            message: "One or more items in your cart are no longer available.",
            variantId,
          },
        ],
      };
    }

    // Generic safe error fallback (no internal details/secrets leaked)
    return {
      success: false,
      errors: [
        {
          code: "ORDER_CREATION_FAILED",
          message: "Unable to complete order placement at this time. Please try again.",
        },
      ],
    };
  }
}
