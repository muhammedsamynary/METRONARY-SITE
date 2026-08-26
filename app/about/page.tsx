import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind METRONARY.",
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center px-6">
        <h1 className="text-3xl font-black tracking-widest uppercase text-[var(--color-brand-mist)] mb-4">
          About
        </h1>
        <p className="text-[var(--color-brand-mist)]/40 text-sm">
          Coming in a later phase.
        </p>
      </div>
    </div>
  );
}
