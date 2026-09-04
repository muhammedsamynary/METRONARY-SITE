import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/admin/products";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) return { title: "Product Not Found — METRONARY Admin" };

  return {
    title: `${product.displayName} — METRONARY Admin`,
  };
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

export default async function AdminProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Back Link */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[rgba(245,244,238,0.6)] hover:text-[var(--m-gold)] transition-colors"
        >
          ← Back to Products Catalog
        </Link>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.1)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] shrink-0 overflow-hidden flex items-center justify-center">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.displayName}
                width={56}
                height={56}
                className="object-contain w-full h-full p-1"
              />
            ) : (
              <span className="text-xs font-mono text-neutral-500">N/A</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase text-[var(--m-cream)]">
                {product.displayName}
              </h1>
              {product.active ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-900 text-neutral-400 border border-neutral-700">
                  INACTIVE
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-[rgba(245,244,238,0.5)] mt-0.5">
              Slug: /{product.slug} • ID: {product.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase bg-amber-950/30 text-amber-300 border border-amber-500/30">
            READ-ONLY MODE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Attributes */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* General Information Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              PRODUCT DETAILS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Working Name
                </span>
                <p className="font-medium text-[var(--m-cream)] mt-0.5">
                  {product.workingName}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Official Name
                </span>
                <p className="font-medium text-[var(--m-cream)] mt-0.5">
                  {product.officialName || "Not defined"}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Category
                </span>
                <p className="font-mono uppercase text-[var(--m-cream)] mt-0.5">
                  {product.category}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Silhouette
                </span>
                <p className="text-[var(--m-cream)] mt-0.5">
                  {product.silhouette || "None"}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Price
                </span>
                <p className="font-mono font-bold text-sm text-[var(--m-gold)] mt-0.5">
                  {formatPrice(product.priceMinor, product.currency)}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Badge
                </span>
                <p className="font-mono text-[var(--m-cream)] mt-0.5">
                  {product.badge || "None"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-[rgba(245,244,238,0.06)]">
              <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                Description
              </span>
              <p className="text-xs text-[rgba(245,244,238,0.7)] leading-relaxed mt-1 whitespace-pre-wrap">
                {product.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Variants Table Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
                VARIANTS & INVENTORY ({product.variants.length})
              </h2>
            </div>

            {product.variants.length === 0 ? (
              <div className="py-6 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.2)] rounded-lg">
                No variants configured for this product yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(245,244,238,0.06)] text-[10px] font-mono tracking-wider uppercase text-[rgba(245,244,238,0.4)]">
                      <th className="py-2 px-3">Size</th>
                      <th className="py-2 px-3">SKU</th>
                      <th className="py-2 px-3">Stock Status</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3 text-right">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(245,244,238,0.04)] text-xs font-mono">
                    {product.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td className="py-2.5 px-3 font-semibold text-[var(--m-cream)]">
                          {variant.size || "Default"}
                        </td>
                        <td className="py-2.5 px-3 text-[rgba(245,244,238,0.6)]">
                          {variant.sku || "—"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-amber-950/30 text-amber-300 border border-amber-500/20">
                            {variant.stockStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[rgba(245,244,238,0.6)]">
                          {variant.stockQuantity !== null
                            ? variant.stockQuantity
                            : "Unlimited / Unset"}
                        </td>
                        <td className="py-2.5 px-3 text-right">
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
        </div>

        {/* Sidebar Cards */}
        <div className="flex flex-col gap-6">
          {/* Merchandising & Size Guide */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4 text-xs">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              ORGANIZATION
            </h2>

            <div>
              <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                Size Guide
              </span>
              <p className="font-medium text-[var(--m-cream)] mt-0.5">
                {product.sizeGuideName
                  ? `${product.sizeGuideName} (${product.sizeGuideUnit || "CM"})`
                  : "No size guide assigned"}
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                Featured on Storefront
              </span>
              <p className="font-mono uppercase text-[var(--m-cream)] mt-0.5">
                {product.featured ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                Sort Order Priority
              </span>
              <p className="font-mono text-[var(--m-cream)] mt-0.5">
                {product.sortOrder}
              </p>
            </div>

            {product.tags.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[10px] font-mono text-[rgba(245,244,238,0.7)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[rgba(245,244,238,0.06)] font-mono text-[10px] text-[rgba(245,244,238,0.4)] space-y-1">
              <p>Created: {formatDate(product.createdAt)}</p>
              <p>Last Updated: {formatDate(product.updatedAt)}</p>
            </div>
          </div>

          {/* Media Gallery Card */}
          <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.6)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-4">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              MEDIA ASSETS ({product.media.length})
            </h2>

            {product.media.length === 0 ? (
              <p className="text-xs font-mono text-[rgba(245,244,238,0.4)]">
                No extra media registered.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {product.media.map((m) => (
                  <div
                    key={m.id}
                    className="relative aspect-square rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.1)] overflow-hidden flex items-center justify-center p-2"
                  >
                    <Image
                      src={m.src}
                      alt={m.alt || product.displayName}
                      width={120}
                      height={120}
                      className="object-contain w-full h-full"
                    />
                    {m.isPrimary && (
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-[var(--m-gold)] text-black font-bold uppercase">
                        PRIMARY
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
