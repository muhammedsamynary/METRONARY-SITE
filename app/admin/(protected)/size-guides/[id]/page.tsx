import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSizeGuideById } from "@/lib/admin/size-guides";

interface SizeGuideDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SizeGuideDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const guide = await getAdminSizeGuideById(id);
  if (!guide) return { title: "Size Guide Not Found — METRONARY Admin" };

  return {
    title: `${guide.name} — METRONARY Admin`,
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

export default async function AdminSizeGuideDetailPage({
  params,
}: SizeGuideDetailPageProps) {
  const { id } = await params;
  const guide = await getAdminSizeGuideById(id);

  if (!guide) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Top Bar / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/size-guides"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[rgba(245,244,238,0.6)] hover:text-[var(--m-gold)] transition-colors"
          >
            ← Back to Size Guides
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase bg-amber-950/30 text-amber-300 border border-amber-500/30">
            READ-ONLY MODE (PHASE 12F.1)
          </span>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase text-[var(--m-cream)]">
              {guide.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-[rgba(255,255,255,0.06)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)] font-bold">
              UNIT: {guide.unit}
            </span>
          </div>
          <p className="font-mono text-xs text-[rgba(245,244,238,0.5)]">
            Identifier: {guide.id} • {guide.stats.columnCount} Columns • {guide.stats.rowCount} Rows • {guide.stats.cellCount} Measurements
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / MAIN COLUMN: Dynamic Measurement Matrix */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Matrix Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                MEASUREMENT MATRIX ({guide.unit})
              </h2>
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
                ORDERED NORMALIZED MATRIX
              </span>
            </div>

            {guide.columns.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.25)] rounded-lg">
                NO MEASUREMENT COLUMNS CONFIGURED
              </div>
            ) : guide.rows.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.25)] rounded-lg">
                NO SIZE ROWS CONFIGURED
              </div>
            ) : (
              <div className="overflow-x-auto border border-[rgba(245,244,238,0.08)] rounded-lg bg-[rgba(0,0,0,0.3)]">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(245,244,238,0.08)] bg-[rgba(0,0,0,0.5)] text-[10px] tracking-wider uppercase text-[rgba(245,244,238,0.45)]">
                      <th className="py-3 px-4 text-left font-bold text-[var(--m-gold)]">
                        SIZE
                      </th>
                      {guide.columns.map((col) => (
                        <th key={col.id} className="py-3 px-4 text-center font-bold">
                          {col.label} <span className="text-[9px] text-[rgba(245,244,238,0.3)] font-normal">({guide.unit})</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(245,244,238,0.04)]">
                    {guide.rows.map((row) => (
                      <tr key={row.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[var(--m-cream)] text-left">
                          {row.label}
                        </td>
                        {guide.columns.map((col) => {
                          const cellValue = row.cells[col.id];
                          const hasValue =
                            cellValue !== undefined &&
                            cellValue !== null &&
                            cellValue.trim() !== "";

                          return (
                            <td key={col.id} className="py-3.5 px-4 text-center">
                              {hasValue ? (
                                <span className="text-amber-200 font-semibold">
                                  {cellValue}
                                </span>
                              ) : (
                                <span className="text-[rgba(245,244,238,0.25)]">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Notes if present */}
            {guide.notes && (
              <div className="mt-2 p-4 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(245,244,238,0.04)] flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
                  Tailoring & Fit Guidelines:
                </span>
                <p className="text-xs font-mono text-[rgba(245,244,238,0.7)] leading-relaxed">
                  {guide.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT / SIDEBAR COLUMN: Product Assignment & Specs */}
        <div className="flex flex-col gap-6">
          {/* Assigned Products Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              ASSIGNED PRODUCTS ({guide.assignedProducts.length})
            </h2>

            {guide.assignedProducts.length === 0 ? (
              <p className="text-xs font-mono text-[rgba(245,244,238,0.4)] italic">
                No products currently reference this size guide.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {guide.assignedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}`}
                    className="p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(245,244,238,0.06)] hover:border-[var(--m-gold)] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-[var(--m-cream)] group-hover:text-[var(--m-gold)] transition-colors font-medium">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)]">
                        /{p.slug} • {p.category || "Catalog"}
                      </span>
                    </div>

                    <span className="text-xs text-[rgba(245,244,238,0.4)] group-hover:text-[var(--m-gold)] transition-colors">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <p className="text-[10px] font-mono text-[rgba(245,244,238,0.35)] leading-normal pt-2 border-t border-[rgba(245,244,238,0.04)]">
              To attach or detach products from this guide, use the Size Guide selector in each Product Editor.
            </p>
          </div>

          {/* Guide Metadata Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-3">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              SPECIFICATIONS
            </h2>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Matrix Columns
                </span>
                <span className="text-[var(--m-cream)] font-semibold">
                  {guide.stats.columnCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Size Rows
                </span>
                <span className="text-[var(--m-cream)] font-semibold">
                  {guide.stats.rowCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Total Measurements
                </span>
                <span className="text-[var(--m-cream)] font-semibold">
                  {guide.stats.cellCount}
                </span>
              </div>

              <div className="pt-2 border-t border-[rgba(245,244,238,0.04)] font-mono text-[10px] text-[rgba(245,244,238,0.4)] space-y-1">
                <p>Created: {formatDate(guide.createdAt)}</p>
                <p>Last Updated: {formatDate(guide.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
