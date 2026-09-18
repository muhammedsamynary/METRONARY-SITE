"use client";

import React, { useState, useEffect } from "react";

/**
 * ─── MINIMAL HOMEPAGE SCROLL-DOWN INDICATOR ───
 *
 * Subtle animated cue indicating more content below.
 * Automatically fades out smoothly once the user begins scrolling.
 * Automatically respects prefers-reduced-motion.
 */
export function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-hidden="true"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none transition-all duration-500 ${
        visible ? "opacity-75 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-[var(--m-gold)] drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          EXPLORE
        </span>
        <div className="w-[1.5px] h-6 bg-gradient-to-b from-[var(--m-gold)] via-[var(--m-orange)] to-transparent animate-bounce" />
      </div>
    </aside>
  );
}
