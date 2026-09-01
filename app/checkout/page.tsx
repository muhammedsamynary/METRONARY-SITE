import type { Metadata } from "next";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { CheckoutView } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Checkout | METRONARY",
  description: "Complete your METRONARY Cash on Delivery order.",
};

export default function CheckoutPage() {
  return (
    <MetronaryBackground className="w-full min-h-screen flex flex-col">
      <CheckoutView />
    </MetronaryBackground>
  );
}
