import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[var(--color-brand-dark)] px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <p className="font-bold tracking-widest text-sm uppercase text-[var(--color-brand-mist)] mb-2">
            METRONARY
          </p>
          <p className="text-xs text-[var(--color-brand-mist)]/50 leading-relaxed max-w-xs">
            {SITE.tagline}
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer navigation">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-mist)]/40 mb-3">
            Navigate
          </p>
          <ul className="space-y-2 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--color-brand-mist)]/60 hover:text-[var(--color-brand-fire)] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-mist)]/40 mb-3">
            Contact
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="text-sm text-[var(--color-brand-mist)]/60 hover:text-[var(--color-brand-fire)] transition-colors duration-200"
          >
            {SITE.email}
          </a>
          {SITE.social.instagram && (
            <div className="mt-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-brand-mist)]/60 hover:text-[var(--color-brand-fire)] transition-colors duration-200"
              >
                Instagram ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-[var(--color-brand-mist)]/30">
          © {year} METRONARY. All rights reserved.
        </p>
        <p className="text-xs text-[var(--color-brand-mist)]/20">Giza, Egypt</p>
      </div>
    </footer>
  );
}
