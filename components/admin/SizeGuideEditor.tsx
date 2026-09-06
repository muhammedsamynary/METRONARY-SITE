"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  updateSizeGuideAction,
  createSizeGuideRowAction,
  createSizeGuideColumnAction,
  type SizeGuideActionState,
} from "@/app/admin/(protected)/size-guides/[id]/actions";
import type { AdminSizeGuideDetailResult } from "@/lib/admin/size-guides";

interface SizeGuideEditorProps {
  guide: AdminSizeGuideDetailResult;
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

export function SizeGuideEditor({ guide }: SizeGuideEditorProps) {
  // Main form action for full matrix & metadata update
  const updateActionWithId = updateSizeGuideAction.bind(null, guide.id);
  const [updateState, updateFormAction, isUpdatePending] = useActionState<
    SizeGuideActionState,
    FormData
  >(updateActionWithId, { success: false });

  // Add Size Row subform
  const addRowActionWithId = createSizeGuideRowAction.bind(null, guide.id);
  const [addRowState, addRowFormAction, isAddRowPending] = useActionState<
    SizeGuideActionState,
    FormData
  >(addRowActionWithId, { success: false });

  // Add Column subform
  const addColActionWithId = createSizeGuideColumnAction.bind(null, guide.id);
  const [addColState, addColFormAction, isAddColPending] = useActionState<
    SizeGuideActionState,
    FormData
  >(addColActionWithId, { success: false });

  // Local state for toggling Add Size / Add Column drawers
  const [showAddRowDrawer, setShowAddRowDrawer] = useState(false);
  const [showAddColDrawer, setShowAddColDrawer] = useState(false);

  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-24">
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

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase bg-emerald-950/30 text-emerald-300 border border-emerald-500/30">
            DYNAMIC EDITOR
          </span>
          <button
            type="submit"
            form="size-guide-editor-form"
            disabled={isUpdatePending}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(251,133,0,0.25)]"
          >
            {isUpdatePending ? "SAVING..." : "SAVE GUIDE"}
          </button>
        </div>
      </div>

