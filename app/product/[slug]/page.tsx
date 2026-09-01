import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getCatalogProducts } from "@/lib/data/products";
import { getProductHoverTheme } from "@/lib/theme/gradient.presets";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import {
  ProductGallery,
  ProductInfoPanel,
  ProductBackLink,
} from "@/components/product";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-render all 10 product routes at build time
 */
export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

/**
 * Dynamic SEO metadata per product
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | METRONARY",
      description: "The requested METRONARY piece could not be found.",
    };
  }

  const name = product.officialName ?? product.workingName;

  return {
    title: `${name} | METRONARY`,
    description:
      product.description ??
      `METRONARY ${name} — High-concept streetwear designed in Giza, Egypt.`,
    openGraph: {
      title: `${name} | METRONARY`,
      description:
        product.description ??
        `METRONARY ${name} — High-concept streetwear designed in Giza, Egypt.`,
      images: [
        {
          url: product.thumbnail,
          alt: `METRONARY ${name}`,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Load tailored product heat gradient theme
  const productTheme = getProductHoverTheme(slug);
  const displayName = product.officialName ?? product.workingName;

  return (
    /* ── Full-Bleed Viewport Background (100% edge-to-edge, zero black gutters) ── */
    <MetronaryBackground
      theme={productTheme}
      className="w-full min-h-screen flex flex-col"
    >
      {/* ── Inner Content Container (Controlled Max-Width & Generous Editorial Margins) ── */}
      <div className="w-full min-h-screen flex flex-col pt-20 sm:pt-24 pb-16 px-6 sm:px-12 max-w-[1440px] mx-auto">
        {/* ── Editorial Top Navigation ── */}
        <div className="w-full mb-6 sm:mb-8">
          <ProductBackLink />
        </div>

        {/* ── Spatial PDP Stage (Desktop Asymmetric Split / Responsive Stack) ── */}
        <main
          className="w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 my-auto"
          aria-label={`${displayName} details`}
        >
          {/* ── Center/Left: Dominant Garment Showcase ── */}
          <div className="w-full lg:w-[58%] flex items-center justify-center">
            <ProductGallery
              images={product.images}
              productName={displayName}
              hasAlpha={product.hasAlpha}
              className="w-full"
            />
          </div>

          {/* ── Right: Translucent Glass Info & Action Panel ── */}
          <div className="w-full lg:w-[42%] flex items-center justify-center lg:justify-end">
            <ProductInfoPanel product={product} />
          </div>
        </main>
      </div>
    </MetronaryBackground>
  );
}
