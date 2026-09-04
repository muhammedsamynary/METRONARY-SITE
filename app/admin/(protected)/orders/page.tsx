import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Orders" };

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wide mb-4">Orders</h1>
      <p className="text-[var(--m-mist)]/40 text-sm">
        Full implementation coming in a later phase.
      </p>
    </div>
  );
}