      {/* Main Form Notifications */}
      {updateState.success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              {updateState.message || "SIZE GUIDE UPDATED"}
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase text-emerald-500/80">
            SAVED
          </span>
        </div>
      )}

      {updateState.error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-red-400 mt-1 shadow-[0_0_8px_rgba(248,113,113,0.8)] shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
              {updateState.error}
            </p>
            {updateState.fieldErrors && Object.keys(updateState.fieldErrors).length > 0 && (
              <ul className="list-disc list-inside text-[11px] font-mono text-red-400/90 space-y-0.5 mt-1">
                {Object.entries(updateState.fieldErrors).map(([field, err]) => (
                  <li key={field}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Add Row Notification */}
      {addRowState.success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
            {addRowState.message || "Size row created successfully."}
          </p>
        </div>
      )}
      {addRowState.error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex flex-col gap-1">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
            {addRowState.error}
          </p>
          {addRowState.fieldErrors?.label && (
            <p className="text-[11px] font-mono text-red-400">
              {addRowState.fieldErrors.label}
            </p>
          )}
        </div>
      )}

      {/* Add Column Notification */}
      {addColState.success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
            {addColState.message || "Measurement column created successfully."}
          </p>
        </div>
      )}
      {addColState.error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex flex-col gap-1">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
            {addColState.error}
          </p>
          {addColState.fieldErrors?.label && (
            <p className="text-[11px] font-mono text-red-400">
              {addColState.fieldErrors.label}
            </p>
          )}
        </div>
      )}

      {/* Main Form for Full Guide Updates */}
      <form id="size-guide-editor-form" action={updateFormAction} className="flex flex-col gap-8">
        {/* Guide Metadata Card */}
        <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.1)] flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              GUIDE METADATA & CONFIGURATION
            </h2>
            <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
              ID: {guide.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guide Name */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label htmlFor="guide-name" className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                Size Guide Name <span className="text-amber-500">*</span>
              </label>
              <input
                id="guide-name"
                name="name"
                type="text"
                required
                maxLength={100}
                defaultValue={guide.name}
                className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-sm font-mono text-[var(--m-cream)] uppercase transition-colors"
                placeholder="e.g. CARGO SHORTS SIZE GUIDE"
              />
              {updateState.fieldErrors?.name && (
                <p className="text-xs font-mono text-red-400">{updateState.fieldErrors.name}</p>
              )}
            </div>

            {/* Display Unit */}
            <div className="flex flex-col gap-2">
              <label htmlFor="guide-unit" className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                Unit (CM / IN) <span className="text-amber-500">*</span>
              </label>
              <input
                id="guide-unit"
                name="unit"
                type="text"
                required
                maxLength={20}
                defaultValue={guide.unit}
                className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-sm font-mono text-[var(--m-cream)] uppercase transition-colors"
                placeholder="e.g. CM or IN"
              />
              {updateState.fieldErrors?.unit && (
                <p className="text-xs font-mono text-red-400">{updateState.fieldErrors.unit}</p>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Matrix Editor + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Dynamic Editable Matrix */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-6">
              {/* Matrix Header + Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[rgba(245,244,238,0.06)]">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                    MEASUREMENT MATRIX ({guide.unit})
                  </h2>
                  <p className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
                    EDIT MEASUREMENTS, SIZES, AND MEASUREMENT COLUMNS
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddRowDrawer((v) => !v);
                      setShowAddColDrawer(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider bg-[rgba(255,255,255,0.06)] text-[var(--m-cream)] border border-[rgba(245,244,238,0.12)] hover:border-[var(--m-gold)] hover:text-[var(--m-gold)] transition-colors"
                  >
                    + ADD SIZE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddColDrawer((v) => !v);
                      setShowAddRowDrawer(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider bg-[rgba(255,255,255,0.06)] text-[var(--m-cream)] border border-[rgba(245,244,238,0.12)] hover:border-[var(--m-gold)] hover:text-[var(--m-gold)] transition-colors"
                  >
                    + ADD COLUMN
                  </button>
                </div>
              </div>

              {/* Editable Matrix Table */}
              {guide.columns.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.25)] rounded-lg">
                  NO MEASUREMENT COLUMNS CONFIGURED. CLICK &quot;+ ADD COLUMN&quot; TO CREATE ONE.
                </div>
              ) : guide.rows.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.25)] rounded-lg">
                  NO SIZE ROWS CONFIGURED. CLICK &quot;+ ADD SIZE&quot; TO CREATE ONE.
                </div>
              ) : (
                <div className="overflow-x-auto border border-[rgba(245,244,238,0.08)] rounded-lg bg-[rgba(0,0,0,0.3)]">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[rgba(245,244,238,0.08)] bg-[rgba(0,0,0,0.6)]">
                        <th className="py-3 px-4 text-left font-bold text-[var(--m-gold)] min-w-[130px] uppercase text-[10px] tracking-wider">
                          SIZE / ORDER
                        </th>
                        {guide.columns.map((col) => (
                          <th key={col.id} className="py-3 px-3 text-center min-w-[140px]">
                            <div className="flex flex-col gap-1 items-center">
                              <input
                                name={`column_label_${col.id}`}
                                type="text"
                                required
                                maxLength={50}
                                defaultValue={col.label}
                                className="w-full text-center px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(245,244,238,0.1)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-bold text-[var(--m-cream)] uppercase transition-colors"
                                title={`Column Label: ${col.label}`}
                              />
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] text-[rgba(245,244,238,0.3)] uppercase">POS:</span>
                                <input
                                  name={`column_sort_${col.id}`}
                                  type="number"
                                  defaultValue={col.sortOrder}
                                  className="w-12 text-center px-1 py-0.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.08)] text-[10px] text-[rgba(245,244,238,0.6)] focus:border-[var(--m-gold)] focus:outline-none"
                                  title="Column Sort Order"
                                />
                              </div>
                              {updateState.fieldErrors?.[`column_label_${col.id}`] && (
                                <span className="text-[9px] text-red-400 font-normal">
                                  {updateState.fieldErrors[`column_label_${col.id}`]}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(245,244,238,0.04)]">
                      {guide.rows.map((row) => (
                        <tr key={row.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                          {/* Row Size Label + Sort Order */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <input
                                name={`row_label_${row.id}`}
                                type="text"
                                required
                                maxLength={50}
                                defaultValue={row.label}
                                className="w-20 px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(245,244,238,0.1)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-bold text-[var(--m-cream)] uppercase transition-colors"
                                title={`Row Label: ${row.label}`}
                              />
                              <input
                                name={`row_sort_${row.id}`}
                                type="number"
                                defaultValue={row.sortOrder}
                                className="w-12 text-center px-1 py-1 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.08)] text-[10px] text-[rgba(245,244,238,0.6)] focus:border-[var(--m-gold)] focus:outline-none"
                                title="Row Sort Order"
                              />
                            </div>
                            {updateState.fieldErrors?.[`row_label_${row.id}`] && (
                              <p className="text-[9px] text-red-400 font-normal mt-1">
                                {updateState.fieldErrors[`row_label_${row.id}`]}
                              </p>
                            )}
                          </td>

                          {/* Cell Value Inputs */}
                          {guide.columns.map((col) => {
                            const initialValue = row.cells[col.id] || "";
                            return (
                              <td key={col.id} className="py-2.5 px-3 text-center">
                                <input
                                  name={`cell_${row.id}_${col.id}`}
                                  type="text"
                                  maxLength={30}
                                  defaultValue={initialValue}
                                  className="w-full text-center px-2 py-1.5 rounded bg-[rgba(0,0,0,0.35)] border border-[rgba(245,244,238,0.08)] focus:border-[var(--m-gold)] focus:outline-none text-xs text-amber-200 font-mono transition-colors"
                                  placeholder="—"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar (Assigned Products, Notes, Specs) */}
          <div className="flex flex-col gap-6">
            {/* Notes / Tailoring Guidelines Card */}
            <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-3">
              <label htmlFor="guide-notes" className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-2 border-b border-[rgba(245,244,238,0.06)]">
                TAILORING & FIT GUIDELINES
              </label>
              <textarea
                id="guide-notes"
                name="notes"
                rows={4}
                maxLength={1000}
                defaultValue={guide.notes || ""}
                className="w-full px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.35)] border border-[rgba(245,244,238,0.08)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[rgba(245,244,238,0.8)] leading-relaxed transition-colors"
                placeholder="e.g. Fits true to size with an oversized silhouette. All measurements taken flat across the garment."
              />
              {updateState.fieldErrors?.notes && (
                <p className="text-xs font-mono text-red-400">{updateState.fieldErrors.notes}</p>
              )}
            </div>

            {/* Assigned Products Card (Read-only) */}
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
                Product-to-guide assignment is managed inside the Product Editor.
              </p>
            </div>

            {/* Guide Specifications Card */}
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
      </form>

      {/* Expandable ADD SIZE Drawer / Form */}
      {showAddRowDrawer && (
        <div className="p-6 rounded-xl bg-[rgba(28,28,24,0.95)] border border-[var(--m-gold)]/40 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--m-gold)]" />
              <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-[var(--m-cream)]">
                + ADD SIZE ROW
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddRowDrawer(false)}
              className="text-xs font-mono text-[rgba(245,244,238,0.4)] hover:text-[var(--m-cream)] uppercase transition-colors"
            >
              ✕ Close
            </button>
          </div>

          <form action={addRowFormAction} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                  Size Label <span className="text-amber-500">*</span>
                </label>
                <input
                  name="label"
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. XL, 34, ONE SIZE"
                  className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)] uppercase"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                  Sort Order
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={guide.rows.length}
                  className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
                />
              </div>
            </div>

            {/* Optional initial values for each column */}
            {guide.columns.length > 0 && (
              <div className="flex flex-col gap-3 pt-3 border-t border-[rgba(245,244,238,0.06)]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.5)]">
                  Optional Initial Measurements ({guide.unit}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {guide.columns.map((col) => (
                    <div key={col.id} className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
                        {col.label}
                      </label>
                      <input
                        name={`cell_${col.id}`}
                        type="text"
                        maxLength={30}
                        placeholder="—"
                        className="px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.08)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-amber-200 text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddRowDrawer(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAddRowPending}
                className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAddRowPending ? "CREATING SIZE..." : "CREATE SIZE ROW"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expandable ADD COLUMN Drawer / Form */}
      {showAddColDrawer && (
        <div className="p-6 rounded-xl bg-[rgba(28,28,24,0.95)] border border-[var(--m-gold)]/40 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--m-gold)]" />
              <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-[var(--m-cream)]">
                + ADD MEASUREMENT COLUMN
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddColDrawer(false)}
              className="text-xs font-mono text-[rgba(245,244,238,0.4)] hover:text-[var(--m-cream)] uppercase transition-colors"
            >
              ✕ Close
            </button>
          </div>

          <form action={addColFormAction} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                  Column Name <span className="text-amber-500">*</span>
                </label>
                <input
                  name="label"
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. CHEST, SLEEVE, INSEAM"
                  className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)] uppercase"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                  Sort Order
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={guide.columns.length}
                  className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
                />
              </div>
            </div>

            {/* Optional initial values for each existing row */}
            {guide.rows.length > 0 && (
              <div className="flex flex-col gap-3 pt-3 border-t border-[rgba(245,244,238,0.06)]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.5)]">
                  Optional Initial Measurements for Sizes ({guide.unit}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {guide.rows.map((row) => (
                    <div key={row.id} className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
                        Size: {row.label}
                      </label>
                      <input
                        name={`cell_${row.id}`}
                        type="text"
                        maxLength={30}
                        placeholder="—"
                        className="px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.08)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-amber-200 text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddColDrawer(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAddColPending}
                className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAddColPending ? "CREATING COLUMN..." : "CREATE COLUMN"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 py-3 px-6 bg-[rgba(16,16,14,0.92)] backdrop-blur-md border-t border-[rgba(245,244,238,0.1)] flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[rgba(245,244,238,0.6)] uppercase hidden sm:inline">
            Guide: <strong className="text-[var(--m-cream)]">{guide.name}</strong>
          </span>
          <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
            ({guide.stats.rowCount} Sizes × {guide.stats.columnCount} Measurements)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            form="size-guide-editor-form"
            disabled={isUpdatePending}
            className="px-6 py-2 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(251,133,0,0.25)]"
          >
            {isUpdatePending ? "SAVING..." : "SAVE GUIDE"}
          </button>
        </div>
      </div>
    </div>
  );
}
