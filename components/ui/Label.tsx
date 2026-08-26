import React from "react";

/* ─── SectionLabel ─────────────────────────────────────────── */

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  withLine?: boolean;
}

/**
 * SectionLabel — editorial category / section identifier.
 * 11px uppercase tracked text with optional warm divider bar.
 *
 * Usage: "New Arrivals", "01 — Featured", "Size Guide"
 */
export function SectionLabel({
  children,
  className = "",
  withLine = false,
}: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {withLine && <span className="m-divider-warm shrink-0" />}
      <span className="m-type-label">{children}</span>
    </div>
  );
}

/* ─── Divider ──────────────────────────────────────────────── */

interface DividerProps {
  className?: string;
  variant?: "muted" | "warm";
}

export function Divider({ className = "", variant = "muted" }: DividerProps) {
  if (variant === "warm") {
    return <span className={`m-divider-warm ${className}`} />;
  }
  return <hr className={`m-divider border-0 ${className}`} />;
}

/* ─── TechLabel ─────────────────────────────────────────────── */

interface TechLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TechLabel — monospace utility text for SKUs, specs, codes.
 */
export function TechLabel({ children, className = "" }: TechLabelProps) {
  return (
    <span className={`m-type-mono ${className}`}>{children}</span>
  );
}
