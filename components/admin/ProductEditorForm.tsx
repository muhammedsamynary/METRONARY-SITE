"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { updateProductAction, type ProductUpdateActionState } from "@/app/admin/(protected)/products/[id]/actions";
import type { AdminProductDetailResult, AdminSizeGuideOption } from "@/lib/admin/products";

interface ProductEditorFormProps {
  product: AdminProductDetailResult;
  sizeGuides: AdminSizeGuideOption[];
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

export function ProductEditorForm({
  product,
  sizeGuides,
}: ProductEditorFormProps) {
  // Initial price in EGP decimal
  const initialPriceEgp =
    product.priceMinor !== null && product.priceMinor !== undefined
      ? (product.priceMinor / 100).toString()
      : "";

  const initialTagsStr = product.tags.join(", ");

  const updateActionWithId = updateProductAction.bind(null, product.id);
  const [state, formAction, isPending] = useActionState<
    ProductUpdateActionState,
    FormData
  >(updateActionWithId, { success: false });

  // Controlled UI helpers
  const [activeChecked, setActiveChecked] = useState(product.active);
  const [featuredChecked, setFeaturedChecked] = useState(product.featured);

  return (
    <form action={formAction} className="flex flex-col gap-8 max-w-6xl">
      {/* Top Bar / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[rgba(245,244,238,0.6)] hover:text-[var(--m-gold)] transition-colors"
          >
            ← Back to Products Catalog
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-xs font-mono tracking-wider uppercase bg-[rgba(255,255,255,0.04)] text-[rgba(245,244,238,0.7)] border border-[rgba(245,244,238,0.12)] hover:border-[var(--m-gold)] hover:text-[var(--m-cream)] transition-colors"
          >
            View on Storefront ↗
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(251,133,0,0.25)]"
          >
            {isPending ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>

      {/* Form Feedback Alerts */}
      {state.success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              {state.message || "Product updated successfully."}
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase text-emerald-500/80">
            SAVED
          </span>
        </div>
      )}

      {state.error && !state.success && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-3 animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
          <p className="text-xs font-mono text-rose-300">
            {state.error}
          </p>
        </div>
      )}

