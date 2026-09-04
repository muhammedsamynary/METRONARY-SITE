import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import { CartProvider } from "@/components/cart/CartProvider";
import { SITE } from "@/lib/constants";

const inter = {
  variable: "font-sans",
};

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["streetwear", "Giza", "Egypt", "underground", "metronary", "graphic tees", "fashion"],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: "var(--m-dark)",
          color: "var(--m-mist)",
          fontFamily: "var(--m-font-body)",
        }}
      >
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
