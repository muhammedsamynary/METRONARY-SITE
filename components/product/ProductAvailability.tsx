import React from "react";
import type { StockStatus } from "@/lib/products/types";

interface ProductAvailabilityProps {
  status?: StockStatus;
  className?: string;
}

export function ProductAvailability({
  status = "unknown",
  className = "",
}: ProductAvailabilityProps) {
  // Do not display speculative status if inventory is unknown
  if (!status || status === "unknown") {
    return null;
  }

  const CONFIG_MAP: Record<
    Exclude<StockStatus, "unknown">,
    { label: string; dotClass: string; textClass: string }
  > = {
    in_stock: {
      label: "READY TO SHIP",
      dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
      textClass: "text-emerald-300",
    },
    low_stock: {
      label: "LOW STOCK",
      dotClass: "bg-[var(--m-gold)] shadow-[0_0_8px_rgba(251,133,0,0.6)]",
      textClass: "text-[var(--m-gold)]",
    },
    out_of_stock: {
      label: "OUT OF STOCK",
      dotClass: "bg-rose-500",
      textClass: "text-rose-400 opacity-80",
    },
    unavailable: {
      label: "UNAVAILABLE",
      dotClass: "bg-[var(--m-ash)]",
      textClass: "text-[var(--m-dust)]",
    },
  };

  const config = CONFIG_MAP[status as Exclude<StockStatus, "unknown">];
  if (!config) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono ${config.textClass} ${className}`}
      aria-live="polite"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} aria-hidden="true" />
      <span>{config.label}</span>
    </div>
  );
}
