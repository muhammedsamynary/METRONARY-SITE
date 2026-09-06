import type { Metadata } from "next";
import { getAdminDeliveryZones } from "@/lib/admin/delivery";
import { DeliveryZoneManager } from "@/components/admin/DeliveryZoneManager";

export const metadata: Metadata = {
  title: "Delivery Zones — METRONARY Admin",
};

export default async function AdminDeliveryPage() {
  const { zones, stats } = await getAdminDeliveryZones();

  return <DeliveryZoneManager zones={zones} stats={stats} />;
}
