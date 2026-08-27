import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function ProductBackLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href={ROUTES.home}
      className={`inline-flex items-center gap-2 m-type-label text-[11px] tracking-[0.22em] text-[rgba(245,244,238,0.75)] hover:text-[var(--m-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-md px-2 py-1 -ml-2 select-none group ${className}`}
      aria-label="Back to collection"
      style={{ transitionDuration: "var(--m-dur-base)" }}
    >
      <span
        className="transition-transform duration-300 group-hover:-translate-x-1"
        aria-hidden="true"
      >
        ←
      </span>
      <span>COLLECTION</span>
    </Link>
  );
}
