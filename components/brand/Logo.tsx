import Image from "next/image";

interface LogoPrimaryProps {
  /** Width in px */
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * PRIMARY LOGO — fiery underground / blaze metro graphic.
 *
 * Used as the main brand identity on:
 * - Header navigation (leading brand mark)
 * - Hero sections
 * - Large feature placements
 * - Loading screens
 *
 * Do NOT redesign, recolor, or replace this asset.
 */
export function LogoPrimary({
  size = 40,
  className = "",
  priority = false,
}: LogoPrimaryProps) {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/primary-blaze-mark.png"
        alt="METRONARY Primary Blaze Mark"
        fill
        className="object-contain"
        priority={priority}
        sizes={`${size}px`}
        draggable={false}
      />
    </div>
  );
}

interface LogoSecondaryProps {
  /** Width in px */
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * SECONDARY LOGO — oval Metronary script emblem.
 *
 * Used:
 * - Watermarks
 * - Supporting secondary brand marks
 * - Favicon reference
 *
 * Do NOT use both marks simultaneously in the same view.
 */
export function LogoSecondary({
  size = 40,
  className = "",
  priority = false,
}: LogoSecondaryProps) {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo-oval-emblem-1.jpeg"
        alt="METRONARY Oval Emblem"
        fill
        className="object-contain rounded-full"
        priority={priority}
        sizes={`${size}px`}
        draggable={false}
      />
    </div>
  );
}

/**
 * WORDMARK — text-only METRONARY brand name.
 * Uses the design system display token.
 */
interface WordmarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const wordmarkSizeMap: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-xs tracking-[0.22em]",
  md: "text-sm tracking-[0.24em]",
  lg: "text-lg tracking-[0.26em]",
  xl: "text-2xl tracking-[0.28em]",
};

export function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  return (
    <span
      className={`font-black uppercase ${wordmarkSizeMap[size]} text-[var(--m-cream)] ${className}`}
      style={{ fontFamily: "var(--m-font-heading)" }}
    >
      METRONARY
    </span>
  );
}
