import type { Metadata } from "next";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { CheckoutView } from "@/components/checkout";
import { getActiveDeliveryOptions } from "@/lib/orders/delivery-options";

export const metadata: Metadata = {
  title: "Checkout | METRONARY",
  description: "Complete your METRONARY Cash on Delivery order.",
};

export default async function CheckoutPage() {
  const deliveryOptions = await getActiveDeliveryOptions();

  return (
    <MetronaryBackground className="w-full min-h-screen flex flex-col">
      <CheckoutView deliveryOptions={deliveryOptions} />
    </MetronaryBackground>
  );
}
