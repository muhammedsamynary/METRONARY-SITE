import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSizeGuideById } from "@/lib/admin/size-guides";
import { SizeGuideEditor } from "@/components/admin/SizeGuideEditor";

interface SizeGuideDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SizeGuideDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const guide = await getAdminSizeGuideById(id);
  if (!guide) return { title: "Size Guide Not Found — METRONARY Admin" };

  return {
    title: `Edit ${guide.name} — METRONARY Admin`,
  };
}

export default async function AdminSizeGuideDetailPage({
  params,
}: SizeGuideDetailPageProps) {
  const { id } = await params;
  const guide = await getAdminSizeGuideById(id);

  if (!guide) {
    notFound();
  }

  return <SizeGuideEditor guide={guide} />;
}
