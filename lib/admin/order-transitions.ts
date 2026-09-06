import type { OrderStatus, PaymentStatus } from "@/generated/prisma/client";

export interface StatusTransitionValidationResult {
  valid: boolean;
  error?: string;
}

export interface PaymentTransitionValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates whether transitioning from currentStatus to nextStatus is permitted
 */
export function validateOrderStatusTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): StatusTransitionValidationResult {
  if (currentStatus === nextStatus) {
    return { valid: false, error: `Order is already in ${currentStatus} status.` };
  }

  // Terminal states cannot be changed
  if (currentStatus === "DELIVERED") {
    return {
      valid: false,
      error: "Delivered orders are in a terminal state and cannot be modified.",
    };
  }

  if (currentStatus === "CANCELLED") {
    return {
      valid: false,
      error: "Cancelled orders are in a terminal state and cannot be modified.",
    };
  }

  // Handle Cancellation (permitted only from NEW, CONFIRMED, PACKING)
  if (nextStatus === "CANCELLED") {
    if (
      currentStatus === "NEW" ||
      currentStatus === "CONFIRMED" ||
      currentStatus === "PACKING"
    ) {
      return { valid: true };
    }
    return {
      valid: false,
      error: `Orders in ${currentStatus} status cannot be cancelled. Cancellation is only allowed before shipping.`,
    };
  }

  // Linear progression: NEW -> CONFIRMED -> PACKING -> SHIPPED -> DELIVERED
  const allowedLinearTransitions: Record<OrderStatus, OrderStatus> = {
    NEW: "CONFIRMED",
    CONFIRMED: "PACKING",
    PACKING: "SHIPPED",
    SHIPPED: "DELIVERED",
    DELIVERED: "DELIVERED", // Unreachable due to terminal check above
    CANCELLED: "CANCELLED", // Unreachable due to terminal check above
  };

  const expectedNext = allowedLinearTransitions[currentStatus];
  if (nextStatus === expectedNext) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Invalid status transition from ${currentStatus} to ${nextStatus}. Orders must follow sequential workflow (NEW → CONFIRMED → PACKING → SHIPPED → DELIVERED).`,
  };
}

/**
 * Validates whether changing payment status is permitted for COD orders
 */
export function validatePaymentStatusTransition(
  orderStatus: OrderStatus,
  currentPaymentStatus: PaymentStatus,
  nextPaymentStatus: PaymentStatus
): PaymentTransitionValidationResult {
  if (currentPaymentStatus === nextPaymentStatus) {
    return { valid: false, error: `Payment is already ${currentPaymentStatus}.` };
  }

  // Mark as PAID (Cash collected)
  if (nextPaymentStatus === "PAID") {
    if (orderStatus === "CANCELLED") {
      return {
        valid: false,
        error: "Cancelled orders cannot be marked as PAID.",
      };
    }

    if (orderStatus !== "DELIVERED") {
      return {
        valid: false,
        error: "COD orders can only be marked as PAID after successful delivery.",
      };
    }

    return { valid: true };
  }

  // Correction: PAID -> UNPAID
  if (nextPaymentStatus === "UNPAID") {
    return { valid: true };
  }

  return { valid: false, error: "Invalid payment status transition." };
}
