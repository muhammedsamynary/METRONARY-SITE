import type { Metadata } from "next";
import { getAdminOrders } from "@/lib/admin/orders";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export const metadata: Metadata = {
  title: "Orders — METRONARY Admin",
};

export default async function AdminOrdersPage() {
  const { orders, stats } = await getAdminOrders();

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-[var(--m-cream)]">
              ORDERS
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              LIVE DATA
            </span>
          </div>
          <p className="font-mono text-xs text-[rgba(245,244,238,0.5)] mt-1">
            Manage METRONARY customer orders.
          </p>
        </div>
      </div>

      {/* Real Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Orders */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.45)]">
            TOTAL
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-cream)]">
            {stats.total}
          </span>
        </div>

        {/* New Orders */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400/70">
            NEW
          </span>
          <span className="text-xl font-bold font-mono text-sky-300">
            {stats.newCount}
          </span>
        </div>

        {/* In Progress Orders */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/70">
            IN PROGRESS
          </span>
          <span className="text-xl font-bold font-mono text-amber-300">
            {stats.inProgressCount}
          </span>
        </div>

        {/* Delivered */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/70">
            DELIVERED
          </span>
          <span className="text-xl font-bold font-mono text-emerald-300">
            {stats.deliveredCount}
          </span>
        </div>

        {/* Cancelled */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-red-400/70">
            CANCELLED
          </span>
          <span className="text-xl font-bold font-mono text-red-300">
            {stats.cancelledCount}
          </span>
        </div>

        {/* Unpaid */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--m-gold)]/70">
            UNPAID
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-gold)]">
            {stats.unpaidCount}
          </span>
        </div>
      </div>

      {/* Orders List Table Component */}
      <AdminOrdersTable orders={orders} />
    </div>
  );
}
