"use client";

import React from "react";
import type { SizeGuide } from "@/lib/products/types";

interface SizeGuideTriggerProps {
  guide?: SizeGuide | null;
  onOpen: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  className?: string;
}

export function SizeGuideTrigger({
  guide,
  onOpen,
  triggerRef,
  className = "",
}: SizeGuideTriggerProps) {
  // If no confirmed size guide is assigned to this product, omit trigger cleanly
  if (!guide) return null;

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onOpen}
      className={`inline-flex items-center text-[10px] tracking-[0.2em] font-mono uppercase text-[rgba(245,244,238,0.55)] hover:text-[var(--m-gold)] underline underline-offset-4 decoration-[rgba(245,244,238,0.2)] hover:decoration-[var(--m-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded py-0.5 px-1 -mr-1 cursor-pointer select-none ${className}`}
      aria-label={`Open ${guide.name}`}
    >
      SIZE GUIDE
    </button>
  );
}