      {/* Main 2-Column Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / MAIN COLUMN: Product Data, Pricing, Merchandising */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Information Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                CORE PRODUCT INFORMATION
              </h2>
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)]">
                REQUIRED & CATALOG METADATA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Working Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="workingName"
                  className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
                >
                  Working Name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="workingName"
                  name="workingName"
                  type="text"
                  required
                  defaultValue={product.workingName}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.3)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                  placeholder="e.g. Raw Edge Heavyweight Tee"
                />
                {state.fieldErrors?.workingName && (
                  <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {state.fieldErrors.workingName}
                  </p>
                )}
                <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                  Internal product reference name.
                </span>
              </div>

              {/* Official Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="officialName"
                  className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
                >
                  Official Name (Optional)
                </label>
                <input
                  id="officialName"
                  name="officialName"
                  type="text"
                  defaultValue={product.officialName || ""}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.3)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                  placeholder="e.g. METRONARY 01 TEE"
                />
                {state.fieldErrors?.officialName && (
                  <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {state.fieldErrors.officialName}
                  </p>
                )}
                <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                  Storefront displays this when present.
                </span>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="category"
                  className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
                >
                  Category <span className="text-amber-400">*</span>
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  required
                  defaultValue={product.category}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-mono uppercase text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.3)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                  placeholder="e.g. Tops, Bottoms, Outerwear"
                />
                {state.fieldErrors?.category && (
                  <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {state.fieldErrors.category}
                  </p>
                )}
              </div>

              {/* Silhouette */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="silhouette"
                  className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
                >
                  Silhouette (Optional)
                </label>
                <input
                  id="silhouette"
                  name="silhouette"
                  type="text"
                  defaultValue={product.silhouette || ""}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.3)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                  placeholder="e.g. Oversized, Relaxed, Wide Leg"
                />
                {state.fieldErrors?.silhouette && (
                  <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {state.fieldErrors.silhouette}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[rgba(245,244,238,0.04)]">
              <label
                htmlFor="description"
                className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
              >
                Editorial Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={product.description || ""}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[rgba(245,244,238,0.85)] placeholder-[rgba(245,244,238,0.3)] leading-relaxed focus:border-[var(--m-gold)] focus:outline-none transition-colors resize-y"
                placeholder="Enter product narrative, materials, and tailoring details..."
              />
              {state.fieldErrors?.description && (
                <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                  {state.fieldErrors.description}
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Merchandising Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                PRICING & MERCHANDISING
              </h2>
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)]">
                STOREFRONT COMMERCIALS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price EGP */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="price"
                  className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
                >
                  Price (EGP)
                </label>
                <div className="relative">
                  <input
                    id="price"
                    name="price"
                    type="text"
                    inputMode="decimal"
                    defaultValue={initialPriceEgp}
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-mono font-bold text-[var(--m-gold)] placeholder-[rgba(245,244,238,0.25)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                    placeholder="e.g. 1500 or 1299.50"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase text-[rgba(245,244,238,0.4)] pointer-events-none">
                    EGP
                  </span>
                </div>
                {state.fieldErrors?.price && (
                  <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {state.fieldErrors.price}
                  </p>
                )}
                <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                  Leave blank for unpriced products. Saved as piastres (1 EGP = 100 minor units).
                </span>
              </div>

              {/* Currency (Locked) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]">
                  Store Currency
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(245,244,238,0.06)] text-xs font-mono text-[rgba(245,244,238,0.5)] flex items-center justify-between">
                  <span>EGP (Egyptian Pound)</span>
                  <span className="text-[10px] uppercase text-[rgba(245,244,238,0.3)]">
                    LOCKED
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                  Fixed primary storefront currency.
                </span>
              </div>

              {/* Badge */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="badge"
                  className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
                >
                  Badge Text (Optional)
                </label>
                <input
                  id="badge"
                  name="badge"
                  type="text"
                  defaultValue={product.badge || ""}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-mono text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.3)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                  placeholder="e.g. ARCHIVE, CORE, NEW"
                />
                {state.fieldErrors?.badge && (
                  <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {state.fieldErrors.badge}
                  </p>
                )}
                <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                  Shown as decorative badge on product cards.
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="tags"
                  className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
                >
                  Tags (Comma-separated)
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  defaultValue={initialTagsStr}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-mono text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.3)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                  placeholder="e.g. graphic tee, black, heavyweight"
                />
                {state.fieldErrors?.tags && (
                  <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {state.fieldErrors.tags}
                  </p>
                )}
                <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                  Normalized, trimmed, and deduplicated on save.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT / SIDEBAR COLUMN: Visibility, Size Guide, Media Assets, Metadata */}
        <div className="flex flex-col gap-6">
          {/* Status & Visibility Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              VISIBILITY & STATUS
            </h2>

            {/* Active Toggle */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.35)] border border-[rgba(245,244,238,0.08)]">
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={activeChecked}
                onChange={(e) => setActiveChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="active"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--m-cream)] cursor-pointer"
                >
                  ACTIVE PRODUCT
                </label>
                <p className="text-[10px] font-mono text-[rgba(245,244,238,0.45)] mt-0.5 leading-normal">
                  Inactive products remain manageable in admin but are hidden from customer storefront queries.
                </p>
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.35)] border border-[rgba(245,244,238,0.08)]">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={featuredChecked}
                onChange={(e) => setFeaturedChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="featured"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--m-cream)] cursor-pointer"
                >
                  FEATURED PRODUCT
                </label>
                <p className="text-[10px] font-mono text-[rgba(245,244,238,0.45)] mt-0.5 leading-normal">
                  Flags product as featured for catalog filtering and merchandising flags.
                </p>
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label
                htmlFor="sortOrder"
                className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
              >
                Sort Order Priority
              </label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                step="1"
                defaultValue={product.sortOrder}
                className="w-full px-3.5 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs font-mono text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none transition-colors"
              />
              {state.fieldErrors?.sortOrder && (
                <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                  {state.fieldErrors.sortOrder}
                </p>
              )}
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                Lower numbers appear first in catalog listings.
              </span>
            </div>
          </div>

          {/* Size Guide Assignment Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              SIZE GUIDE ATTACHMENT
            </h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sizeGuideId"
                className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)]"
              >
                Assigned Size Guide
              </label>
              <select
                id="sizeGuideId"
                name="sizeGuideId"
                defaultValue={product.sizeGuideId || "none"}
                className="w-full px-3 py-2.5 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(245,244,238,0.12)] text-xs font-mono text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="none" className="bg-[#121210] text-[rgba(245,244,238,0.6)]">
                  None (No Size Guide Attached)
                </option>
                {sizeGuides.map((guide) => (
                  <option
                    key={guide.id}
                    value={guide.id}
                    className="bg-[#121210] text-[var(--m-cream)]"
                  >
                    {guide.name} ({guide.unit})
                  </option>
                ))}
              </select>
              {state.fieldErrors?.sizeGuideId && (
                <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                  {state.fieldErrors.sizeGuideId}
                </p>
              )}
              <span className="text-[10px] font-mono text-[rgba(245,244,238,0.35)]">
                Selecting None removes the size guide reference. Size guide editing is managed in Phase 12F.
              </span>
            </div>
          </div>

          {/* Current Media Assets Card (Read-Only) */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.06)]">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                CURRENT MEDIA ({product.media.length})
              </h2>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                READ-ONLY
              </span>
            </div>

            {/* Thumbnail Preview */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.06)]">
              <div className="w-14 h-14 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.1)] shrink-0 overflow-hidden flex items-center justify-center">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.displayName}
                    width={56}
                    height={56}
                    className="object-contain w-full h-full p-1"
                  />
                ) : (
                  <span className="text-[10px] font-mono text-neutral-500">N/A</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-[rgba(245,244,238,0.4)]">
                  Primary Thumbnail
                </span>
                <p className="text-xs font-mono text-[var(--m-cream)] truncate max-w-[200px] mt-0.5">
                  {product.thumbnail ? product.thumbnail.split("/").pop() : "None"}
                </p>
              </div>
            </div>

            {/* Media Gallery Thumbnails */}
            {product.media.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {product.media.map((m) => (
                  <div
                    key={m.id}
                    className="relative aspect-square rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.08)] overflow-hidden flex items-center justify-center p-1"
                  >
                    <Image
                      src={m.src}
                      alt={m.alt || product.displayName}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                    {m.isPrimary && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 rounded text-[7px] font-mono bg-[var(--m-gold)] text-black font-bold uppercase">
                        PRI
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-[10px] font-mono text-[rgba(245,244,238,0.35)] leading-normal pt-1">
              Media upload and gallery re-ordering will be handled in a dedicated media management phase.
            </p>
          </div>

          {/* Technical Metadata Card (Read-Only) */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-3">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)] pb-3 border-b border-[rgba(245,244,238,0.06)]">
              TECHNICAL METADATA
            </h2>

            {/* Slug (Locked) */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-[rgba(245,244,238,0.4)]">
                Product Slug (Storefront Identifier)
              </span>
              <div className="w-full px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.06)] text-xs font-mono text-[var(--m-cream)] flex items-center justify-between">
                <span>/{product.slug}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-700">
                  LOCKED
                </span>
              </div>
              <p className="text-[10px] font-mono text-amber-400/70 mt-0.5">
                Storefront route identifier — locked.
              </p>
            </div>

            {/* Product ID */}
            <div className="flex flex-col gap-1 pt-2 border-t border-[rgba(245,244,238,0.04)]">
              <span className="text-[10px] font-mono uppercase text-[rgba(245,244,238,0.4)]">
                Database ID
              </span>
              <p className="font-mono text-xs text-[rgba(245,244,238,0.6)] select-all break-all">
                {product.id}
              </p>
            </div>

            {/* Timestamps */}
            <div className="pt-2 border-t border-[rgba(245,244,238,0.04)] font-mono text-[10px] text-[rgba(245,244,238,0.4)] space-y-1">
              <p>Created: {formatDate(product.createdAt)}</p>
              <p>Last Updated: {formatDate(product.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Read-Only Variants Table Card */}
      <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(245,244,238,0.06)]">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              VARIANTS & INVENTORY ({product.variants.length})
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-900 text-neutral-400 border border-neutral-700">
              READ-ONLY
            </span>
          </div>
          <p className="text-[10px] font-mono text-[rgba(245,244,238,0.4)]">
            Variant and inventory management is handled separately (Phase 12E).
          </p>
        </div>

        {product.variants.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.2)] rounded-lg">
            No variants configured for this product.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(245,244,238,0.06)] text-[10px] font-mono tracking-wider uppercase text-[rgba(245,244,238,0.4)]">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Stock Status</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(245,244,238,0.04)] text-xs font-mono">
                {product.variants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="py-3 px-3 font-semibold text-[var(--m-cream)]">
                      {variant.size || "Default"}
                    </td>
                    <td className="py-3 px-3 text-[rgba(245,244,238,0.6)]">
                      {variant.sku || "—"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-amber-950/30 text-amber-300 border border-amber-500/20">
                        {variant.stockStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[rgba(245,244,238,0.6)]">
                      {variant.stockQuantity !== null
                        ? variant.stockQuantity
                        : "Unlimited / Unset"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {variant.active ? (
                        <span className="text-emerald-400">YES</span>
                      ) : (
                        <span className="text-neutral-500">NO</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-6 flex items-center justify-between p-4 rounded-xl bg-[rgba(18,18,16,0.92)] backdrop-blur-md border border-[rgba(245,244,238,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--m-gold)]" />
          <span className="text-xs font-mono text-[rgba(245,244,238,0.6)] uppercase">
            Editing: <strong className="text-[var(--m-cream)]">{product.displayName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-lg text-xs font-mono uppercase text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(251,133,0,0.25)]"
          >
            {isPending ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </form>
  );
}
