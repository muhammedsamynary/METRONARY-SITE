import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/admin/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { LogoPrimary } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Admin Login — METRONARY",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  // If already authenticated AND authorized as active admin, redirect directly to /admin
  const adminSession = await getAdminAccess();
  if (adminSession) {
    redirect("/admin");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--m-dark)] overflow-hidden">
      {/* Background fiery ambiance */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(232, 93, 4, 0.22) 0%, rgba(107, 26, 0, 0.12) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-8">
          <LogoPrimary
            size={46}
            priority
            className="filter drop-shadow-[0_2px_16px_rgba(232,93,4,0.45)] mb-3"
          />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--m-gold)]">
            METRONARY PORTAL
          </span>
          <h1 className="text-lg font-bold tracking-[0.22em] uppercase text-[var(--m-cream)] mt-1">
            ADMIN ACCESS
          </h1>
        </div>

        {/* Login Panel */}
        <div className="bg-[rgba(22,22,20,0.75)] backdrop-blur-xl border border-[rgba(245,244,238,0.1)] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <AdminLoginForm />
        </div>

        <p className="text-center text-[10px] font-mono tracking-[0.16em] uppercase text-[rgba(245,244,238,0.3)] mt-8">
          AUTHORIZED PERSONNEL ONLY • ENCRYPTED SESSION
        </p>
      </div>
    </div>
  );
}
