import Link from "next/link";
import { LogoPrimary, Wordmark } from "@/components/brand/Logo";
import { ROUTES } from "@/lib/constants";

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 bg-transparent pointer-events-none"
      style={{ zIndex: "var(--m-z-header)" }}
    >
      <div className="max-w-[var(--m-content-max)] mx-auto px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between pointer-events-auto">
        {/* Primary Blaze Metro Mark + Wordmark */}
        <Link
          href={ROUTES.home}
          className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-md"
          aria-label="METRONARY home"
        >
          <LogoPrimary
            size={38}
            priority
            className="filter drop-shadow-[0_2px_12px_rgba(232,93,4,0.45)] transition-transform duration-300 group-hover:scale-105"
          />
          <Wordmark size="sm" className="tracking-[0.24em] opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]" />
        </Link>

        {/* Minimal Navigation: SHOP, ABOUT */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6 sm:gap-10 list-none m-0 p-0">
            <li>
              <Link
                href={ROUTES.shop}
                className="m-type-label text-[rgba(245,244,238,0.85)] hover:text-[var(--m-gold)] transition-colors py-2 text-[11px] tracking-[0.22em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]"
                style={{ transitionDuration: "var(--m-dur-base)" }}
              >
                SHOP
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.about}
                className="m-type-label text-[rgba(245,244,238,0.85)] hover:text-[var(--m-gold)] transition-colors py-2 text-[11px] tracking-[0.22em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]"
                style={{ transitionDuration: "var(--m-dur-base)" }}
              >
                ABOUT
              </Link>
            </li>
          </ul>
        </nav>

        {/* Minimal Cart Indicator */}
        <button
          id="cart-toggle"
          aria-label="Open cart"
          className="text-[rgba(245,244,238,0.85)] hover:text-[var(--m-gold)] transition-colors p-2 min-w-[40px] min-h-[40px] flex items-center justify-center -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-md drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]"
          style={{ transitionDuration: "var(--m-dur-base)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}
