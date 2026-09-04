import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminAccess } from "@/lib/admin/auth";
import { LogoPrimary } from "@/components/brand/Logo";
import { logoutAdmin } from "@/app/admin/login/actions";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative server-side authorization check
  const adminSession = await getAdminAccess();

  if (!adminSession) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--m-dark)] text-[var(--m-mist)]">
      {/* Primary Dedicated Admin Header (Single Bar) */}
      <header className="sticky top-0 z-40 border-b border-[rgba(245,244,238,0.08)] bg-[rgba(16,16,14,0.92)] backdrop-blur-md">
        <div className="max-w-[1536px] mx-auto px-5 sm:px-8 h-[74px] flex items-center justify-between gap-6">
          {/* Left: Brand Lockup */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)] rounded-md"
              aria-label="METRONARY Admin Dashboard"
            >
              <LogoPrimary
                size={34}
                priority
                className="filter drop-shadow-[0_2px_10px_rgba(232,93,4,0.4)] transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-sm font-bold tracking-[0.24em] text-[var(--m-cream)] uppercase">
                  METRONARY
                </span>
                <span className="text-xs font-semibold tracking-[0.22em] text-[var(--m-gold)] uppercase">
                  ADMIN
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Center/Left-Center) */}
            <div className="hidden md:block pl-4 border-l border-[rgba(245,244,238,0.1)]">
              <AdminNav />
            </div>
          </div>

          {/* Right: Admin Identity & Logout Action */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="hidden lg:inline text-[rgba(245,244,238,0.7)] text-[11px] truncate max-w-[160px]">
                {adminSession.name || adminSession.email || "Admin"}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-semibold bg-[rgba(251,133,0,0.12)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)]">
                {adminSession.role}
              </span>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg border border-[rgba(245,244,238,0.14)] bg-[rgba(0,0,0,0.35)] hover:bg-red-950/30 hover:border-red-500/40 text-[rgba(245,244,238,0.7)] hover:text-red-300 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors cursor-pointer"
              >
                LOG OUT
              </button>
            </form>
          </div>
        </div>

        {/* Mobile/Tablet Subnav Row */}
        <div className="md:hidden border-t border-[rgba(245,244,238,0.06)] bg-[rgba(13,13,11,0.95)] px-5 py-2.5 overflow-x-auto scrollbar-none">
          <AdminNav />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-[1536px] w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
