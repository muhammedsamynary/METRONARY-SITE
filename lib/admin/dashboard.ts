import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/generated/prisma/client";

export interface ProductMetrics {
  total: number;
  active: number;
  inactive: number;
  priced: number;
  unpriced: number;
  featured: number;
}

export interface InventoryMetrics {
  totalVariants: number;
  inStockVariants: number;
  lowStockVariants: number;
  outOfStockVariants: number;
  unknownStockVariants: number;
  unavailableVariants: number;
  totalTrackedUnits: number;
  productsWithNoVariants: number;
  productsWithUnconfirmedAvailability: number;
}

export interface OrderMetrics {
  total: number;
  newCount: number;
  inProgressCount: number;
  deliveredCount: number;
  cancelledCount: number;
  unpaidCount: number;
  paidCount: number;
}

export interface RevenueMetrics {
  totalOrderValueMinor: number;
  deliveredRevenueMinor: number;
  paidRevenueMinor: number;
  pendingCodValueMinor: number;
}

export interface DeliveryMetrics {
  activeZonesCount: number;
  inactiveZonesCount: number;
  lowestFeeMinor: number | null;
  highestFeeMinor: number | null;
  currency: string;
}

export interface SizeGuideMetrics {
  totalGuides: number;
  productsWithGuide: number;
  productsWithoutGuide: number;
  totalRows: number;
  totalCells: number;
}

export interface CatalogReadinessMetrics {
  purchaseReadyProductsCount: number;
  notReadyForCheckoutCount: number;
  unpricedCount: number;
  noVariantsCount: number;
  unknownStockVariantsCount: number;
  withoutSizeGuidesCount: number;
  inactiveProductsCount: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalMinor: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface CatalogAttentionItem {
  id: string;
  slug: string;
  name: string;
  thumbnail: string | null;
  category: string;
  priceMinor: number | null;
  reasons: string[];
}

export interface AdminDashboardData {
  products: ProductMetrics;
  inventory: InventoryMetrics;
  orders: OrderMetrics;
  revenue: RevenueMetrics;
  delivery: DeliveryMetrics;
  sizeGuides: SizeGuideMetrics;
  readiness: CatalogReadinessMetrics;
  recentOrders: DashboardRecentOrder[];
  catalogAttention: CatalogAttentionItem[];
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
 * Fetches authoritative aggregated dashboard metrics and summary records for METRONARY admin
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const prisma = getPrismaClient();

  const emptyFallback: AdminDashboardData = {
    products: { total: 0, active: 0, inactive: 0, priced: 0, unpriced: 0, featured: 0 },
    inventory: {
      totalVariants: 0,
      inStockVariants: 0,
      lowStockVariants: 0,
      outOfStockVariants: 0,
      unknownStockVariants: 0,
      unavailableVariants: 0,
      totalTrackedUnits: 0,
      productsWithNoVariants: 0,
      productsWithUnconfirmedAvailability: 0,
    },
    orders: {
      total: 0,
      newCount: 0,
      inProgressCount: 0,
      deliveredCount: 0,
      cancelledCount: 0,
      unpaidCount: 0,
      paidCount: 0,
    },
    revenue: {
      totalOrderValueMinor: 0,
      deliveredRevenueMinor: 0,
      paidRevenueMinor: 0,
      pendingCodValueMinor: 0,
    },
    delivery: {
      activeZonesCount: 0,
      inactiveZonesCount: 0,
      lowestFeeMinor: null,
      highestFeeMinor: null,
      currency: "EGP",
    },
    sizeGuides: {
      totalGuides: 0,
      productsWithGuide: 0,
      productsWithoutGuide: 0,
      totalRows: 0,
      totalCells: 0,
    },
    readiness: {
      purchaseReadyProductsCount: 0,
      notReadyForCheckoutCount: 0,
      unpricedCount: 0,
      noVariantsCount: 0,
      unknownStockVariantsCount: 0,
      withoutSizeGuidesCount: 0,
      inactiveProductsCount: 0,
    },
    recentOrders: [],
    catalogAttention: [],
  };

  if (!prisma) {
    return emptyFallback;
  }

