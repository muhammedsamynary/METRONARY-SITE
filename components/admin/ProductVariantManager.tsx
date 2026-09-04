"use client";

import { useActionState, useState } from "react";
import {
  updateVariantAction,
  createVariantAction,
  type VariantActionState,
} from "@/app/admin/(protected)/products/[id]/actions";
import type { AdminProductDetailVariant } from "@/lib/admin/products";

interface ProductVariantManagerProps {
  productId: string;
  variants: AdminProductDetailVariant[];
}

const STOCK_STATUS_OPTIONS = [
  { value: "UNKNOWN", label: "UNKNOWN" },
  { value: "IN_STOCK", label: "IN STOCK" },
  { value: "LOW_STOCK", label: "LOW STOCK" },
  { value: "OUT_OF_STOCK", label: "OUT OF STOCK" },
  { value: "UNAVAILABLE", label: "UNAVAILABLE" },
] as const;

/**
 * Individual Variant Row Editor Component
 */
function VariantRow({
  productId,
  variant,
}: {
  productId: string;
  variant: AdminProductDetailVariant;
}) {
  const updateAction = updateVariantAction.bind(null, productId, variant.id);
  const [state, formAction, isPending] = useActionState<
    VariantActionState,
    FormData
  >(updateAction, { success: false });

  const [activeChecked, setActiveChecked] = useState(variant.active);

  return (
    <form
      action={formAction}
      className={`border-b border-[rgba(245,244,238,0.06)] last:border-b-0 transition-colors ${
        !activeChecked ? "opacity-60 bg-[rgba(0,0,0,0.2)]" : ""
      }`}
    >
      {/* Desktop Layout (Table-like grid) */}
      <div className="hidden lg:grid grid-cols-12 gap-3 items-center py-3 px-4 text-xs font-mono">
        {/* Size */}
        <div className="col-span-2">
          <input
            name="size"
            type="text"
            required
            defaultValue={variant.size || ""}
            placeholder="Size (e.g. S)"
            className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-bold text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
          />
          {state.fieldErrors?.size && (
            <p className="text-[10px] text-rose-400 mt-0.5">{state.fieldErrors.size}</p>
          )}
        </div>

        {/* SKU */}
        <div className="col-span-2">
          <input
            name="sku"
            type="text"
            defaultValue={variant.sku || ""}
            placeholder="SKU (Optional)"
            className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[rgba(245,244,238,0.7)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
          />
          {state.fieldErrors?.sku && (
            <p className="text-[10px] text-rose-400 mt-0.5">{state.fieldErrors.sku}</p>
          )}
        </div>

        {/* Stock Status */}
        <div className="col-span-3">
          <select
            name="stockStatus"
            defaultValue={variant.stockStatus}
            className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-semibold text-amber-300 focus:border-[var(--m-gold)] focus:outline-none cursor-pointer"
          >
            {STOCK_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#141412] text-[var(--m-cream)]">
                {opt.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.stockStatus && (
            <p className="text-[10px] text-rose-400 mt-0.5">{state.fieldErrors.stockStatus}</p>
          )}
        </div>

        {/* Quantity */}
        <div className="col-span-2">
          <input
            name="stockQuantity"
            type="number"
            min="0"
            step="1"
            defaultValue={
              variant.stockQuantity !== null && variant.stockQuantity !== undefined
                ? variant.stockQuantity
                : ""
            }
            placeholder="Unset"
            className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
          />
          {state.fieldErrors?.stockQuantity && (
            <p className="text-[10px] text-rose-400 mt-0.5">{state.fieldErrors.stockQuantity}</p>
          )}
        </div>

        {/* Active Toggle */}
        <div className="col-span-1 flex items-center justify-center">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              name="active"
              type="checkbox"
              checked={activeChecked}
              onChange={(e) => setActiveChecked(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
            />
            <span className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
              {activeChecked ? "ON" : "OFF"}
            </span>
          </label>
        </div>

        {/* Sort Order */}
        <div className="col-span-1">
          <input
            name="sortOrder"
            type="number"
            step="1"
            defaultValue={variant.sortOrder}
            className="w-full px-2 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-center text-[rgba(245,244,238,0.7)] focus:border-[var(--m-gold)] focus:outline-none"
          />
        </div>

        {/* Save Button & Status */}
        <div className="col-span-1 flex flex-col items-end justify-center">
          <button
            type="submit"
            disabled={isPending}
            className="w-full px-2 py-1.5 rounded bg-[rgba(255,255,255,0.06)] hover:bg-[var(--m-gold)] hover:text-black border border-[rgba(245,244,238,0.15)] text-[10px] font-bold uppercase tracking-wider text-[var(--m-cream)] disabled:opacity-40 transition-colors"
          >
            {isPending ? "..." : "SAVE"}
          </button>
        </div>
      </div>

      {/* Row Feedback Banner */}
      {state.success && (
        <div className="px-4 py-1.5 bg-emerald-950/30 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Variant ({variant.size || "Default"}) saved.</span>
        </div>
      )}
      {state.error && !state.success && (
        <div className="px-4 py-1.5 bg-rose-950/30 border-t border-rose-500/20 text-[10px] font-mono text-rose-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Mobile Stacked Layout */}
      <div className="lg:hidden p-4 flex flex-col gap-3 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--m-gold)]">
            VARIANT: {variant.size || "UNNAMED"}
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              name="active"
              type="checkbox"
              checked={activeChecked}
              onChange={(e) => setActiveChecked(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0"
            />
            <span className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
              {activeChecked ? "ACTIVE" : "INACTIVE"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">Size</label>
            <input
              name="size"
              type="text"
              required
              defaultValue={variant.size || ""}
              className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)]"
            />
          </div>
          <div>
            <label className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">SKU</label>
            <input
              name="sku"
              type="text"
              defaultValue={variant.sku || ""}
              className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[var(--m-cream)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">Stock Status</label>
            <select
              name="stockStatus"
              defaultValue={variant.stockStatus}
              className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-amber-300"
            >
              {STOCK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141412] text-[var(--m-cream)]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">Quantity</label>
            <input
              name="stockQuantity"
              type="number"
              min="0"
              step="1"
              defaultValue={
                variant.stockQuantity !== null && variant.stockQuantity !== undefined
                  ? variant.stockQuantity
                  : ""
              }
              placeholder="Unset"
              className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[var(--m-cream)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[rgba(245,244,238,0.06)]">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">Sort Order</span>
            <input
              name="sortOrder"
              type="number"
              step="1"
              defaultValue={variant.sortOrder}
              className="w-16 px-2 py-1 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-center text-[var(--m-cream)]"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 rounded bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider"
          >
            {isPending ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </form>
  );
}

/**
 * Add Variant Panel Component
 */
function AddVariantPanel({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const createAction = createVariantAction.bind(null, productId);
  const [state, formAction, isPending] = useActionState<
    VariantActionState,
    FormData
  >(createAction, { success: false });

  const [activeChecked, setActiveChecked] = useState(true);

  return (
    <div className="p-5 rounded-xl bg-[rgba(28,28,24,0.9)] border border-[rgba(251,133,0,0.3)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--m-gold)]" />
          <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-[var(--m-gold)]">
            NEW PRODUCT VARIANT
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-mono text-[rgba(245,244,238,0.5)] hover:text-[var(--m-cream)] uppercase"
        >
          Cancel ✕
        </button>
      </div>

      {state.success && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <span>✓ Variant created successfully.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] uppercase underline text-emerald-400"
          >
            Done
          </button>
        </div>
      )}

      {state.error && !state.success && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4 text-xs font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Size */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.6)]">
              Size <span className="text-amber-400">*</span>
            </label>
            <input
              name="size"
              type="text"
              required
              placeholder="e.g. S, M, L, XL"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
            {state.fieldErrors?.size && (
              <p className="text-[10px] text-rose-400">{state.fieldErrors.size}</p>
            )}
          </div>

          {/* SKU */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.6)]">
              SKU (Optional)
            </label>
            <input
              name="sku"
              type="text"
              placeholder="e.g. METRO-SH-BLK-S"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
            {state.fieldErrors?.sku && (
              <p className="text-[10px] text-rose-400">{state.fieldErrors.sku}</p>
            )}
          </div>

          {/* Stock Status (Default UNKNOWN) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.6)]">
              Stock Status
            </label>
            <select
              name="stockStatus"
              defaultValue="UNKNOWN"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-semibold text-amber-300 focus:border-[var(--m-gold)] focus:outline-none cursor-pointer"
            >
              {STOCK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141412] text-[var(--m-cream)]">
                  {opt.label}
                </option>
              ))}
            </select>
            {state.fieldErrors?.stockStatus && (
              <p className="text-[10px] text-rose-400">{state.fieldErrors.stockStatus}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.6)]">
              Stock Quantity (Optional)
            </label>
            <input
              name="stockQuantity"
              type="number"
              min="0"
              step="1"
              placeholder="Leave blank for qualitative status"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
            {state.fieldErrors?.stockQuantity && (
              <p className="text-[10px] text-rose-400">{state.fieldErrors.stockQuantity}</p>
            )}
          </div>

          {/* Sort Order */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.6)]">
              Sort Order
            </label>
            <input
              name="sortOrder"
              type="number"
              step="1"
              defaultValue={0}
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex flex-col justify-center pt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="active"
                type="checkbox"
                checked={activeChecked}
                onChange={(e) => setActiveChecked(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold uppercase text-[var(--m-cream)]">
                Active Variant
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(245,244,238,0.06)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs uppercase text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded-lg bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-[0_0_12px_rgba(251,133,0,0.2)]"
          >
            {isPending ? "CREATING..." : "CREATE VARIANT"}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Main Product Variant & Inventory Manager Section
 */
export function ProductVariantManager({
  productId,
  variants,
}: ProductVariantManagerProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);

  return (
    <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(245,244,238,0.06)]">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
            VARIANTS & INVENTORY ({variants.length})
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/30 text-amber-300 border border-amber-500/20">
            MANAGEMENT ACTIVE
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowAddPanel((prev) => !prev)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)] hover:border-[var(--m-gold)] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>{showAddPanel ? "✕ CLOSE" : "+ ADD VARIANT"}</span>
        </button>
      </div>

      {/* Add Variant Expandable Panel */}
      {showAddPanel && (
        <AddVariantPanel
          productId={productId}
          onClose={() => setShowAddPanel(false)}
        />
      )}

      {/* Existing Variants Table */}
      {variants.length === 0 ? (
        <div className="py-8 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.25)] rounded-lg border border-[rgba(245,244,238,0.04)] flex flex-col items-center gap-2">
          <span>NO VARIANTS CONFIGURED FOR THIS PRODUCT</span>
          <span className="text-[10px] text-[rgba(245,244,238,0.3)]">
            Click &quot;+ ADD VARIANT&quot; above to create sizes for this product.
          </span>
        </div>
      ) : (
        <div className="border border-[rgba(245,244,238,0.08)] rounded-lg overflow-hidden bg-[rgba(0,0,0,0.3)]">
          {/* Table Header (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-3 py-2.5 px-4 bg-[rgba(0,0,0,0.5)] border-b border-[rgba(245,244,238,0.08)] text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
            <div className="col-span-2">Size *</div>
            <div className="col-span-2">SKU (Opt)</div>
            <div className="col-span-3">Stock Status</div>
            <div className="col-span-2">Quantity (Opt)</div>
            <div className="col-span-1 text-center">Active</div>
            <div className="col-span-1 text-center">Sort</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[rgba(245,244,238,0.04)]">
            {variants.map((v) => (
              <VariantRow key={v.id} productId={productId} variant={v} />
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] font-mono text-[rgba(245,244,238,0.35)] leading-normal">
        Inventory changes revalidate storefront PDP immediately. Quantitative limits will be decremented on order completion if configured.
      </p>
    </div>
  );
}
