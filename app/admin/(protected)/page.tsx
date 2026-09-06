import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAdminDashboardData, formatEgpPrice } from "@/lib/admin/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — METRONARY Control Center",
};

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const { products, inventory, orders, revenue, delivery, sizeGuides, readiness, recentOrders, catalogAttention } = data;

  const readinessPercentage =
    products.total > 0
      ? Math.round((readiness.purchaseReadyProductsCount / products.total) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-8 max-w-[1536px]">
      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(245,244,238,0.08)] pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono tracking-[0.2em] text-[var(--m-gold)] uppercase mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.16em] uppercase text-[var(--m-cream)]">
            DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-[rgba(245,244,238,0.5)] mt-1 font-mono">
            Authoritative real-time commerce, catalog readiness, and logistics overview.
          </p>
        </div>

        {/* Quick Direct Link Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/orders"
            className="px-3.5 py-2 rounded-lg bg-[rgba(245,244,238,0.04)] hover:bg-[rgba(245,244,238,0.08)] border border-[rgba(245,244,238,0.12)] text-[var(--m-cream)] font-mono text-[11px] tracking-[0.14em] uppercase transition-all"
          >
            ORDERS ({orders.total})
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-2 rounded-lg bg-[rgba(245,244,238,0.04)] hover:bg-[rgba(245,244,238,0.08)] border border-[rgba(245,244,238,0.12)] text-[var(--m-cream)] font-mono text-[11px] tracking-[0.14em] uppercase transition-all"
          >
            PRODUCTS ({products.total})
          </Link>
          <Link
            href="/admin/delivery"
            className="px-3.5 py-2 rounded-lg bg-[rgba(245,244,238,0.04)] hover:bg-[rgba(245,244,238,0.08)] border border-[rgba(245,244,238,0.12)] text-[var(--m-cream)] font-mono text-[11px] tracking-[0.14em] uppercase transition-all"
          >
            ZONES ({delivery.activeZonesCount})
          </Link>
        </div>
      </div>

      {/* ─── ROW 1: PRIMARY METRIC CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. ORDERS CARD */}
        <div className="p-5 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
              CUSTOMER ORDERS
            </span>
            <Link
              href="/admin/orders"
              className="text-[10px] font-mono text-[var(--m-gold)] hover:underline uppercase tracking-wider"
            >
              VIEW →
            </Link>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--m-cream)]">
                {orders.total}
              </span>
              <span className="text-xs font-mono text-[rgba(245,244,238,0.4)]">
                TOTAL
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-[rgba(245,244,238,0.06)] grid grid-cols-4 gap-1 font-mono text-center">
            <div className="flex flex-col">
              <span className="text-[9px] text-sky-400/80 uppercase">NEW</span>
              <span className="text-xs font-bold text-sky-300">{orders.newCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-amber-400/80 uppercase">PROG</span>
              <span className="text-xs font-bold text-amber-300">{orders.inProgressCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-emerald-400/80 uppercase">DONE</span>
              <span className="text-xs font-bold text-emerald-300">{orders.deliveredCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-red-400/80 uppercase">CANC</span>
              <span className="text-xs font-bold text-red-300">{orders.cancelledCount}</span>
            </div>
          </div>
        </div>

        {/* 2. REVENUE CARD */}
        <div className="p-5 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
              COMMERCE REVENUE
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold bg-[rgba(251,133,0,0.12)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)]">
              COD
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[var(--m-gold)] truncate">
                {formatEgpPrice(revenue.deliveredRevenueMinor)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
              DELIVERED REVENUE
            </span>
          </div>
          <div className="pt-3 border-t border-[rgba(245,244,238,0.06)] flex items-center justify-between font-mono text-[11px]">
            <div className="flex flex-col">
              <span className="text-[9px] text-[rgba(245,244,238,0.4)] uppercase">ORDER VALUE</span>
              <span className="text-[var(--m-cream)] font-semibold truncate max-w-[120px]">
                {formatEgpPrice(revenue.totalOrderValueMinor)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-amber-300/70 uppercase">PENDING COD</span>
              <span className="text-amber-300 font-semibold truncate max-w-[120px]">
                {formatEgpPrice(revenue.pendingCodValueMinor)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. PRODUCTS CARD */}
        <div className="p-5 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
              CATALOG PRODUCTS
            </span>
            <Link
              href="/admin/products"
              className="text-[10px] font-mono text-[var(--m-gold)] hover:underline uppercase tracking-wider"
            >
              MANAGE →
            </Link>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--m-cream)]">
                {products.total}
              </span>
              <span className="text-xs font-mono text-emerald-400">
                ({products.active} ACTIVE)
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-[rgba(245,244,238,0.06)] flex items-center justify-between font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[rgba(245,244,238,0.4)]">PRICED:</span>
              <span className="font-bold text-[var(--m-gold)]">{products.priced}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[rgba(245,244,238,0.4)]">UNPRICED:</span>
              <span className="font-bold text-amber-300">{products.unpriced}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[rgba(245,244,238,0.4)]">FEATURED:</span>
              <span className="font-bold text-[var(--m-cream)]">{products.featured}</span>
            </div>
          </div>
        </div>

        {/* 4. INVENTORY CARD */}
        <div className="p-5 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
              INVENTORY & UNITS
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {inventory.totalVariants} VARIANTS
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--m-cream)]">
                {inventory.totalTrackedUnits.toLocaleString("en-US")}
              </span>
              <span className="text-xs font-mono text-[rgba(245,244,238,0.4)]">
                TRACKED UNITS
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-[rgba(245,244,238,0.06)] grid grid-cols-3 gap-1 font-mono text-[10px] text-center">
            <div className="flex flex-col">
              <span className="text-emerald-400/80 uppercase">IN STOCK</span>
              <span className="text-xs font-bold text-emerald-300">{inventory.inStockVariants}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-amber-400/80 uppercase">LOW</span>
              <span className="text-xs font-bold text-amber-300">{inventory.lowStockVariants}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-400/80 uppercase">UNKNOWN</span>
              <span className="text-xs font-bold text-neutral-300">{inventory.unknownStockVariants}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: STORE READINESS & CATALOG LAUNCH SIGNALS ─── */}
      <div className="p-6 rounded-2xl bg-[rgba(22,22,20,0.75)] border border-[rgba(245,244,238,0.1)] flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold font-mono tracking-[0.16em] uppercase text-[var(--m-cream)]">
                STORE READINESS
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                  readinessPercentage === 100
                    ? "bg-emerald-950/50 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-950/40 text-amber-300 border border-amber-500/30"
                }`}
              >
                {readinessPercentage}% CHECKOUT READY
              </span>
            </div>
            <p className="text-xs font-mono text-[rgba(245,244,238,0.5)] mt-0.5">
              Real-time checkout eligibility and catalog completeness analysis.
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span className="text-emerald-400 font-bold">{readiness.purchaseReadyProductsCount} Ready for Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span className="text-amber-400 font-bold">{readiness.notReadyForCheckoutCount} Setup Needed</span>
            </div>
          </div>
        </div>

        {/* Readiness Visual Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[rgba(245,244,238,0.06)] overflow-hidden flex">
          <div
            style={{ width: `${readinessPercentage}%` }}
            className="h-full bg-gradient-to-r from-[var(--m-gold)] to-emerald-400 rounded-full transition-all duration-500"
          />
        </div>

        {/* Readiness Badges / Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.06)] flex flex-col gap-1">
            <span className="text-[10px] text-[rgba(245,244,238,0.45)] uppercase">UNPRICED PRODUCTS</span>
            <span className={`text-base font-bold ${readiness.unpricedCount > 0 ? "text-amber-300" : "text-emerald-400"}`}>
              {readiness.unpricedCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.06)] flex flex-col gap-1">
            <span className="text-[10px] text-[rgba(245,244,238,0.45)] uppercase">NO VARIANTS</span>
            <span className={`text-base font-bold ${readiness.noVariantsCount > 0 ? "text-amber-300" : "text-emerald-400"}`}>
              {readiness.noVariantsCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.06)] flex flex-col gap-1">
            <span className="text-[10px] text-[rgba(245,244,238,0.45)] uppercase">UNKNOWN STOCK</span>
            <span className={`text-base font-bold ${readiness.unknownStockVariantsCount > 0 ? "text-amber-300" : "text-emerald-400"}`}>
              {readiness.unknownStockVariantsCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.06)] flex flex-col gap-1">
            <span className="text-[10px] text-[rgba(245,244,238,0.45)] uppercase">NO SIZE GUIDE</span>
            <span className="text-base font-bold text-[rgba(245,244,238,0.7)]">
              {readiness.withoutSizeGuidesCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.06)] flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[rgba(245,244,238,0.45)] uppercase">INACTIVE PRODUCTS</span>
            <span className={`text-base font-bold ${readiness.inactiveProductsCount > 0 ? "text-neutral-400" : "text-emerald-400"}`}>
              {readiness.inactiveProductsCount}
            </span>
          </div>
        </div>
      </div>

      {/* ─── ROW 3: RECENT ORDERS & CATALOG ATTENTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RECENT ORDERS (7 Columns) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-mono tracking-[0.18em] uppercase text-[var(--m-cream)]">
                RECENT ORDERS
              </h2>
              <p className="text-[11px] font-mono text-[rgba(245,244,238,0.45)] mt-0.5">
                Latest customer activity and COD order statuses.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-mono text-[var(--m-gold)] hover:underline uppercase tracking-wider"
            >
              VIEW ALL ({orders.total}) →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 px-4 rounded-xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.04)] text-center flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[rgba(245,244,238,0.04)] border border-[rgba(245,244,238,0.08)] flex items-center justify-center text-[rgba(245,244,238,0.4)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-[rgba(245,244,238,0.6)] font-semibold">
                NO ORDERS YET
              </span>
              <p className="font-mono text-[11px] text-[rgba(245,244,238,0.35)] max-w-sm">
                When customers place orders on the storefront, live order records will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[rgba(245,244,238,0.06)] overflow-x-auto">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-[rgba(245,244,238,0.03)] rounded-lg transition-colors font-mono text-xs"
                >
                  <div className="flex flex-col gap-0.5 min-w-[120px]">
                    <span className="font-bold text-[var(--m-gold)] tracking-wider">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] text-[var(--m-cream)] truncate max-w-[140px]">
                      {order.customerName}
                    </span>
                  </div>

                  <div className="hidden sm:flex flex-col gap-0.5 text-right">
                    <span className="text-[var(--m-cream)] font-semibold">
                      {formatEgpPrice(order.totalMinor, order.currency)}
                    </span>
                    <span className="text-[10px] text-[rgba(245,244,238,0.4)]">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] uppercase font-semibold ${
                        order.orderStatus === "NEW"
                          ? "bg-sky-950/50 text-sky-300 border border-sky-500/30"
                          : order.orderStatus === "DELIVERED"
                          ? "bg-emerald-950/50 text-emerald-300 border border-emerald-500/30"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-red-950/50 text-red-300 border border-red-500/30"
                          : "bg-amber-950/50 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] uppercase font-semibold ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-950/50 text-emerald-300 border border-emerald-500/30"
                          : "bg-[rgba(251,133,0,0.12)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)]"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CATALOG ATTENTION (5 Columns) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-mono tracking-[0.18em] uppercase text-[var(--m-cream)]">
                CATALOG ATTENTION
              </h2>
              <p className="text-[11px] font-mono text-[rgba(245,244,238,0.45)] mt-0.5">
                Products needing pricing, variants, or configuration.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-mono text-[var(--m-gold)] hover:underline uppercase tracking-wider"
            >
              ALL PRODUCTS →
            </Link>
          </div>

          {catalogAttention.length === 0 ? (
            <div className="py-12 px-4 rounded-xl bg-[rgba(245,244,238,0.02)] border border-[rgba(245,244,238,0.04)] text-center flex flex-col items-center justify-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                ALL PRODUCTS FULLY CONFIGURED
              </span>
              <p className="font-mono text-[11px] text-[rgba(245,244,238,0.35)]">
                Every product has active pricing, variants, and complete data.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[rgba(245,244,238,0.06)]">
              {catalogAttention.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/products/${item.id}`}
                  className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-[rgba(245,244,238,0.03)] rounded-lg transition-colors font-mono"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-bold text-[var(--m-cream)] uppercase truncate">
                      {item.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      {item.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-semibold bg-amber-950/40 text-amber-300/90 border border-amber-500/25"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[var(--m-gold)] block">
                      {item.priceMinor ? formatEgpPrice(item.priceMinor) : "NO PRICE"}
                    </span>
                    <span className="text-[9px] text-[rgba(245,244,238,0.4)] uppercase">
                      EDIT →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── ROW 4: INFRASTRUCTURE & QUICK ACTIONS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DELIVERY CONFIGURATION OVERVIEW */}
        <div className="p-5 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
              DELIVERY CONFIGURATION
            </span>
            <Link
              href="/admin/delivery"
              className="text-[10px] font-mono text-[var(--m-gold)] hover:underline uppercase tracking-wider"
            >
              SETTINGS →
            </Link>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--m-cream)]">
                {delivery.activeZonesCount}
              </span>
              <span className="text-xs font-mono text-emerald-400">
                ACTIVE ZONES
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-[rgba(245,244,238,0.06)] flex items-center justify-between font-mono text-[11px]">
            <div>
              <span className="text-[9px] text-[rgba(245,244,238,0.4)] block uppercase">MIN FEE</span>
              <span className="font-bold text-[var(--m-cream)]">
                {delivery.lowestFeeMinor ? formatEgpPrice(delivery.lowestFeeMinor, delivery.currency) : "—"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[rgba(245,244,238,0.4)] block uppercase">MAX FEE</span>
              <span className="font-bold text-[var(--m-cream)]">
                {delivery.highestFeeMinor ? formatEgpPrice(delivery.highestFeeMinor, delivery.currency) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* SIZE GUIDES OVERVIEW */}
        <div className="p-5 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
              SIZE GUIDES
            </span>
            <Link
              href="/admin/size-guides"
              className="text-[10px] font-mono text-[var(--m-gold)] hover:underline uppercase tracking-wider"
            >
              MANAGE →
            </Link>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--m-cream)]">
                {sizeGuides.totalGuides}
              </span>
              <span className="text-xs font-mono text-[rgba(245,244,238,0.4)]">
                ACTIVE GUIDES
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-[rgba(245,244,238,0.06)] flex items-center justify-between font-mono text-[11px]">
            <div>
              <span className="text-[9px] text-[rgba(245,244,238,0.4)] block uppercase">LINKED PRODUCTS</span>
              <span className="font-bold text-[var(--m-gold)]">{sizeGuides.productsWithGuide}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[rgba(245,244,238,0.4)] block uppercase">TOTAL CELLS</span>
              <span className="font-bold text-[var(--m-cream)]">{sizeGuides.totalCells}</span>
            </div>
          </div>
        </div>

        {/* OPERATIONAL QUICK ACTIONS */}
        <div className="p-5 rounded-2xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[rgba(245,244,238,0.45)]">
            QUICK ACTIONS
          </span>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/products"
              className="p-2.5 rounded-xl bg-[rgba(245,244,238,0.04)] hover:bg-[rgba(251,133,0,0.12)] border border-[rgba(245,244,238,0.1)] hover:border-[rgba(251,133,0,0.4)] text-[var(--m-cream)] hover:text-[var(--m-gold)] font-mono text-[10px] font-bold tracking-[0.14em] uppercase transition-all text-center flex items-center justify-center"
            >
              PRODUCTS
            </Link>
            <Link
              href="/admin/size-guides"
              className="p-2.5 rounded-xl bg-[rgba(245,244,238,0.04)] hover:bg-[rgba(251,133,0,0.12)] border border-[rgba(245,244,238,0.1)] hover:border-[rgba(251,133,0,0.4)] text-[var(--m-cream)] hover:text-[var(--m-gold)] font-mono text-[10px] font-bold tracking-[0.14em] uppercase transition-all text-center flex items-center justify-center"
            >
              SIZE GUIDES
            </Link>
            <Link
              href="/admin/orders"
              className="p-2.5 rounded-xl bg-[rgba(245,244,238,0.04)] hover:bg-[rgba(251,133,0,0.12)] border border-[rgba(245,244,238,0.1)] hover:border-[rgba(251,133,0,0.4)] text-[var(--m-cream)] hover:text-[var(--m-gold)] font-mono text-[10px] font-bold tracking-[0.14em] uppercase transition-all text-center flex items-center justify-center"
            >
              ORDERS
            </Link>
            <Link
              href="/admin/delivery"
              className="p-2.5 rounded-xl bg-[rgba(245,244,238,0.04)] hover:bg-[rgba(251,133,0,0.12)] border border-[rgba(245,244,238,0.1)] hover:border-[rgba(251,133,0,0.4)] text-[var(--m-cream)] hover:text-[var(--m-gold)] font-mono text-[10px] font-bold tracking-[0.14em] uppercase transition-all text-center flex items-center justify-center"
            >
              DELIVERY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
