"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AdminProductListItem, StockSummary } from "@/lib/admin/products";

interface AdminProductTableProps {
  initialProducts: AdminProductListItem[];
}

function formatPrice(priceMinor: number | null, currency: string = "EGP"): string {
  if (priceMinor === null || priceMinor === undefined) {
    return "NOT SET";
  }
  const amount = (priceMinor / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${amount} ${currency}`;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function StockBadge({ stockSummary }: { stockSummary: StockSummary }) {
  switch (stockSummary) {
    case "IN_STOCK":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
          IN STOCK
        </span>
      );
    case "LOW_STOCK":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-amber-950/40 text-amber-400 border border-amber-500/30">
          LOW STOCK
        </span>
      );
    case "OUT_OF_STOCK":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-red-950/40 text-red-400 border border-red-500/30">
          OUT OF STOCK
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-neutral-900 text-neutral-400 border border-neutral-700">
          UNAVAILABLE
        </span>
      );
    case "MIXED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-[rgba(251,133,0,0.15)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)]">
          MIXED
        </span>
      );
    case "UNKNOWN":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-amber-950/30 text-amber-300/80 border border-amber-500/20">
          UNKNOWN
        </span>
      );
    case "NO_VARIANTS":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-neutral-900/60 text-neutral-500 border border-neutral-800">
          NO VARIANTS
        </span>
      );
  }
}

export function AdminProductTable({ initialProducts }: AdminProductTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");

  const categories = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.category));
    return Array.from(set).sort();
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = p.displayName.toLowerCase().includes(query);
        const matchesSlug = p.slug.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSlug && !matchesCat) return false;
      }

      // Category
      if (categoryFilter !== "ALL" && p.category !== categoryFilter) {
        return false;
      }

      // Status
      if (statusFilter === "ACTIVE" && !p.active) return false;
      if (statusFilter === "INACTIVE" && p.active) return false;

      // Price
      if (priceFilter === "PRICED" && (p.priceMinor === null || p.priceMinor === undefined)) {
        return false;
      }
      if (priceFilter === "UNPRICED" && p.priceMinor !== null && p.priceMinor !== undefined) {
        return false;
      }

      return true;
    });
  }, [initialProducts, search, categoryFilter, statusFilter, priceFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)]">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, slug, or category..."
            className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.4)] text-sm text-[var(--m-cream)] placeholder-[rgba(245,244,238,0.3)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:ring-1 focus:ring-[var(--m-gold)] outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] text-xs font-mono uppercase text-[var(--m-cream)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] outline-none cursor-pointer"
          >
            <option value="ALL">All Categories ({initialProducts.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] text-xs font-mono uppercase text-[var(--m-cream)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] outline-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Pricing Filter */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] text-xs font-mono uppercase text-[var(--m-cream)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] outline-none cursor-pointer"
          >
            <option value="ALL">All Pricing</option>
            <option value="PRICED">Priced</option>
            <option value="UNPRICED">Unpriced (Not Set)</option>
          </select>
        </div>
      </div>

      {/* Catalog Table Container */}
      <div className="rounded-xl border border-[rgba(245,244,238,0.08)] bg-[rgba(22,22,20,0.6)] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(245,244,238,0.08)] bg-[rgba(0,0,0,0.3)] text-[10px] font-mono tracking-[0.18em] uppercase text-[rgba(245,244,238,0.5)]">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Variants</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Featured</th>
                <th className="py-3.5 px-4 font-semibold">Updated</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(245,244,238,0.05)] text-xs font-sans">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm font-mono text-[rgba(245,244,238,0.4)]">
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                  >
                    {/* PRODUCT COLUMN */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.1)] shrink-0 overflow-hidden flex items-center justify-center relative">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.displayName}
                              width={44}
                              height={44}
                              className="object-contain w-full h-full p-0.5"
                            />
                          ) : (
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">N/A</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm text-[var(--m-cream)] truncate max-w-[220px]">
                            {product.displayName}
                          </span>
                          <span className="font-mono text-[10px] text-[rgba(245,244,238,0.45)] truncate max-w-[200px]">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY COLUMN */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs uppercase text-[rgba(245,244,238,0.85)]">
                          {product.category}
                        </span>
                        {product.silhouette && (
                          <span className="text-[10px] text-[rgba(245,244,238,0.45)]">
                            {product.silhouette}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* PRICE COLUMN */}
                    <td className="py-3.5 px-4">
                      {product.priceMinor === null || product.priceMinor === undefined ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-amber-950/20 text-amber-400/90 border border-amber-500/20 font-semibold">
                          NOT SET
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-[var(--m-cream)]">
                          {formatPrice(product.priceMinor, product.currency)}
                        </span>
                      )}
                    </td>

                    {/* VARIANTS COLUMN */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-[rgba(245,244,238,0.8)]">
                        {product.variantCount > 0
                          ? `${product.variantCount} VARIANT${product.variantCount > 1 ? "S" : ""}`
                          : "NO VARIANTS"}
                      </span>
                    </td>

                    {/* STOCK COLUMN */}
                    <td className="py-3.5 px-4">
                      <StockBadge stockSummary={product.stockSummary} />
                    </td>

                    {/* STATUS COLUMN */}
                    <td className="py-3.5 px-4">
                      {product.active ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                          INACTIVE
                        </span>
                      )}
                    </td>

                    {/* FEATURED COLUMN */}
                    <td className="py-3.5 px-4 text-center">
                      {product.featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[rgba(251,133,0,0.15)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)] font-semibold">
                          YES
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[rgba(245,244,238,0.3)]">NO</span>
                      )}
                    </td>

                    {/* UPDATED DATE */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] text-[rgba(245,244,238,0.5)]">
                        {formatDate(product.updatedAt)}
                      </span>
                    </td>

                    {/* ACTION BUTTON */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono tracking-wider uppercase border border-[rgba(245,244,238,0.15)] bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(251,133,0,0.15)] hover:border-[var(--m-gold)] hover:text-[var(--m-gold)] text-[rgba(245,244,238,0.85)] transition-colors"
                      >
                        MANAGE
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
