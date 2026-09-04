import type { Metadata } from "next";
import { getAdminProducts } from "@/lib/admin/products";
import { AdminProductTable } from "@/components/admin/AdminProductTable";

export const metadata: Metadata = {
  title: "Products — METRONARY Admin",
};

export default async function AdminProductsPage() {
  const { products, stats } = await getAdminProducts();

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(245,244,238,0.08)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[var(--m-gold)] uppercase mb-1">
            <span>CATALOG MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.16em] uppercase text-[var(--m-cream)]">
            PRODUCTS
          </h1>
          <p className="text-xs sm:text-sm text-[rgba(245,244,238,0.5)] mt-1">
            Manage the METRONARY product catalog, pricing, and variant availability.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* TOTAL PRODUCTS */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[rgba(245,244,238,0.45)]">
            TOTAL PRODUCTS
          </span>
          <span className="text-2xl font-bold font-mono text-[var(--m-cream)] mt-2">
            {stats.total}
          </span>
        </div>

        {/* ACTIVE */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[rgba(245,244,238,0.45)]">
            ACTIVE
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            {stats.active}
          </span>
        </div>

        {/* INACTIVE */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[rgba(245,244,238,0.45)]">
            INACTIVE
          </span>
          <span className="text-2xl font-bold font-mono text-neutral-400 mt-2">
            {stats.inactive}
          </span>
        </div>

        {/* PRICED */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[rgba(245,244,238,0.45)]">
            PRICED
          </span>
          <span className="text-2xl font-bold font-mono text-[var(--m-gold)] mt-2">
            {stats.priced}
          </span>
        </div>

        {/* UNPRICED */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[rgba(245,244,238,0.45)]">
            UNPRICED (NOT SET)
          </span>
          <span className="text-2xl font-bold font-mono text-amber-300/80 mt-2">
            {stats.unpriced}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <AdminProductTable initialProducts={products} />
    </div>
  );
}
