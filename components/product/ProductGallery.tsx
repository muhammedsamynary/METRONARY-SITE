"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  hasAlpha?: boolean;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  hasAlpha = true,
  className = "",
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Guarantee at least 1 image is safe to reference
  const safeImages = images && images.length > 0 ? images : ["/products/fearless.png"];
  const currentImage = safeImages[activeIndex] ?? safeImages[0];
  const hasMultipleImages = safeImages.length > 1;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* ── Main Garment Showcase ── */}
      <div
        className="relative w-full max-w-[560px] aspect-square flex items-center justify-center select-none"
        aria-label={`Product showcase for ${productName}`}
      >
        <Image
          src={currentImage}
          alt={`${productName} view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 560px"
          className={`transition-all duration-500 ease-out ${
            hasAlpha
              ? "object-contain filter drop-shadow-[0_28px_56px_rgba(0,0,0,0.68)] hover:drop-shadow-[0_36px_72px_rgba(232,93,4,0.38)]"
              : "object-cover rounded-2xl border border-[rgba(245,244,238,0.1)] shadow-[0_24px_56px_rgba(0,0,0,0.65)]"
          }`}
          draggable={false}
        />
      </div>

      {/* ── Discrete Thumbnail Navigation (Only when multiple REAL images exist) ── */}
      {hasMultipleImages && (
        <div
          className="flex items-center gap-3 mt-6 sm:absolute sm:bottom-4 sm:left-4 z-20"
          role="tablist"
          aria-label="Product image gallery thumbnails"
        >
          {safeImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={img + idx}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`View angle ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(idx);
                  }
                }}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] ${
                  isActive
                    ? "border-[var(--m-gold)] shadow-[0_0_12px_rgba(251,133,0,0.5)] scale-105"
                    : "border-[rgba(245,244,238,0.15)] opacity-60 hover:opacity-100 hover:border-[rgba(245,244,238,0.4)]"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
