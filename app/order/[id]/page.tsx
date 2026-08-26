import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your METRONARY order confirmation.",
};

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center px-6">
        <h1 className="text-3xl font-black tracking-widest uppercase text-[var(--color-brand-mist)] mb-4">
          Order Confirmed
        </h1>
        <p className="text-[var(--color-brand-mist)]/40 text-sm">
          Order tracking coming in a later phase.
        </p>
      </div>
    </div>
  );
}
