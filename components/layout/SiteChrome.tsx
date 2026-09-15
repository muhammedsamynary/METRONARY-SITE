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

  // On admin routes and homepage (which embeds Footer into its Home -> Footer -> About flow), exclude global footer
  if (pathname.startsWith("/admin") || pathname === "/") {
    return null;
  }

  return <Footer />;
}
