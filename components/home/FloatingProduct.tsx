import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { FloatingProductData } from "./types";
import { ROUTES } from "@/lib/constants";

interface FloatingProductProps {
  product: FloatingProductData;
  onHover?: (slug: string | null) => void;
}

const SHADOW_MAP = {
  foreground:
    "drop-shadow-[0_22px_44px_rgba(0,0,0,0.68)] group-hover:drop-shadow-[0_28px_56px_rgba(232,93,4,0.38)] group-focus-visible:drop-shadow-[0_28px_56px_rgba(232,93,4,0.38)]",
  midground:
    "drop-shadow-[0_12px_28px_rgba(0,0,0,0.52)] group-hover:drop-shadow-[0_18px_38px_rgba(232,93,4,0.32)] group-focus-visible:drop-shadow-[0_18px_38px_rgba(232,93,4,0.32)]",
  background:
    "drop-shadow-[0_6px_16px_rgba(0,0,0,0.38)] group-hover:drop-shadow-[0_10px_24px_rgba(232,93,4,0.24)] group-focus-visible:drop-shadow-[0_10px_24px_rgba(232,93,4,0.24)]",
};

export function FloatingProduct({ product, onHover }: FloatingProductProps) {
  const {
    slug,
    name,
    image,
    alt,
    layout,
    isFocal,
    priority,
    hasAlpha = true,
    depthTier = "midground",
    depthFactor = 1,
    idleClass,
  } = product;
  const { desktop, tablet, mobile } = layout;

  // Build responsive CSS custom properties
  const styleVars: Record<string, string | number> = {
    // Desktop base
    "--m-pos-top": desktop.top ?? "auto",
    "--m-pos-bottom": desktop.bottom ?? "auto",
    "--m-pos-left": desktop.left ?? "auto",
    "--m-pos-right": desktop.right ?? "auto",
    "--m-pos-width": desktop.width,
    "--m-pos-max-width": desktop.maxWidth ?? "none",
    "--m-pos-z": desktop.zIndex ?? 10,
    "--m-pos-rot": `${desktop.rotation ?? 0}deg`,
    "--m-pos-display": desktop.hidden ? "none" : "block",
    "--m-depth": depthFactor,
  };

  if (tablet) {
    styleVars["--m-tab-top"] = tablet.top ?? "auto";
    styleVars["--m-tab-bottom"] = tablet.bottom ?? "auto";
    styleVars["--m-tab-left"] = tablet.left ?? "auto";
    styleVars["--m-tab-right"] = tablet.right ?? "auto";
    styleVars["--m-tab-width"] = tablet.width;
    if (tablet.maxWidth) styleVars["--m-tab-max-width"] = tablet.maxWidth;
    if (tablet.zIndex !== undefined) styleVars["--m-tab-z"] = tablet.zIndex;
    if (tablet.rotation !== undefined) styleVars["--m-tab-rot"] = `${tablet.rotation}deg`;
    if (tablet.hidden !== undefined) styleVars["--m-tab-display"] = tablet.hidden ? "none" : "block";
  }

  if (mobile) {
    styleVars["--m-mob-top"] = mobile.top ?? "auto";
    styleVars["--m-mob-bottom"] = mobile.bottom ?? "auto";
    styleVars["--m-mob-left"] = mobile.left ?? "auto";
    styleVars["--m-mob-right"] = mobile.right ?? "auto";
    styleVars["--m-mob-width"] = mobile.width;
    if (mobile.maxWidth) styleVars["--m-mob-max-width"] = mobile.maxWidth;
    if (mobile.zIndex !== undefined) styleVars["--m-mob-z"] = mobile.zIndex;
    if (mobile.rotation !== undefined) styleVars["--m-mob-rot"] = `${mobile.rotation}deg`;
    if (mobile.hidden !== undefined) styleVars["--m-mob-display"] = mobile.hidden ? "none" : "block";
  }

  const shadowClasses = SHADOW_MAP[depthTier] ?? SHADOW_MAP.midground;

  return (
    <div
      className="m-floating-product pointer-events-auto select-none group"
      style={styleVars as React.CSSProperties}
    >
      {/* ── Parallax & Idle Motion Composition Wrapper ── */}
      <div className={`m-parallax-item ${idleClass ?? ""} w-full h-full`}>
        <Link
          href={ROUTES.product(slug)}
          className="block relative w-full h-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--m-dark)] rounded-xl transition-all duration-300 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] group-active:scale-[0.98]"
          aria-label={`View ${name}`}
          onMouseEnter={() => onHover?.(slug)}
          onMouseLeave={() => onHover?.(null)}
          onFocus={() => onHover?.(slug)}
          onBlur={() => onHover?.(null)}
        >
          {/* Garment Image Container */}
          <div
            className={`relative w-full flex items-center justify-center ${
              hasAlpha
                ? ""
                : "rounded-2xl overflow-hidden border border-[rgba(245,244,238,0.1)] shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
            }`}
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image
              src={image}
              alt={alt}
              fill
              sizes={
                isFocal
                  ? "(max-width: 768px) 75vw, (max-width: 1200px) 40vw, 420px"
                  : "(max-width: 768px) 48vw, (max-width: 1200px) 28vw, 340px"
              }
              priority={priority || isFocal}
              className={`transition-all duration-300 ${
                hasAlpha
                  ? `object-contain filter ${shadowClasses}`
                  : "object-cover group-hover:scale-105"
              }`}
              draggable={false}
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
