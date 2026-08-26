"use client";

import { useEffect, useRef } from "react";

interface ParallaxOptions {
  sensitivity?: number;
  maxOffset?: number;
  disabled?: boolean;
}

/**
 * useProductParallax — High-performance desktop pointer parallax.
 *
 * Uses requestAnimationFrame with linear interpolation (lerp) to update
 * CSS custom properties on the container element without triggering
 * React component re-renders on mousemove.
 *
 * Automatically disabled on touch screens and when prefers-reduced-motion is active.
 */
export function useProductParallax({
  sensitivity = 1,
  maxOffset = 16,
  disabled = false,
}: ParallaxOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    // Check pointer capability and user motion preference
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;
    let isMoving = false;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateParallax = () => {
      // Smooth dampening towards target
      currentX = lerp(currentX, targetX, 0.075);
      currentY = lerp(currentY, targetY, 0.075);

      const px = (currentX * maxOffset * sensitivity).toFixed(2);
      const py = (currentY * maxOffset * sensitivity).toFixed(2);

      el.style.setProperty("--m-parallax-x", `${px}px`);
      el.style.setProperty("--m-parallax-y", `${py}px`);

      const delta = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
      if (delta > 0.001 || isMoving) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMoving = true;
      const { innerWidth, innerHeight } = window;
      // Normalize pointer coordinate between -1.0 and 1.0 from center
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;

      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    const handleMouseLeave = () => {
      isMoving = false;
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
      if (el) {
        el.style.removeProperty("--m-parallax-x");
        el.style.removeProperty("--m-parallax-y");
      }
    };
  }, [disabled, sensitivity, maxOffset]);

  return containerRef;
}
