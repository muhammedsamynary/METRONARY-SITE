"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Route-Aware Storefront Header
 *
 * Excludes customer navigation, branding header, and bag trigger on all `/admin/*` routes.
 */
export function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Header />;
}

/**
 * Route-Aware Storefront Footer
 *
 * Excludes customer storefront footer on all `/admin/*` routes.
 */
export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}
