import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
  description: "METRONARY product detail page.",
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // params is a Promise in Next.js 15 — resolve in a later phase with proper async/await
  void params;
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center px-6">
        <h1 className="text-3xl font-black tracking-widest uppercase text-[var(--color-brand-mist)] mb-4">
          Product Detail
        </h1>
        <p className="text-[var(--color-brand-mist)]/40 text-sm">
          Dynamic PDP coming in a later phase.
        </p>
      </div>
    </div>
  );
}
