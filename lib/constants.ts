/**
 * METRONARY — Site-wide constants
 */

export const SITE = {
  name: "METRONARY",
  tagline: "Underground Energy. Wearable Fire.",
  description:
    "METRONARY is a streetwear label born in Giza, Egypt, inspired by the fast-paced energy of an underground metro with bold graphic design.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://metronary.com",
  email: "hello@metronary.com",
  social: {
    instagram: "https://www.instagram.com/metronary",
  },
} as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const CURRENCY = {
  code: "EGP",
  symbol: "LE",
  locale: "ar-EG",
} as const;

/** Format a price (stored in whole pounds) for display */
export function formatPrice(amount: number): string {
  return `${CURRENCY.symbol} ${amount.toLocaleString("en-EG")}`;
}

export const ROUTES = {
  home: "/",
  shop: "/",
  product: (slug: string) => `/product/${slug}`,
  about: "/about",
  contact: "/contact",
  checkout: "/checkout",
  order: (id: string) => `/order/${id}`,
  admin: {
    root: "/admin",
    products: "/admin/products",
    sizeGuides: "/admin/size-guides",
    orders: "/admin/orders",
  },
} as const;

/** Seed product slugs — temporary, replaced by DB in later phases */
export const SEED_PRODUCT_SLUGS = [
  "1973",
  "fearless",
  "old-boy",
  "look-at-sky",
  "time",
  "decorarive",
] as const;
