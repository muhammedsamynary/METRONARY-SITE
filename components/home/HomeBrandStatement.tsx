export function HomeBrandStatement() {
  return (
    <div
      className="absolute top-[88vh] sm:top-[90vh] left-6 sm:left-10 z-[5] pointer-events-none select-none flex flex-col items-start text-left"
      aria-hidden="true"
    >
      <p className="m-type-label text-[10px] sm:text-[11px] tracking-[0.24em] text-[var(--m-cream)] opacity-85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
        BORN IN GIZA, EGYPT
      </p>

      <p className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[var(--m-gold)] opacity-70 mt-1 uppercase drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
        UNDERGROUND ENERGY
      </p>
    </div>
  );
}
