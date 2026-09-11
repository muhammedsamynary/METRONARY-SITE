import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSizeGuides } from "@/lib/admin/size-guides";
import { CreateSizeGuideModal } from "@/components/admin/CreateSizeGuideModal";

export const metadata: Metadata = {
  title: "Size Guides — METRONARY Admin",
};

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

export default async function AdminSizeGuidesPage() {
  const { guides, stats } = await getAdminSizeGuides();

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-[var(--m-cream)]">
              SIZE GUIDES
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              MANAGE GUIDES
            </span>
          </div>
          <p className="font-mono text-xs text-[rgba(245,244,238,0.5)] mt-1">
            Manage reusable product measurement guides.
          </p>
        </div>

        <CreateSizeGuideModal />
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Guides */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.45)]">
            TOTAL GUIDES
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-cream)]">
            {stats.totalGuides}
          </span>
        </div>

        {/* Total Products Assigned */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.45)]">
            PRODUCTS ASSIGNED
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-gold)]">
            {stats.totalProductsAssigned}
          </span>
        </div>

        {/* Total Size Rows */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.45)]">
            TOTAL ROWS
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-cream)]">
            {stats.totalRows}
          </span>
        </div>

        {/* Total Measurements */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.45)]">
            MEASUREMENTS
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-cream)]">
            {stats.totalMeasurements}
          </span>
        </div>
      </div>

      {/* Guides List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(245,244,238,0.06)]">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
            REGISTERED SIZE GUIDES ({guides.length})
          </h2>
          <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
            POSTGRESQL CATALOG
          </span>
        </div>

        {guides.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[rgba(22,22,20,0.4)] border border-[rgba(245,244,238,0.06)] flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-[rgba(245,244,238,0.5)]">
              No size guides registered in the database.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] hover:border-[rgba(245,244,238,0.18)] transition-all flex flex-col gap-5"
              >
                {/* Guide Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[rgba(245,244,238,0.06)]">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-[var(--m-cream)]">
                        {guide.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[rgba(255,255,255,0.06)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)] font-bold">
                        {guide.unit}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[rgba(245,244,238,0.4)]">
                      Identifier: {guide.id}
                    </p>
                  </div>

                  <Link
                    href={`/admin/size-guides/${guide.id}`}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] hover:bg-[var(--m-gold)] hover:text-black text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)] transition-colors self-start sm:self-auto flex items-center gap-1.5"
                  >
                    <span>MANAGE</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Guide Matrix Spec & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                      Dimensions Matrix
                    </span>
                    <p className="font-semibold text-[var(--m-cream)] mt-0.5">
                      {guide.columnCount} Cols • {guide.rowCount} Size Rows ({guide.cellCount} Cells)
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                      Product Usage
                    </span>
                    <p className="font-semibold text-[var(--m-gold)] mt-0.5">
                      {guide.assignedProducts.length}{" "}
                      {guide.assignedProducts.length === 1 ? "Product" : "Products"} Assigned
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                      Last Updated
                    </span>
                    <p className="text-[rgba(245,244,238,0.6)] mt-0.5">
                      {formatDate(guide.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Notes if present */}
                {guide.notes && (
                  <div className="p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(245,244,238,0.04)] text-xs text-[rgba(245,244,238,0.7)] leading-relaxed">
                    <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)] block mb-1">
                      Guide Notes:
                    </span>
                    {guide.notes}
                  </div>
                )}

                {/* Assigned Products Section */}
                <div className="pt-4 border-t border-[rgba(245,244,238,0.06)] flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
                    USED BY ({guide.assignedProducts.length}):
                  </span>

                  {guide.assignedProducts.length === 0 ? (
                    <p className="text-xs font-mono text-[rgba(245,244,238,0.35)] italic">
                      No products currently linked to this guide.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {guide.assignedProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/admin/products/${p.id}`}
                          className="px-3 py-1 rounded-lg text-xs font-mono bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-[var(--m-cream)] hover:border-[var(--m-gold)] hover:text-[var(--m-gold)] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{p.name}</span>
                          <span className="text-[10px] text-[rgba(245,244,238,0.4)] font-normal">
                            ({p.category || "Catalog"})
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
