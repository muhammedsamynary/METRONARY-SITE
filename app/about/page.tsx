import type { Metadata } from "next";
import { MetronaryBackground } from "@/components/background/MetronaryBackground";
import { PRESET_DEFAULT } from "@/lib/theme/gradient.presets";
import { AboutContent } from "@/components/about/AboutContent";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — METRONARY",
  description:
    "The story of METRONARY. Derived from Metro and Nary (ناري) — a fiery metro racing with unstoppable speed. Born in Giza, Egypt.",
  openGraph: {
    title: "About — METRONARY",
    description:
      "Derived from Metro and Nary (ناري) — a fiery metro racing with unstoppable speed. Born in Giza, Egypt.",
    url: `${SITE.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <MetronaryBackground
      theme={PRESET_DEFAULT}
      className="w-full min-h-screen flex flex-col pt-16 sm:pt-20"
    >
      <AboutContent />
    </MetronaryBackground>
  );
}
