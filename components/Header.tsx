import Link from "next/link";
import { LogoPrimary, Wordmark } from "@/components/brand/Logo";
import { ROUTES } from "@/lib/constants";
import { CartTrigger } from "@/components/cart/CartTrigger";

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 w-full bg-[rgba(10,8,5,0.72)] backdrop-blur-xl border-b border-white/[0.08] transition-colors duration-300"
      style={{
        zIndex: "var(--m-z-header)",
        WebkitBackdropFilter: "blur(20px)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-[var(--m-content-max)] mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Primary Blaze Metro Mark + Wordmark */}
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-md py-1"
          aria-label="METRONARY home"
        >
          <LogoPrimary
            size={34}
            priority
            className="filter drop-shadow-[0_2px_12px_rgba(232,93,4,0.45)] transition-transform duration-300 group-hover:scale-105 sm:w-[38px] sm:h-[38px]"
          />
          <Wordmark size="sm" className="tracking-[0.22em] sm:tracking-[0.24em] opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] text-xs sm:text-sm" />
        </Link>

        {/* Minimal Navigation: SHOP, ABOUT */}
        <nav aria-label="Main navigation" className="flex items-center">
          <ul className="flex items-center gap-4 sm:gap-8 list-none m-0 p-0">
            <li>
              <Link
                href={ROUTES.shop}
                className="m-type-label text-[rgba(245,244,238,0.85)] hover:text-[var(--m-gold)] transition-colors py-2 px-1 text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.22em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)] min-h-[44px] flex items-center"
                style={{ transitionDuration: "var(--m-dur-base)" }}
              >
                SHOP
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.about}
                className="m-type-label text-[rgba(245,244,238,0.85)] hover:text-[var(--m-gold)] transition-colors py-2 px-1 text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.22em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)] min-h-[44px] flex items-center"
                style={{ transitionDuration: "var(--m-dur-base)" }}
              >
                ABOUT
              </Link>
            </li>
          </ul>
        </nav>

        {/* Dynamic Cart Trigger & Floating Mini-Cart */}
        <CartTrigger />
      </div>
    </header>
  );
}