  try {
    const [
      // Product Counts
      totalProducts,
      activeProducts,
      inactiveProducts,
      pricedProducts,
      unpricedProducts,
      featuredProducts,
      allProductsWithRelations,

      // Variant Counts
      totalVariants,
      inStockVariants,
      lowStockVariants,
      outOfStockVariants,
      unknownStockVariants,
      unavailableVariants,
      variantsSumResult,

      // Order Counts
      totalOrders,
      newOrders,
      inProgressOrders,
      deliveredOrders,
      cancelledOrders,
      unpaidOrders,
      paidOrders,

      // Revenue Aggregates
      totalOrderValueSum,
      deliveredRevenueSum,
      paidRevenueSum,
      pendingCodSum,

      // Delivery Zones
      activeZonesCount,
      inactiveZonesCount,
      activeDeliveryZones,

      // Size Guides
      totalSizeGuides,
      productsWithSizeGuides,
      productsWithoutSizeGuides,
      totalSizeRows,
      totalMeasurementCells,

      // Recent Orders
      rawRecentOrders,
    ] = await Promise.all([
      // 1. Products
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: false } }),
      prisma.product.count({ where: { priceMinor: { not: null } } }),
      prisma.product.count({ where: { priceMinor: null } }),
      prisma.product.count({ where: { featured: true } }),
      prisma.product.findMany({
        include: {
          variants: true,
          media: {
            select: { id: true, src: true, isPrimary: true },
            take: 1,
          },
        },
        orderBy: [{ active: "desc" }, { sortOrder: "asc" }],
      }),

      // 2. Inventory / Variants
      prisma.productVariant.count(),
      prisma.productVariant.count({ where: { stockStatus: "IN_STOCK" } }),
      prisma.productVariant.count({ where: { stockStatus: "LOW_STOCK" } }),
      prisma.productVariant.count({ where: { stockStatus: "OUT_OF_STOCK" } }),
      prisma.productVariant.count({ where: { stockStatus: "UNKNOWN" } }),
      prisma.productVariant.count({ where: { stockStatus: "UNAVAILABLE" } }),
      prisma.productVariant.aggregate({
        where: { stockQuantity: { not: null } },
        _sum: { stockQuantity: true },
      }),

