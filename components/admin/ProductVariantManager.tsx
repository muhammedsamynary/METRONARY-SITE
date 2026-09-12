"use client";

import { useActionState, useState, useTransition, useMemo } from "react";
import {
  updateVariantAction,
  createVariantAction,
  bulkCreateColorVariantsAction,
  type VariantActionState,
  type BulkColorVariantsState,
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

const COMMON_SIZES = ["S", "M", "L", "XL", "XXL", "OS"];

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
      <div className="hidden lg:grid grid-cols-12 gap-2.5 items-center py-3 px-4 text-xs font-mono">
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

        {/* Color */}
        <div className="col-span-2">
          <input
            name="color"
            type="text"
            defaultValue={variant.color || ""}
            placeholder="Color (Opt)"
            className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[var(--m-gold)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
          />
          {state.fieldErrors?.color && (
            <p className="text-[10px] text-rose-400 mt-0.5">{state.fieldErrors.color}</p>
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
        <div className="col-span-2">
          <select
            name="stockStatus"
            defaultValue={variant.stockStatus}
            className="w-full px-2 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-semibold text-amber-300 focus:border-[var(--m-gold)] focus:outline-none cursor-pointer"
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
        <div className="col-span-1">
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
            className="w-full px-2 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
          />
          {state.fieldErrors?.stockQuantity && (
            <p className="text-[10px] text-rose-400 mt-0.5">{state.fieldErrors.stockQuantity}</p>
          )}
        </div>

        {/* Active Toggle */}
        <div className="col-span-1 flex items-center justify-center">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              name="active"
              type="checkbox"
              checked={activeChecked}
              onChange={(e) => setActiveChecked(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
            />
            <span className="text-[9px] uppercase text-[rgba(245,244,238,0.6)]">
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
            className="w-full px-2 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-center text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
          />
        </div>

        {/* Action / Submit */}
        <div className="col-span-1 text-right">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1.5 rounded bg-[rgba(255,255,255,0.08)] hover:bg-[var(--m-gold)] text-[var(--m-cream)] hover:text-black text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            {isPending ? "..." : "SAVE"}
          </button>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden p-4 flex flex-col gap-3 text-xs font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">Size</span>
            <input
              name="size"
              type="text"
              required
              defaultValue={variant.size || ""}
              placeholder="Size"
              className="w-20 px-2 py-1 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-bold text-[var(--m-cream)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">Color</span>
            <input
              name="color"
              type="text"
              defaultValue={variant.color || ""}
              placeholder="Color (Opt)"
              className="w-28 px-2 py-1 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[var(--m-gold)]"
            />
          </div>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              name="active"
              type="checkbox"
              checked={activeChecked}
              onChange={(e) => setActiveChecked(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
            />
            <span className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
              {activeChecked ? "ACTIVE" : "INACTIVE"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">SKU</label>
            <input
              name="sku"
              type="text"
              defaultValue={variant.sku || ""}
              placeholder="SKU (Optional)"
              className="w-full px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[rgba(245,244,238,0.7)]"
            />
          </div>

          <div>
            <label className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">Stock Status</label>
            <select
              name="stockStatus"
              defaultValue={variant.stockStatus}
              className="w-full px-2 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-amber-300 font-semibold"
            >
              {STOCK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141412] text-[var(--m-cream)]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div className="flex items-center gap-2 pt-3">
            <span className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">Sort</span>
            <input
              name="sortOrder"
              type="number"
              step="1"
              defaultValue={variant.sortOrder}
              className="w-16 px-2 py-1 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-center text-[var(--m-cream)]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[rgba(245,244,238,0.06)]">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 rounded bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider"
          >
            {isPending ? "SAVING..." : "SAVE VARIANT"}
          </button>
        </div>
      </div>
    </form>
  );
}

/**
 * Add Single Variant Panel Component
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
    <div className="p-5 rounded-xl bg-[rgba(28,28,24,0.95)] border border-[rgba(251,133,0,0.35)] shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--m-gold)]" />
          <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-[var(--m-gold)]">
            NEW SINGLE PRODUCT VARIANT
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Color */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.6)]">
              Color (Optional)
            </label>
            <input
              name="color"
              type="text"
              placeholder="e.g. BLACK, WHITE"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-gold)] focus:border-[var(--m-gold)] focus:outline-none"
            />
            {state.fieldErrors?.color && (
              <p className="text-[10px] text-rose-400">{state.fieldErrors.color}</p>
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
              defaultValue="IN_STOCK"
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
              defaultValue={100}
              placeholder="Leave blank for qualitative"
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
 * Bulk Add Color Set Panel Component
 */
function AddColorSetPanel({
  productId,
  existingVariants,
  onClose,
}: {
  productId: string;
  existingVariants: AdminProductDetailVariant[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [resultState, setResultState] = useState<BulkColorVariantsState | null>(null);

  // Form Inputs
  const [colorInput, setColorInput] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [stockStatus, setStockStatus] = useState<string>("IN_STOCK");
  const [stockQuantity, setStockQuantity] = useState<string>("100");
  const [active, setActive] = useState(true);
  const [skuPrefix, setSkuPrefix] = useState("");
  const [applyToExisting, setApplyToExisting] = useState(true);

  // Discover existing sizes on this product
  const [customSizes, setCustomSizes] = useState<string[]>([]);

  const discoveredSizes = useMemo(() => {
    const set = new Set<string>(COMMON_SIZES);
    for (const v of existingVariants) {
      if (v.size && v.size.trim()) {
        set.add(v.size.trim().toUpperCase());
      }
    }
    return Array.from(set);
  }, [existingVariants]);

  const allAvailableSizes = useMemo(() => {
    return Array.from(new Set([...discoveredSizes, ...customSizes]));
  }, [discoveredSizes, customSizes]);

  // Check if product has any legacy null-color variants
  const hasNullColorVariants = useMemo(() => {
    return existingVariants.some((v) => !v.color || !v.color.trim());
  }, [existingVariants]);

  // Parse color input into distinct clean chips
  const parsedColors = useMemo(() => {
    return Array.from(
      new Set(
        colorInput
          .split(/[,;\n]+/)
          .map((c) => c.trim())
          .filter((c) => c.length > 0)
      )
    );
  }, [colorInput]);

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSelectAllSizes = () => {
    setSelectedSizes([...allAvailableSizes]);
  };

  const handleClearAllSizes = () => {
    setSelectedSizes([]);
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSizeInput.trim().toUpperCase();
    if (clean && !allAvailableSizes.includes(clean)) {
      setCustomSizes((prev) => [...prev, clean]);
      setSelectedSizes((prev) => [...prev, clean]);
      setCustomSizeInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResultState(null);

    if (parsedColors.length === 0) {
      setResultState({
        success: false,
        error: "Please enter at least one color name (e.g. RED, BLACK, WHITE).",
      });
      return;
    }

    if (selectedSizes.length === 0) {
      setResultState({
        success: false,
        error: "Please select at least one size for the color set.",
      });
      return;
    }

    startTransition(async () => {
      const res = await bulkCreateColorVariantsAction(productId, {
        colors: parsedColors,
        sizes: selectedSizes,
        stockStatus: stockStatus as "IN_STOCK" | "LOW_STOCK" | "UNKNOWN" | "OUT_OF_STOCK" | "UNAVAILABLE",
        stockQuantity: stockQuantity.trim() ? Number(stockQuantity) : null,
        active,
        skuPrefix: skuPrefix.trim() || null,
        applyToExistingNullColorVariants: hasNullColorVariants && applyToExisting,
      });

      setResultState(res);
      if (res.success) {
        setColorInput("");
      }
    });
  };

  const totalCombinations = parsedColors.length * selectedSizes.length;

  return (
    <div className="p-6 rounded-2xl bg-[rgba(26,24,20,0.96)] border border-[rgba(251,133,0,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--m-gold)] shadow-[0_0_8px_rgba(251,133,0,0.6)]" />
          <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-[var(--m-gold)]">
            BULK COLOR SET GENERATOR (MATRIX CREATION)
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[rgba(245,244,238,0.5)] hover:text-[var(--m-cream)] uppercase"
        >
          Cancel ✕
        </button>
      </div>

      {resultState?.success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{resultState.message}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] uppercase underline text-emerald-400 hover:text-emerald-200"
          >
            Done
          </button>
        </div>
      )}

      {resultState && !resultState.success && (
        <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-center gap-2">
          <span className="text-rose-400 font-bold">⚠</span>
          <span>{resultState.error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 1. Colors Input with live chips */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[rgba(245,244,238,0.7)]">
              Colors (Comma or Line Separated) <span className="text-amber-400">*</span>
            </label>
            <span className="text-[10px] text-[rgba(245,244,238,0.4)]">
              {parsedColors.length} color(s) detected
            </span>
          </div>
          <input
            type="text"
            required
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="e.g. RED, BLACK, WHITE, HEATHER GREY"
            className="px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-gold)] font-bold focus:border-[var(--m-gold)] focus:outline-none"
          />

          {parsedColors.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">Parsed Colors:</span>
              {parsedColors.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 rounded bg-[rgba(251,133,0,0.15)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.35)] text-[10px] font-bold"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. Sizes Selection */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[rgba(245,244,238,0.7)]">
              Select Sizes to Generate <span className="text-amber-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllSizes}
                className="text-[9px] uppercase text-[var(--m-gold)] hover:underline"
              >
                Select All
              </button>
              <span className="text-[rgba(245,244,238,0.2)]">|</span>
              <button
                type="button"
                onClick={handleClearAllSizes}
                className="text-[9px] uppercase text-[rgba(245,244,238,0.4)] hover:text-[var(--m-cream)]"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allAvailableSizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleToggleSize(size)}
                  className={`min-w-[42px] h-9 px-3 rounded-lg border text-xs font-bold transition-colors ${
                    isSelected
                      ? "bg-[rgba(251,133,0,0.2)] border-[var(--m-gold)] text-[var(--m-cream)] shadow-[0_0_8px_rgba(251,133,0,0.3)]"
                      : "bg-[rgba(0,0,0,0.3)] border-[rgba(245,244,238,0.1)] text-[rgba(245,244,238,0.5)] hover:border-[rgba(245,244,238,0.3)] hover:text-[var(--m-cream)]"
                  }`}
                >
                  {isSelected ? `✓ ${size}` : size}
                </button>
              );
            })}
          </div>

          {/* Custom Size Addition */}
          <div className="flex items-center gap-2 pt-1 max-w-xs">
            <input
              type="text"
              value={customSizeInput}
              onChange={(e) => setCustomSizeInput(e.target.value)}
              placeholder="Add Custom Size (e.g. 3XL)"
              className="flex-1 px-2.5 py-1 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.1)] text-xs text-[var(--m-cream)]"
            />
            <button
              type="button"
              onClick={handleAddCustomSize}
              className="px-3 py-1 rounded bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-[var(--m-gold)] text-[10px] font-bold uppercase"
            >
              + Add
            </button>
          </div>
        </div>

        {/* 3. Common Defaults Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[rgba(0,0,0,0.25)] border border-[rgba(245,244,238,0.06)]">
          {/* Stock Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">Stock Status</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-semibold text-amber-300 focus:border-[var(--m-gold)] focus:outline-none"
            >
              {STOCK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141412] text-[var(--m-cream)]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Quantity */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">Stock Quantity</label>
            <input
              type="number"
              min="0"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="e.g. 100"
              className="px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
          </div>

          {/* Optional SKU Prefix */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">SKU Prefix (Opt)</label>
            <input
              type="text"
              value={skuPrefix}
              onChange={(e) => setSkuPrefix(e.target.value)}
              placeholder="e.g. METRO-TEE"
              className="px-2.5 py-1.5 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex flex-col justify-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold uppercase text-[var(--m-cream)]">Active by Default</span>
            </label>
          </div>
        </div>

        {/* 4. First-Color Conversion Mode for Legacy Variants */}
        {hasNullColorVariants && (
          <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-500/30 flex items-start gap-3">
            <input
              id="apply-to-existing"
              type="checkbox"
              checked={applyToExisting}
              onChange={(e) => setApplyToExisting(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer mt-0.5"
            />
            <label htmlFor="apply-to-existing" className="cursor-pointer text-xs text-[rgba(245,244,238,0.85)]">
              <strong className="text-[var(--m-gold)]">APPLY FIRST COLOR TO EXISTING LEGACY VARIANTS:</strong>{" "}
              Automatically converts existing size-only variants (e.g. S/null → S/{parsedColors[0] || "COLOR"}) preserving original IDs and stock records without creating duplicate rows.
            </label>
          </div>
        )}

        {/* 5. Matrix Summary & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(245,244,238,0.06)]">
          <div className="text-[11px] text-[rgba(245,244,238,0.6)]">
            Will generate up to{" "}
            <strong className="text-[var(--m-gold)]">{totalCombinations}</strong> variant combination(s)
            {parsedColors.length > 0 && selectedSizes.length > 0 && (
              <span> ({parsedColors.join(", ")} × {selectedSizes.join(", ")})</span>
            )}
            .
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs uppercase text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || totalCombinations === 0}
              className="px-6 py-2.5 rounded-lg bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 transition-all shadow-[0_0_16px_rgba(251,133,0,0.3)] cursor-pointer"
            >
              {isPending ? "GENERATING MATRIX..." : `GENERATE ${totalCombinations} COMBINATION(S)`}
            </button>
          </div>
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
  const [activePanel, setActivePanel] = useState<"none" | "single" | "bulk">("none");

  // Group variants by Color for clear visual organization
  const groupedVariants = useMemo(() => {
    const groups: { [key: string]: AdminProductDetailVariant[] } = {};

    for (const v of variants) {
      const key = v.color && v.color.trim() ? v.color.trim().toUpperCase() : "__UNIVERSAL__";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(v);
    }

    return Object.entries(groups).map(([groupName, groupVariants]) => ({
      groupName: groupName === "__UNIVERSAL__" ? "UNIVERSAL / NO COLOR" : `COLOR: ${groupName}`,
      colorKey: groupName,
      variants: groupVariants.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    }));
  }, [variants]);

  return (
    <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[rgba(245,244,238,0.06)]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              VARIANTS & INVENTORY ({variants.length})
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/30 text-amber-300 border border-amber-500/20">
              MANAGEMENT ACTIVE
            </span>
          </div>
          <p className="text-[11px] font-mono text-[rgba(245,244,238,0.45)] mt-0.5">
            Manage product sizes, multi-color matrix inventory, SKUs, and qualitative stock status.
          </p>
        </div>

        {/* Action Controls: + ADD COLOR SET & + ADD VARIANT */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setActivePanel((prev) => (prev === "bulk" ? "none" : "bulk"))}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[var(--m-gold)] hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(251,133,0,0.25)] transition-all cursor-pointer"
          >
            {activePanel === "bulk" ? "✕ CLOSE BULK" : "+ ADD COLOR SET"}
          </button>

          <button
            type="button"
            onClick={() => setActivePanel((prev) => (prev === "single" ? "none" : "single"))}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[var(--m-cream)] border border-[rgba(245,244,238,0.15)] hover:border-[var(--m-gold)] transition-colors cursor-pointer"
          >
            {activePanel === "single" ? "✕ CLOSE" : "+ ADD VARIANT"}
          </button>
        </div>
      </div>

      {/* Bulk Add Color Set Expandable Panel */}
      {activePanel === "bulk" && (
        <AddColorSetPanel
          productId={productId}
          existingVariants={variants}
          onClose={() => setActivePanel("none")}
        />
      )}

      {/* Add Single Variant Expandable Panel */}
      {activePanel === "single" && (
        <AddVariantPanel
          productId={productId}
          onClose={() => setActivePanel("none")}
        />
      )}

      {/* Existing Variants List Grouped by Color */}
      {variants.length === 0 ? (
        <div className="py-10 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.25)] rounded-xl border border-[rgba(245,244,238,0.04)] flex flex-col items-center gap-2">
          <span className="font-bold text-[var(--m-cream)]">NO VARIANTS CONFIGURED FOR THIS PRODUCT</span>
          <span className="text-[11px] text-[rgba(245,244,238,0.35)]">
            Click &quot;+ ADD COLOR SET&quot; above to quickly generate sizes across multiple colors, or &quot;+ ADD VARIANT&quot; for a single size.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {groupedVariants.map((group) => (
            <div
              key={group.colorKey}
              className="border border-[rgba(245,244,238,0.08)] rounded-xl overflow-hidden bg-[rgba(0,0,0,0.3)] shadow-md"
            >
              {/* Group Banner */}
              <div className="py-2.5 px-4 bg-[rgba(28,28,24,0.85)] border-b border-[rgba(245,244,238,0.08)] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      group.colorKey === "__UNIVERSAL__" ? "bg-neutral-400" : "bg-[var(--m-gold)]"
                    }`}
                  />
                  <span className="font-bold tracking-wider text-[var(--m-cream)]">
                    {group.groupName}
                  </span>
                  <span className="text-[10px] text-[rgba(245,244,238,0.4)]">
                    ({group.variants.length} variant{group.variants.length === 1 ? "" : "s"})
                  </span>
                </div>
              </div>

              {/* Table Header (Desktop) */}
              <div className="hidden lg:grid grid-cols-12 gap-2.5 py-2 px-4 bg-[rgba(0,0,0,0.4)] border-b border-[rgba(245,244,238,0.06)] text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
                <div className="col-span-2">Size *</div>
                <div className="col-span-2">Color</div>
                <div className="col-span-2">SKU (Opt)</div>
                <div className="col-span-2">Stock Status</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-1 text-center">Active</div>
                <div className="col-span-1 text-center">Sort</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[rgba(245,244,238,0.04)]">
                {group.variants.map((v) => (
                  <VariantRow key={v.id} productId={productId} variant={v} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] font-mono text-[rgba(245,244,238,0.35)] leading-normal">
        Inventory changes revalidate storefront PDP immediately. Quantitative limits will be decremented on order completion if configured.
      </p>
    </div>
  );
}
