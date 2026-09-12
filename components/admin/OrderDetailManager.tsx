"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { AdminOrderDetailResult } from "@/lib/admin/orders";
import type { OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import {
  updateOrderStatusAction,
  updateOrderPaymentStatusAction,
  type OrderActionState,
} from "@/app/admin/(protected)/orders/[id]/actions";

interface OrderDetailManagerProps {
  order: AdminOrderDetailResult;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function formatEgpPrice(minor: number | null | undefined, currency = "EGP"): string {
  if (minor === null || minor === undefined || Number.isNaN(minor)) {
    return "—";
  }
  const major = minor / 100;
  return `${major.toLocaleString("en-US", {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function getOrderStatusBadge(status: string) {
  switch (status) {
    case "NEW":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-sky-950/50 text-sky-300 border border-sky-500/40 font-bold">
          NEW ORDER
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-blue-950/50 text-blue-300 border border-blue-500/40 font-bold">
          CONFIRMED
        </span>
      );
    case "PACKING":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-amber-950/50 text-amber-300 border border-amber-500/40 font-bold">
          PACKING
        </span>
      );
    case "SHIPPED":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-purple-950/50 text-purple-300 border border-purple-500/40 font-bold">
          SHIPPED
        </span>
      );
    case "DELIVERED":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold">
          DELIVERED
        </span>
      );
    case "CANCELLED":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-red-950/50 text-red-300 border border-red-500/40 font-bold">
          CANCELLED
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-gray-800 text-gray-300 border border-gray-600 font-bold">
          {status}
        </span>
      );
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-semibold">
          PAID
        </span>
      );
    case "UNPAID":
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-amber-950/40 text-amber-300 border border-amber-500/30 font-semibold">
          UNPAID
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded text-xs font-mono uppercase bg-gray-800 text-gray-300 border border-gray-600">
          {status}
        </span>
      );
  }
}

type ConfirmModalConfig = {
  type: "STATUS" | "PAYMENT";
  targetStatus?: OrderStatus;
  targetPaymentStatus?: PaymentStatus;
  title: string;
  description: string;
  confirmLabel: string;
  isDestructive?: boolean;
} | null;

export function OrderDetailManager({ order }: OrderDetailManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<OrderActionState | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig>(null);

  const handleExecuteStatusChange = (nextStatus: OrderStatus) => {
    setFeedback(null);
    setConfirmModal(null);

    startTransition(async () => {
      const res = await updateOrderStatusAction(order.id, nextStatus, order.orderStatus);
      setFeedback(res);
    });
  };

  const handleExecutePaymentChange = (nextPaymentStatus: PaymentStatus) => {
    setFeedback(null);
    setConfirmModal(null);

    startTransition(async () => {
      const res = await updateOrderPaymentStatusAction(
        order.id,
        nextPaymentStatus,
        order.paymentStatus
      );
      setFeedback(res);
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-20">
      {/* Top Bar / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[rgba(245,244,238,0.6)] hover:text-[var(--m-gold)] transition-colors"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase bg-emerald-950/30 text-emerald-300 border border-emerald-500/30">
            ORDER MANAGER (PHASE 12G.2)
          </span>
        </div>
      </div>

      {/* Action Feedback Alerts */}
      {feedback?.success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              {feedback.message || "ORDER UPDATED SUCCESSFULLY"}
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase text-emerald-500/80">UPDATED</span>
        </div>
      )}

      {feedback && !feedback.success && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-red-400 mt-1 shadow-[0_0_8px_rgba(248,113,113,0.8)] shrink-0" />
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
            {feedback.error || "Unable to update order. Please try again."}
          </p>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase text-[var(--m-cream)]">
              {order.orderNumber}
            </h1>
            <div className="flex items-center gap-2">
              {getOrderStatusBadge(order.orderStatus)}
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
          </div>
          <p className="font-mono text-xs text-[rgba(245,244,238,0.5)]">
            Placed on {formatDate(order.createdAt)} • Total Items: {order.itemCount} • Internal ID:{" "}
            <span className="text-[rgba(245,244,238,0.35)]">{order.id}</span>
          </p>
        </div>

        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
            TOTAL DUE (COD)
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--m-gold)]">
            {formatEgpPrice(order.totalMinor, order.currency)}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Lifecycle Manager + Payment Manager + Items + Financials */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Order Lifecycle Management Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.1)] flex flex-col gap-6 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                ORDER LIFECYCLE MANAGEMENT
              </h2>
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
                CURRENT STATUS: {order.orderStatus}
              </span>
            </div>

            {/* Lifecycle Progress Bar */}
            <div className="flex items-center justify-between font-mono text-[10px] uppercase gap-1 overflow-x-auto pb-2">
              {(["NEW", "CONFIRMED", "PACKING", "SHIPPED", "DELIVERED"] as OrderStatus[]).map(
                (step, idx) => {
                  const isCurrent = order.orderStatus === step;
                  const isPassed =
                    order.orderStatus !== "CANCELLED" &&
                    ["NEW", "CONFIRMED", "PACKING", "SHIPPED", "DELIVERED"].indexOf(order.orderStatus) >=
                      idx;

                  return (
                    <div key={step} className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded ${
                          isCurrent
                            ? "bg-[var(--m-gold)] text-black font-bold shadow-[0_0_10px_rgba(251,133,0,0.3)]"
                            : isPassed
                            ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                            : "bg-[rgba(255,255,255,0.04)] text-[rgba(245,244,238,0.3)]"
                        }`}
                      >
                        {step}
                      </span>
                      {idx < 4 && <span className="text-[rgba(245,244,238,0.2)]">→</span>}
                    </div>
                  );
                }
              )}
            </div>

            {/* Contextual Action Controls */}
            <div className="flex flex-col gap-3 pt-2">
              {order.orderStatus === "NEW" && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "STATUS",
                        targetStatus: "CONFIRMED",
                        title: "Confirm Customer Order",
                        description: `Are you sure you want to transition order ${order.orderNumber} to CONFIRMED?`,
                        confirmLabel: "CONFIRM ORDER",
                      })
                    }
                    className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 transition-all shadow-[0_0_12px_rgba(251,133,0,0.25)]"
                  >
                    {isPending ? "UPDATING..." : "CONFIRM ORDER"}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "STATUS",
                        targetStatus: "CANCELLED",
                        title: "Cancel Customer Order",
                        description: `Are you sure you want to cancel order ${order.orderNumber}? This action will permanently move the order to terminal CANCELLED state.`,
                        confirmLabel: "CANCEL ORDER",
                        isDestructive: true,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase bg-red-950/30 text-red-400 border border-red-500/30 hover:bg-red-900/40 hover:text-red-300 transition-colors"
                  >
                    CANCEL ORDER
                  </button>
                </div>
              )}

              {order.orderStatus === "CONFIRMED" && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "STATUS",
                        targetStatus: "PACKING",
                        title: "Start Packing Order",
                        description: `Transition order ${order.orderNumber} to PACKING? This signals that warehouse fulfillment is in progress.`,
                        confirmLabel: "START PACKING",
                      })
                    }
                    className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 transition-all"
                  >
                    {isPending ? "UPDATING..." : "START PACKING"}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "STATUS",
                        targetStatus: "CANCELLED",
                        title: "Cancel Customer Order",
                        description: `Are you sure you want to cancel order ${order.orderNumber}?`,
                        confirmLabel: "CANCEL ORDER",
                        isDestructive: true,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase bg-red-950/30 text-red-400 border border-red-500/30 hover:bg-red-900/40 hover:text-red-300 transition-colors"
                  >
                    CANCEL ORDER
                  </button>
                </div>
              )}

              {order.orderStatus === "PACKING" && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "STATUS",
                        targetStatus: "SHIPPED",
                        title: "Dispatch / Ship Order",
                        description: `Mark order ${order.orderNumber} as SHIPPED? This confirms the parcel has been handed over to the courier. (Cancellation is locked once shipped).`,
                        confirmLabel: "MARK AS SHIPPED",
                      })
                    }
                    className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-purple-500 text-white hover:bg-purple-400 active:scale-[0.99] disabled:opacity-50 transition-all shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                  >
                    {isPending ? "UPDATING..." : "MARK AS SHIPPED"}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "STATUS",
                        targetStatus: "CANCELLED",
                        title: "Cancel Customer Order",
                        description: `Are you sure you want to cancel order ${order.orderNumber}?`,
                        confirmLabel: "CANCEL ORDER",
                        isDestructive: true,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase bg-red-950/30 text-red-400 border border-red-500/30 hover:bg-red-900/40 hover:text-red-300 transition-colors"
                  >
                    CANCEL ORDER
                  </button>
                </div>
              )}

              {order.orderStatus === "SHIPPED" && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "STATUS",
                        targetStatus: "DELIVERED",
                        title: "Complete Order Delivery",
                        description: `Mark order ${order.orderNumber} as DELIVERED? This moves the order into terminal completed state and unlocks cash payment collection.`,
                        confirmLabel: "MARK AS DELIVERED",
                      })
                    }
                    className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 transition-all shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                  >
                    {isPending ? "UPDATING..." : "MARK AS DELIVERED"}
                  </button>
                </div>
              )}

              {order.orderStatus === "DELIVERED" && (
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
                  <p className="text-xs font-mono text-emerald-300">
                    Order lifecycle complete. This order is marked as <strong>DELIVERED</strong>.
                  </p>
                </div>
              )}

              {order.orderStatus === "CANCELLED" && (
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)] shrink-0" />
                  <p className="text-xs font-mono text-red-300">
                    This order is <strong>CANCELLED</strong>. No further lifecycle status changes can be performed.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* COD Payment Management Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.1)] flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                PAYMENT MANAGEMENT (COD)
              </h2>
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
                STATUS: {order.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(245,244,238,0.06)] flex flex-col gap-1">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Payment Method
                </span>
                <span className="font-semibold text-[var(--m-cream)]">CASH ON DELIVERY (COD)</span>
              </div>

              <div className="p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(245,244,238,0.06)] flex flex-col gap-1">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Payment Status
                </span>
                <div className="flex items-center gap-2">
                  {getPaymentStatusBadge(order.paymentStatus)}
                  <span className="text-[11px] text-[var(--m-gold)] font-bold">
                    {formatEgpPrice(order.totalMinor, order.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Action Controls */}
            <div className="pt-2">
              {order.orderStatus === "CANCELLED" ? (
                <p className="text-xs font-mono text-[rgba(245,244,238,0.4)] italic">
                  Cancelled orders cannot be marked as PAID.
                </p>
              ) : order.paymentStatus === "UNPAID" ? (
                order.orderStatus === "DELIVERED" ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "PAYMENT",
                        targetPaymentStatus: "PAID",
                        title: "Confirm Cash on Delivery Collection",
                        description: `Confirm that ${formatEgpPrice(
                          order.totalMinor,
                          order.currency
                        )} in cash has been successfully collected for order ${order.orderNumber}?`,
                        confirmLabel: "MARK COD AS PAID",
                      })
                    }
                    className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 transition-all shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                  >
                    {isPending ? "UPDATING..." : "MARK COD AS PAID"}
                  </button>
                ) : (
                  <p className="text-xs font-mono text-amber-200/80 bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
                    ℹ️ PAYMENT CAN BE MARKED PAID AFTER DELIVERY (COD rules).
                  </p>
                )
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono text-emerald-300 font-semibold uppercase">
                      Payment Collected in Full ({formatEgpPrice(order.totalMinor, order.currency)})
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setConfirmModal({
                        type: "PAYMENT",
                        targetPaymentStatus: "UNPAID",
                        title: "Correct Payment Status to UNPAID",
                        description: `Are you sure you want to revert the payment status of order ${order.orderNumber} back to UNPAID? Use this only to correct accidental payment marking.`,
                        confirmLabel: "CORRECT TO UNPAID",
                        isDestructive: true,
                      })
                    }
                    className="px-3 py-1 rounded text-[10px] font-mono uppercase text-[rgba(245,244,238,0.5)] hover:text-amber-300 border border-[rgba(245,244,238,0.1)] hover:border-amber-500/40 transition-colors"
                  >
                    CORRECT TO UNPAID
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Items Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                ORDER ITEMS ({order.items.length})
              </h2>
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
                HISTORICAL SNAPSHOT
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[rgba(245,244,238,0.08)] bg-[rgba(0,0,0,0.3)]">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[rgba(245,244,238,0.08)] bg-[rgba(0,0,0,0.5)] text-[10px] tracking-wider uppercase text-[rgba(245,244,238,0.45)]">
                    <th className="py-3 px-4 text-left font-bold text-[var(--m-gold)]">
                      ITEM / PRODUCT
                    </th>
                    <th className="py-3 px-3 text-center font-bold">COLOR</th>
                    <th className="py-3 px-3 text-center font-bold">SIZE</th>
                    <th className="py-3 px-3 text-center font-bold">QTY</th>
                    <th className="py-3 px-4 text-right font-bold">UNIT PRICE</th>
                    <th className="py-3 px-4 text-right font-bold">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(245,244,238,0.04)]">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[var(--m-cream)]">
                        <div className="flex flex-col">
                          <span>{item.productName}</span>
                          <Link
                            href={`/product/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[rgba(245,244,238,0.4)] hover:text-[var(--m-gold)] transition-colors flex items-center gap-1 mt-0.5"
                          >
                            /{item.slug} ↗
                          </Link>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {item.color ? (
                          <span className="px-2 py-0.5 rounded bg-[rgba(251,133,0,0.1)] text-[var(--m-gold)] font-bold text-[11px] border border-[rgba(251,133,0,0.25)]">
                            {item.color}
                          </span>
                        ) : (
                          <span className="text-[rgba(245,244,238,0.3)]">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {item.size ? (
                          <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--m-cream)] font-bold text-[11px] border border-[rgba(245,244,238,0.1)]">
                            {item.size}
                          </span>
                        ) : (
                          <span className="text-[rgba(245,244,238,0.3)]">ONE SIZE</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold text-[var(--m-cream)]">
                        {item.quantity}
                      </td>

                      <td className="py-3.5 px-4 text-right text-[rgba(245,244,238,0.7)]">
                        {formatEgpPrice(item.unitPriceMinor, item.currency)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-[var(--m-cream)]">
                        {formatEgpPrice(item.lineTotalMinor, item.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              FINANCIAL BREAKDOWN
            </h2>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-[rgba(245,244,238,0.6)] uppercase">Subtotal</span>
                <span className="text-[var(--m-cream)] font-semibold">
                  {formatEgpPrice(order.subtotalMinor, order.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[rgba(245,244,238,0.6)] uppercase">Delivery Fee</span>
                <span className="text-[var(--m-cream)] font-semibold">
                  {order.deliveryFeeMinor > 0
                    ? formatEgpPrice(order.deliveryFeeMinor, order.currency)
                    : "FREE (0 EGP)"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[rgba(245,244,238,0.08)] text-sm">
                <span className="font-bold text-[var(--m-cream)] uppercase">Total Amount Due</span>
                <span className="font-bold text-lg text-[var(--m-gold)]">
                  {formatEgpPrice(order.totalMinor, order.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Details + Delivery Info */}
        <div className="flex flex-col gap-6">
          {/* Customer Details Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              CUSTOMER DETAILS
            </h2>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Full Name
                </span>
                <span className="text-sm font-bold text-[var(--m-cream)]">
                  {order.customerName}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Phone Number
                </span>
                <a
                  href={`tel:${order.phone}`}
                  className="text-xs font-semibold text-[var(--m-gold)] hover:underline"
                >
                  {order.phone}
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Email Address
                </span>
                {order.email ? (
                  <a
                    href={`mailto:${order.email}`}
                    className="text-xs text-[rgba(245,244,238,0.8)] hover:text-[var(--m-gold)] transition-colors truncate"
                  >
                    {order.email}
                  </a>
                ) : (
                  <span className="text-xs text-[rgba(245,244,238,0.35)] italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Information Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              DELIVERY DESTINATION
            </h2>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  City / Area
                </span>
                <span className="text-xs font-semibold text-[var(--m-cream)]">
                  {order.cityOrArea}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Exact Shipping Address
                </span>
                <p className="text-xs text-[rgba(245,244,238,0.8)] leading-relaxed bg-[rgba(0,0,0,0.3)] p-3 rounded-lg border border-[rgba(245,244,238,0.04)]">
                  {order.address}
                </p>
              </div>

              {order.notes && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                    Delivery Notes / Instructions
                  </span>
                  <p className="text-xs text-amber-200/90 leading-relaxed bg-[rgba(251,133,0,0.05)] p-3 rounded-lg border border-[rgba(251,133,0,0.15)]">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[rgba(24,24,20,0.98)] border border-[rgba(245,244,238,0.15)] shadow-2xl flex flex-col gap-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    confirmModal.isDestructive ? "bg-red-400" : "bg-[var(--m-gold)]"
                  }`}
                />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--m-cream)]">
                  {confirmModal.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="text-xs font-mono text-[rgba(245,244,238,0.4)] hover:text-[var(--m-cream)]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-mono text-[rgba(245,244,238,0.7)] leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirmModal.type === "STATUS" && confirmModal.targetStatus) {
                    handleExecuteStatusChange(confirmModal.targetStatus);
                  } else if (
                    confirmModal.type === "PAYMENT" &&
                    confirmModal.targetPaymentStatus
                  ) {
                    handleExecutePaymentChange(confirmModal.targetPaymentStatus);
                  }
                }}
                className={`px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  confirmModal.isDestructive
                    ? "bg-red-600 text-white hover:bg-red-500"
                    : "bg-[var(--m-gold)] text-black hover:bg-amber-400"
                } disabled:opacity-50`}
              >
                {isPending ? "PROCESSING..." : confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