      // 3. Orders
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "NEW" } }),
      prisma.order.count({
        where: { orderStatus: { in: ["CONFIRMED", "PACKING", "SHIPPED"] } },
      }),
      prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
      prisma.order.count({ where: { orderStatus: "CANCELLED" } }),
      prisma.order.count({ where: { paymentStatus: "UNPAID" } }),
      prisma.order.count({ where: { paymentStatus: "PAID" } }),

      // 4. Revenue Aggregates
      prisma.order.aggregate({
        where: { orderStatus: { not: "CANCELLED" } },
        _sum: { totalMinor: true },
      }),
      prisma.order.aggregate({
        where: { orderStatus: "DELIVERED" },
        _sum: { totalMinor: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { totalMinor: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: "UNPAID", orderStatus: { not: "CANCELLED" } },
        _sum: { totalMinor: true },
      }),

      // 5. Delivery Zones
      prisma.deliveryZone.count({ where: { active: true } }),
      prisma.deliveryZone.count({ where: { active: false } }),
      prisma.deliveryZone.findMany({
        where: { active: true },
        select: { feeMinor: true, currency: true },
        orderBy: { feeMinor: "asc" },
      }),

      // 6. Size Guides
      prisma.sizeGuide.count(),
      prisma.product.count({ where: { sizeGuideId: { not: null } } }),
      prisma.product.count({ where: { sizeGuideId: null } }),
      prisma.sizeGuideRow.count(),
      prisma.sizeGuideCell.count(),

      // 7. Recent Orders (Latest 5)
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          totalMinor: true,
          currency: true,
          orderStatus: true,
          paymentStatus: true,
          paymentMethod: true,
          createdAt: true,
        },
      }),
    ]);

    // Delivery fee min/max calculation
    let lowestFeeMinor: number | null = null;
    let highestFeeMinor: number | null = null;
    let deliveryCurrency = "EGP";

    if (activeDeliveryZones.length > 0) {
      lowestFeeMinor = activeDeliveryZones[0].feeMinor;
      highestFeeMinor = activeDeliveryZones[activeDeliveryZones.length - 1].feeMinor;
      deliveryCurrency = activeDeliveryZones[0].currency || "EGP";
    }

    // Catalog Readiness & Attention analysis
    let purchaseReadyCount = 0;
    let productsWithNoVariants = 0;
    let productsWithUnconfirmedAvailability = 0;

    const attentionItems: CatalogAttentionItem[] = [];

    for (const product of allProductsWithRelations) {
      const reasons: string[] = [];

      const isPriced = product.priceMinor !== null && product.priceMinor > 0;
      if (!isPriced) {
        reasons.push("PRICE NOT SET");
      }

      if (product.variants.length === 0) {
        reasons.push("NO VARIANTS");
        productsWithNoVariants += 1;
      }

      const hasUnknownStock = product.variants.some(
        (v) => v.stockStatus === "UNKNOWN" || (v.active && v.stockQuantity === null)
      );

      if (hasUnknownStock || product.variants.length === 0) {
        productsWithUnconfirmedAvailability += 1;
      }

      if (hasUnknownStock) {
        reasons.push("AVAILABILITY UNKNOWN");
      }

      if (product.media.length === 0 && !product.thumbnail) {
        reasons.push("NO MEDIA");
      }

      if (!product.active) {
        reasons.push("INACTIVE");
      }

      // Storefront purchasable rules:
      // Active + Priced + has at least one active variant that is IN_STOCK or LOW_STOCK with quantity != 0
      const hasPurchasableVariant = product.variants.some(
        (v) =>
          v.active &&
          (v.stockStatus === "IN_STOCK" || v.stockStatus === "LOW_STOCK") &&
          (v.stockQuantity === null || v.stockQuantity > 0)
      );

      if (product.active && isPriced && hasPurchasableVariant) {
        purchaseReadyCount += 1;
      }

      if (reasons.length > 0) {
        attentionItems.push({
          id: product.id,
          slug: product.slug,
          name: product.officialName || product.workingName,
          thumbnail: product.media[0]?.src || product.thumbnail || null,
          category: product.category,
          priceMinor: product.priceMinor,
          reasons,
        });
      }
    }

    // Sort attention items: unpriced & no variants first
    attentionItems.sort((a, b) => b.reasons.length - a.reasons.length);

    const recentOrders: DashboardRecentOrder[] = rawRecentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      totalMinor: o.totalMinor,
      currency: o.currency || "EGP",
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt.toISOString(),
    }));

    return {
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        priced: pricedProducts,
        unpriced: unpricedProducts,
        featured: featuredProducts,
      },
      inventory: {
        totalVariants,
        inStockVariants,
        lowStockVariants,
        outOfStockVariants,
        unknownStockVariants,
        unavailableVariants,
        totalTrackedUnits: variantsSumResult._sum.stockQuantity ?? 0,
        productsWithNoVariants,
        productsWithUnconfirmedAvailability,
      },
      orders: {
        total: totalOrders,
        newCount: newOrders,
        inProgressCount: inProgressOrders,
        deliveredCount: deliveredOrders,
        cancelledCount: cancelledOrders,
        unpaidCount: unpaidOrders,
        paidCount: paidOrders,
      },
      revenue: {
        totalOrderValueMinor: totalOrderValueSum._sum.totalMinor ?? 0,
        deliveredRevenueMinor: deliveredRevenueSum._sum.totalMinor ?? 0,
        paidRevenueMinor: paidRevenueSum._sum.totalMinor ?? 0,
        pendingCodValueMinor: pendingCodSum._sum.totalMinor ?? 0,
      },
      delivery: {
        activeZonesCount,
        inactiveZonesCount,
        lowestFeeMinor,
        highestFeeMinor,
        currency: deliveryCurrency,
      },
      sizeGuides: {
        totalGuides: totalSizeGuides,
        productsWithGuide: productsWithSizeGuides,
        productsWithoutGuide: productsWithoutSizeGuides,
        totalRows: totalSizeRows,
        totalCells: totalMeasurementCells,
      },
      readiness: {
        purchaseReadyProductsCount: purchaseReadyCount,
        notReadyForCheckoutCount: totalProducts - purchaseReadyCount,
        unpricedCount: unpricedProducts,
        noVariantsCount: productsWithNoVariants,
        unknownStockVariantsCount: unknownStockVariants,
        withoutSizeGuidesCount: productsWithoutSizeGuides,
        inactiveProductsCount: inactiveProducts,
      },
      recentOrders,
      catalogAttention: attentionItems.slice(0, 8),
    };
  } catch (error) {
    console.error("[METRONARY Admin Dashboard] Failed to aggregate metrics:", error);
    return emptyFallback;
  }
}
