import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/generated/prisma/client";

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  cityOrArea: string;
  itemCount: number;
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrdersStats {
  total: number;
  newCount: number;
  inProgressCount: number;
  deliveredCount: number;
  cancelledCount: number;
  unpaidCount: number;
}

export interface AdminOrdersOverviewResult {
  orders: AdminOrderListItem[];
  stats: AdminOrdersStats;
}

export interface AdminOrderItem {
  id: string;
  productId: string | null;
  variantId: string | null;
  productName: string;
  slug: string;
  size: string | null;
  quantity: number;
  unitPriceMinor: number;
  lineTotalMinor: number;
  currency: string;
  createdAt: string;
}

export interface AdminOrderDetailResult {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  cityOrArea: string;
  notes: string | null;
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: AdminOrderItem[];
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Format minor currency integer to human readable string (e.g. 80000 -> "800 EGP")
 */
export function formatEgpPrice(minor: number | null | undefined, currency = "EGP"): string {
  if (minor === null || minor === undefined || Number.isNaN(minor)) {
    return "—";
  }
  const major = minor / 100;
  return `${major.toLocaleString("en-US", {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

/**
 * Fetch all orders for admin orders list with real-time aggregated stats
 */
export async function getAdminOrders(): Promise<AdminOrdersOverviewResult> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      orders: [],
      stats: {
        total: 0,
        newCount: 0,
        inProgressCount: 0,
        deliveredCount: 0,
        cancelledCount: 0,
        unpaidCount: 0,
      },
    };
  }

  try {
    const rawOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            id: true,
            quantity: true,
          },
        },
      },
    });

    let newCount = 0;
    let inProgressCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let unpaidCount = 0;

    const orders: AdminOrderListItem[] = rawOrders.map((o) => {
      // Calculate item count (sum of all quantities)
      const itemCount = o.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

      // Track order stats
      if (o.orderStatus === "NEW") {
        newCount += 1;
      } else if (
        o.orderStatus === "CONFIRMED" ||
        o.orderStatus === "PACKING" ||
        o.orderStatus === "SHIPPED"
      ) {
        inProgressCount += 1;
      } else if (o.orderStatus === "DELIVERED") {
        deliveredCount += 1;
      } else if (o.orderStatus === "CANCELLED") {
        cancelledCount += 1;
      }

      if (o.paymentStatus === "UNPAID") {
        unpaidCount += 1;
      }

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        phone: o.phone,
        email: o.email,
        cityOrArea: o.cityOrArea,
        itemCount,
        subtotalMinor: o.subtotalMinor,
        deliveryFeeMinor: o.deliveryFeeMinor,
        totalMinor: o.totalMinor,
        currency: o.currency || "EGP",
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      };
    });

    return {
      orders,
      stats: {
        total: orders.length,
        newCount,
        inProgressCount,
        deliveredCount,
        cancelledCount,
        unpaidCount,
      },
    };
  } catch (error) {
    console.error("[METRONARY Admin Orders] Failed to fetch orders overview:", error);
    return {
      orders: [],
      stats: {
        total: 0,
        newCount: 0,
        inProgressCount: 0,
        deliveredCount: 0,
        cancelledCount: 0,
        unpaidCount: 0,
      },
    };
  }
}

/**
 * Fetch detailed order by ID for admin inspection
 */
export async function getAdminOrderById(id: string): Promise<AdminOrderDetailResult | null> {
  const cleanId = id ? id.trim() : "";
  if (!cleanId) return null;

  const prisma = getPrismaClient();
  if (!prisma) return null;

  try {
    const rawOrder = await prisma.order.findUnique({
      where: { id: cleanId },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!rawOrder) return null;

    const currency = rawOrder.currency || "EGP";
    let totalItemQuantity = 0;

    const items: AdminOrderItem[] = rawOrder.items.map((item) => {
      const qty = item.quantity || 1;
      totalItemQuantity += qty;
      const lineTotalMinor = item.unitPriceMinor * qty;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        slug: item.slug,
        size: item.size,
        quantity: qty,
        unitPriceMinor: item.unitPriceMinor,
        lineTotalMinor,
        currency,
        createdAt: item.createdAt.toISOString(),
      };
    });

    return {
      id: rawOrder.id,
      orderNumber: rawOrder.orderNumber,
      customerName: rawOrder.customerName,
      phone: rawOrder.phone,
      email: rawOrder.email,
      address: rawOrder.address,
      cityOrArea: rawOrder.cityOrArea,
      notes: rawOrder.notes,
      subtotalMinor: rawOrder.subtotalMinor,
      deliveryFeeMinor: rawOrder.deliveryFeeMinor,
      totalMinor: rawOrder.totalMinor,
      currency,
      orderStatus: rawOrder.orderStatus,
      paymentStatus: rawOrder.paymentStatus,
      paymentMethod: rawOrder.paymentMethod,
      items,
      itemCount: totalItemQuantity,
      createdAt: rawOrder.createdAt.toISOString(),
      updatedAt: rawOrder.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`[METRONARY Admin Orders] Failed to fetch order ${cleanId}:`, error);
    return null;
  }
}
