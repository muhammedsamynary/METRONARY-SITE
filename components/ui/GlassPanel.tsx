import React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Use warm variant (subtle orange border tint) for product UI surfaces */
  variant?: "default" | "warm";
  as?: React.ElementType;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * GlassPanel — translucent container that lets the fiery background
 * remain visible through the UI.
 *
 * The backdrop blur allows the gradient engine to shine through.
 * Keep content sparse — the background is part of the design.
 */
export function GlassPanel({
  children,
  className = "",
  variant = "default",
  as: Tag = "div",
  id,
  style,
}: GlassPanelProps) {
  const cls = variant === "warm" ? "m-glass-warm" : "m-glass-panel";
  return (
    <Tag id={id} className={`${cls} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
