import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrderById, formatEgpPrice } from "@/lib/admin/orders";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) return { title: "Order Not Found — METRONARY Admin" };

  return {
    title: `Order ${order.orderNumber} — METRONARY Admin`,
  };
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

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
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
          <span className="px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase bg-amber-950/30 text-amber-300 border border-amber-500/30">
            READ-ONLY (PHASE 12G.1)
          </span>
        </div>
      </div>

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
            Placed on {formatDate(order.createdAt)} • Total Items: {order.itemCount} • Internal Ref:{" "}
            <span className="text-[rgba(245,244,238,0.35)]">{order.id}</span>
          </p>
        </div>

        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
            TOTAL AMOUNT (COD)
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--m-gold)]">
            {formatEgpPrice(order.totalMinor, order.currency)}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Items + Financial Summary */}
        <div className="lg:col-span-2 flex flex-col gap-6">
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
                    <th className="py-3 px-4 text-left font-bold text-[var(--m-gold)]">ITEM / PRODUCT</th>
                    <th className="py-3 px-3 text-center font-bold">SIZE</th>
                    <th className="py-3 px-3 text-center font-bold">QTY</th>
                    <th className="py-3 px-4 text-right font-bold">UNIT PRICE</th>
                    <th className="py-3 px-4 text-right font-bold">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(245,244,238,0.04)]">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      {/* Product Name snapshot + Link */}
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

                      {/* Size snapshot */}
                      <td className="py-3.5 px-3 text-center">
                        {item.size ? (
                          <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--m-cream)] font-bold text-[11px] border border-[rgba(245,244,238,0.1)]">
                            {item.size}
                          </span>
                        ) : (
                          <span className="text-[rgba(245,244,238,0.3)]">ONE SIZE</span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-3 text-center font-bold text-[var(--m-cream)]">
                        {item.quantity}
                      </td>

                      {/* Unit Price snapshot */}
                      <td className="py-3.5 px-4 text-right text-[rgba(245,244,238,0.7)]">
                        {formatEgpPrice(item.unitPriceMinor, item.currency)}
                      </td>

                      {/* Line Total */}
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

            <div className="mt-2 p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(245,244,238,0.06)] flex items-center justify-between font-mono text-xs">
              <span className="text-[rgba(245,244,238,0.5)] uppercase">Payment Method:</span>
              <span className="text-[var(--m-cream)] font-semibold uppercase">
                CASH ON DELIVERY (COD)
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Details + Delivery Info + Notice */}
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
                  <span className="text-xs text-[rgba(245,244,238,0.35)] italic">
                    Not provided
                  </span>
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

          {/* Read-Only Notice / Management Workflow Info */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-2 font-mono">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[rgba(245,244,238,0.5)]">
              MANAGEMENT WORKFLOW
            </h3>
            <p className="text-[11px] text-[rgba(245,244,238,0.4)] leading-relaxed">
              Order status mutations (Confirm, Pack, Ship, Deliver, Cancel) and Payment collection updates will be enabled in Phase 12G.2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
