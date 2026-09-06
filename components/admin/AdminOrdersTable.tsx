"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { AdminOrderListItem } from "@/lib/admin/orders";

interface AdminOrdersTableProps {
  orders: AdminOrderListItem[];
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
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-950/50 text-sky-300 border border-sky-500/40 font-bold">
          NEW
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950/50 text-blue-300 border border-blue-500/40 font-bold">
          CONFIRMED
        </span>
      );
    case "PACKING":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/50 text-amber-300 border border-amber-500/40 font-bold">
          PACKING
        </span>
      );
    case "SHIPPED":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-950/50 text-purple-300 border border-purple-500/40 font-bold">
          SHIPPED
        </span>
      );
    case "DELIVERED":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold">
          DELIVERED
        </span>
      );
    case "CANCELLED":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-950/50 text-red-300 border border-red-500/40 font-bold">
          CANCELLED
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-gray-800 text-gray-300 border border-gray-600 font-bold">
          {status}
        </span>
      );
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
          PAID
        </span>
      );
    case "UNPAID":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/40 text-amber-300 border border-amber-500/30">
          UNPAID
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-gray-800 text-gray-300 border border-gray-600">
          {status}
        </span>
      );
  }
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPayment, setSelectedPayment] = useState<string>("ALL");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (selectedStatus !== "ALL" && order.orderStatus !== selectedStatus) {
        return false;
      }

      // 2. Payment Filter
      if (selectedPayment !== "ALL" && order.paymentStatus !== selectedPayment) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesName = order.customerName.toLowerCase().includes(query);
        const matchesPhone = order.phone.toLowerCase().includes(query);
        const matchesArea = order.cityOrArea.toLowerCase().includes(query);

        if (!matchesNumber && !matchesName && !matchesPhone && !matchesArea) {
          return false;
        }
      }

      return true;
    });
  }, [orders, selectedStatus, selectedPayment, searchQuery]);

  // Zero-orders initial state
  if (orders.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(245,244,238,0.1)] flex items-center justify-center text-[var(--m-gold)] font-mono text-lg">
          📦
        </div>
        <h3 className="text-base font-mono font-bold tracking-wider uppercase text-[var(--m-cream)]">
          NO ORDERS YET
        </h3>
        <p className="text-xs font-mono text-[rgba(245,244,238,0.5)] max-w-md">
          Orders will appear here after customers successfully place an order on the storefront.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order # (MET-...), customer name, phone, area..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)] transition-colors placeholder:text-[rgba(245,244,238,0.3)]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[rgba(245,244,238,0.4)] font-mono">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-[10px] font-mono text-[rgba(245,244,238,0.4)] hover:text-[var(--m-cream)]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Order Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-[rgba(245,244,238,0.4)]">
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)] uppercase"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="NEW">NEW</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PACKING">PACKING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Payment Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-[rgba(245,244,238,0.4)]">
              Payment:
            </span>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="px-2.5 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)] uppercase"
            >
              <option value="ALL">ALL PAYMENTS</option>
              <option value="UNPAID">UNPAID</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          {(selectedStatus !== "ALL" || selectedPayment !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedStatus("ALL");
                setSelectedPayment("ALL");
                setSearchQuery("");
              }}
              className="px-3 py-2 rounded-lg text-xs font-mono uppercase text-[var(--m-gold)] hover:bg-[rgba(251,133,0,0.1)] transition-colors border border-[rgba(251,133,0,0.3)]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Table Container */}
      {filteredOrders.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col items-center justify-center gap-2">
          <p className="text-xs font-mono font-bold uppercase text-[rgba(245,244,238,0.6)]">
            NO ORDERS MATCH YOUR FILTER
          </p>
          <button
            onClick={() => {
              setSelectedStatus("ALL");
              setSelectedPayment("ALL");
              setSearchQuery("");
            }}
            className="text-[11px] font-mono text-[var(--m-gold)] hover:underline uppercase"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[rgba(245,244,238,0.08)] bg-[rgba(22,22,20,0.7)]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[rgba(245,244,238,0.08)] bg-[rgba(0,0,0,0.5)] text-[10px] tracking-wider uppercase text-[rgba(245,244,238,0.45)]">
                <th className="py-3.5 px-4 text-left font-bold text-[var(--m-gold)]">ORDER #</th>
                <th className="py-3.5 px-4 text-left font-bold">CUSTOMER</th>
                <th className="py-3.5 px-4 text-left font-bold">AREA</th>
                <th className="py-3.5 px-4 text-center font-bold">ITEMS</th>
                <th className="py-3.5 px-4 text-right font-bold">TOTAL</th>
                <th className="py-3.5 px-4 text-center font-bold">STATUS</th>
                <th className="py-3.5 px-4 text-center font-bold">PAYMENT</th>
                <th className="py-3.5 px-4 text-left font-bold">CREATED</th>
                <th className="py-3.5 px-4 text-right font-bold">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(245,244,238,0.04)]">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                >
                  {/* Order Number */}
                  <td className="py-3.5 px-4 font-bold text-[var(--m-cream)]">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-[var(--m-gold)] transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>

                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--m-cream)]">
                        {order.customerName}
                      </span>
                      <span className="text-[10px] text-[rgba(245,244,238,0.5)]">
                        {order.phone}
                      </span>
                      {order.email && (
                        <span className="text-[9px] text-[rgba(245,244,238,0.35)] truncate max-w-[150px]">
                          {order.email}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Area */}
                  <td className="py-3.5 px-4 text-[rgba(245,244,238,0.7)] text-xs">
                    {order.cityOrArea}
                  </td>

                  {/* Items Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[var(--m-cream)] font-bold text-[11px] border border-[rgba(245,244,238,0.06)]">
                      {order.itemCount}
                    </span>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-4 text-right font-bold text-[var(--m-gold)]">
                    {formatEgpPrice(order.totalMinor, order.currency)}
                  </td>

                  {/* Order Status */}
                  <td className="py-3.5 px-4 text-center">
                    {getOrderStatusBadge(order.orderStatus)}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      {getPaymentStatusBadge(order.paymentStatus)}
                      <span className="text-[8px] text-[rgba(245,244,238,0.35)] uppercase tracking-tight">
                        COD
                      </span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-4 text-[11px] text-[rgba(245,244,238,0.5)] whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3 py-1.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(245,244,238,0.1)] text-[10px] uppercase font-bold tracking-wider text-[rgba(245,244,238,0.7)] group-hover:border-[var(--m-gold)] group-hover:text-[var(--m-gold)] transition-colors inline-block"
                    >
                      VIEW →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
