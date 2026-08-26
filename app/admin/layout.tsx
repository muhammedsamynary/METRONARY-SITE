export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-brand-charcoal)] text-[var(--color-brand-mist)]">
      {/* Admin nav — wired up in later phase */}
      <div className="border-b border-white/10 px-6 py-3 flex gap-6 text-xs uppercase tracking-widest">
        <a href="/admin" className="hover:text-[var(--color-brand-fire)]">Dashboard</a>
        <a href="/admin/products" className="hover:text-[var(--color-brand-fire)]">Products</a>
        <a href="/admin/size-guides" className="hover:text-[var(--color-brand-fire)]">Size Guides</a>
        <a href="/admin/orders" className="hover:text-[var(--color-brand-fire)]">Orders</a>
      </div>
      <main className="p-6">{children}</main>
    </div>
  );
}
