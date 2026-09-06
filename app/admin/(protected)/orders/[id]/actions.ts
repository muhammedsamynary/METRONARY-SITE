"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getPrismaClient } from "@/lib/db/prisma";
import { AdminAuthorizationError } from "@/lib/admin/errors";
import type { OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import {
  validateOrderStatusTransition,
  validatePaymentStatusTransition,
} from "@/lib/admin/order-transitions";

export interface OrderActionState {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Revalidate all affected order management paths
 */
async function revalidateOrderPaths(orderId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

/**
 * Secure Server Action to update Order Status with database-level conditional concurrency guard
 */
export async function updateOrderStatusAction(
  orderId: string,
  nextStatus: OrderStatus,
  expectedCurrentStatus: OrderStatus
): Promise<OrderActionState> {
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

  const cleanId = orderId ? orderId.trim() : "";
  if (!cleanId) {
    return { success: false, error: "Invalid order identifier." };
  }

  try {
    // 2. Fetch existing order to validate initial business constraints
    const order = await prisma.order.findUnique({
      where: { id: cleanId },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // 3. Preliminary concurrency check
    if (order.orderStatus !== expectedCurrentStatus) {
      return {
        success: false,
        error: "ORDER STATUS CHANGED — REFRESH AND TRY AGAIN",
      };
    }

    // 4. Validate lifecycle transition rules
    const validation = validateOrderStatusTransition(order.orderStatus, nextStatus);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || "Invalid order status transition.",
      };
    }

    // 5. Database-level atomic conditional update
    const result = await prisma.order.updateMany({
      where: {
        id: order.id,
        orderStatus: expectedCurrentStatus,
      },
      data: {
        orderStatus: nextStatus,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "ORDER STATUS CHANGED — REFRESH AND TRY AGAIN",
      };
    }

    // 6. Revalidate affected paths
    await revalidateOrderPaths(order.id);

    return {
      success: true,
      message: `Order status successfully updated to ${nextStatus}.`,
    };
  } catch (error) {
    console.error(`[METRONARY Admin Order Update Status] Error for order ${cleanId}:`, error);
    return {
      success: false,
      error: "Unable to update order status. Please try again.",
    };
  }
}

/**
 * Secure Server Action to update COD Payment Status with database-level conditional concurrency guard
 */
export async function updateOrderPaymentStatusAction(
  orderId: string,
  nextPaymentStatus: PaymentStatus,
  expectedCurrentPaymentStatus: PaymentStatus
): Promise<OrderActionState> {
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

  const cleanId = orderId ? orderId.trim() : "";
  if (!cleanId) {
    return { success: false, error: "Invalid order identifier." };
  }

  try {
    // 2. Fetch existing order to validate initial business constraints
    const order = await prisma.order.findUnique({
      where: { id: cleanId },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // 3. Preliminary concurrency check
    if (order.paymentStatus !== expectedCurrentPaymentStatus) {
      return {
        success: false,
        error: "PAYMENT STATUS CHANGED — REFRESH AND TRY AGAIN",
      };
    }

    // 4. Validate payment transition rules
    const validation = validatePaymentStatusTransition(
      order.orderStatus,
      order.paymentStatus,
      nextPaymentStatus
    );
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || "Invalid payment status transition.",
      };
    }

    // 5. Build authoritative database-level conditional where clause
    const updateWhere: {
      id: string;
      paymentStatus: PaymentStatus;
      orderStatus?: OrderStatus;
    } = {
      id: order.id,
      paymentStatus: expectedCurrentPaymentStatus,
    };

    // When marking PAID, authoritatively enforce that the live database row MUST still be in DELIVERED state
    if (nextPaymentStatus === "PAID") {
      updateWhere.orderStatus = "DELIVERED";
    }

    // 6. Database-level atomic conditional update
    const result = await prisma.order.updateMany({
      where: updateWhere,
      data: {
        paymentStatus: nextPaymentStatus,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "PAYMENT STATUS CHANGED — REFRESH AND TRY AGAIN",
      };
    }

    // 7. Revalidate affected paths
    await revalidateOrderPaths(order.id);

    return {
      success: true,
      message: `Payment status successfully updated to ${nextPaymentStatus}.`,
    };
  } catch (error) {
    console.error(`[METRONARY Admin Order Update Payment] Error for order ${cleanId}:`, error);
    return {
      success: false,
      error: "Unable to update payment status. Please try again.",
    };
  }
}
