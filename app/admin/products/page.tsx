import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Products" };

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wide mb-4">Products</h1>
      <p className="text-[var(--color-brand-mist)]/40 text-sm">Full implementation coming in a later phase.</p>
    </div>
  );
}
