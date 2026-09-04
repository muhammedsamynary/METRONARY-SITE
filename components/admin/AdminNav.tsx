"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  exact: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "DASHBOARD", exact: true },
  { href: "/admin/products", label: "PRODUCTS", exact: false },
  { href: "/admin/size-guides", label: "SIZE GUIDES", exact: false },
  { href: "/admin/orders", label: "ORDERS", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 lg:gap-8 text-xs font-mono tracking-[0.18em] uppercase">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`py-1 relative transition-colors duration-150 ${
              isActive
                ? "text-[var(--m-gold)] font-semibold"
                : "text-[rgba(245,244,238,0.65)] hover:text-[var(--m-cream)]"
            }`}
          >
            {item.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--m-gold)] rounded-full shadow-[0_0_8px_rgba(251,133,0,0.6)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
