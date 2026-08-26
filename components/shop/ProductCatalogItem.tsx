import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products/types";
import { ROUTES } from "@/lib/constants";

interface ProductCatalogItemProps {
  product: Product;
  priority?: boolean;
}

export function ProductCatalogItem({
  product,
  priority = false,
}: ProductCatalogItemProps) {
  const {
    slug,
    workingName,
    silhouette,
    thumbnail,
    hasAlpha = true,
    badge,
  } = product;

  return (
    <article className="group relative flex flex-col">
      <Link
        href={ROUTES.product(slug)}
        className="block relative w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--m-dark)] rounded-xl overflow-hidden"
        aria-label={`View ${workingName}`}
      >
        {/* Visual Frame */}
        <div
          className="relative w-full aspect-[4/5] sm:aspect-square flex items-center justify-center p-6 sm:p-8 bg-[rgba(255,255,255,0.02)] border border-[rgba(245,244,238,0.07)] rounded-xl overflow-hidden transition-all duration-400 ease-out group-hover:border-[rgba(251,133,0,0.35)] group-hover:bg-[rgba(255,255,255,0.035)] group-hover:shadow-[0_16px_40px_rgba(232,93,4,0.15)]"
        >
          {/* Badge */}
          {badge && (
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase bg-[rgba(255,214,10,0.12)] text-[var(--m-gold)] border border-[rgba(255,214,10,0.25)]">
                {badge}
              </span>
            </div>
          )}

          {/* Garment Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={thumbnail}
              alt={`METRONARY ${workingName} garment`}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              priority={priority}
              className={`transition-all duration-400 ease-out group-hover:scale-[1.04] ${
                hasAlpha
                  ? "object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_18px_36px_rgba(232,93,4,0.3)]"
                  : "object-cover rounded-lg"
              }`}
              draggable={false}
            />
          </div>
        </div>
      </Link>

      {/* Product Metadata Header */}
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div>
          <h2
            className="text-sm sm:text-base font-bold uppercase tracking-[0.16em] text-[var(--m-cream)] m-0 transition-colors group-hover:text-[var(--m-gold)]"
            style={{ fontFamily: "var(--m-font-heading)" }}
          >
            <Link href={ROUTES.product(slug)} className="focus:outline-none">
              {workingName}
            </Link>
          </h2>

          {silhouette && (
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] text-[var(--m-ghost)] uppercase mt-1 mb-0">
              {silhouette}
            </p>
          )}
        </div>

        {/* Minimal indicator link */}
        <Link
          href={ROUTES.product(slug)}
          className="text-[10px] tracking-[0.22em] text-[rgba(245,244,238,0.5)] hover:text-[var(--m-gold)] transition-colors uppercase pt-0.5 shrink-0"
          aria-hidden="true"
          tabIndex={-1}
        >
          VIEW →
        </Link>
      </div>
    </article>
  );
}
