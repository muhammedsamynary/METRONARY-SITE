import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/lib/admin/orders";
import { OrderDetailManager } from "@/components/admin/OrderDetailManager";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) return { title: "Order Not Found — METRONARY Admin" };

  return {
    title: `Order ${order.orderNumber} — METRONARY Admin`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailManager order={order} />;
}
