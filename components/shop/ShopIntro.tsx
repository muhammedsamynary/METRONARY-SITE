import { SectionLabel, TechLabel } from "@/components/ui/Label";

export function ShopIntro() {
  return (
    <div className="pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-[rgba(245,244,238,0.08)] flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <SectionLabel withLine className="text-[10px] sm:text-[11px] tracking-[0.24em]">
            COLLECTION 01
          </SectionLabel>
          <TechLabel className="text-[9px] tracking-[0.2em] opacity-60">
            MTR-26
          </TechLabel>
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.18em] text-[var(--m-cream)] m-0"
          style={{ fontFamily: "var(--m-font-heading)" }}
        >
          SHOP
        </h1>
      </div>

      <div className="text-left md:text-right flex flex-col md:items-end gap-1">
        <p className="m-type-label text-[11px] sm:text-[12px] tracking-[0.22em] text-[var(--m-gold)] m-0">
          BORN IN GIZA, EGYPT
        </p>
        <p className="text-[10px] tracking-[0.2em] text-[var(--m-ghost)] uppercase m-0 opacity-80">
          UNDERGROUND ENERGY // SPATIAL APPAREL
        </p>
      </div>
    </div>
  );
}
