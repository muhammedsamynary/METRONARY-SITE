import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminProductById, getAdminSizeGuides } from "@/lib/admin/products";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) return { title: "Product Not Found — METRONARY Admin" };

  return {
    title: `Edit ${product.displayName} — METRONARY Admin`,
  };
}

export default async function AdminProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const [product, sizeGuides] = await Promise.all([
    getAdminProductById(id),
    getAdminSizeGuides(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full">
      <ProductEditorForm product={product} sizeGuides={sizeGuides} />
    </div>
  );
}
