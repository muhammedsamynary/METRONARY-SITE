"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { SizeGuide } from "@/lib/products/types";

interface SizeGuideModalProps {
  guide: SizeGuide;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

// React 18/19 safe client mounting hook without cascading render side-effects
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

export function SizeGuideModal({
  guide,
  isOpen,
  onClose,
  triggerRef,
}: SizeGuideModalProps) {
  const isClient = useIsClient();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll and manage keyboard events (Escape key & Focus trapping)
  useEffect(() => {
    if (!isOpen) return;

    const triggerEl = triggerRef?.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on modal open
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus to trigger button
      triggerEl?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !isClient) return null;

  const { name, unit, columns, rows } = guide;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      {/* ── Modal Dialog Container (Click inside does not close) ── */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[rgba(17,14,9,0.95)] border border-[rgba(245,244,238,0.14)] rounded-2xl p-6 sm:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.85)] text-left select-none transition-transform duration-300 animate-scaleUp"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[rgba(245,244,238,0.1)]">
          <div className="flex flex-col gap-1">
            <h2
              id="size-guide-title"
              className="text-lg sm:text-xl font-bold tracking-[0.16em] uppercase text-[var(--m-cream)]"
            >
              SIZE GUIDE
            </h2>
            <span className="text-[10px] tracking-[0.2em] font-mono text-[var(--m-gold)] uppercase">
              {`${name} • UNIT: ${unit}`}
            </span>
          </div>

          {/* Close Button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="p-2 -mr-2 text-[rgba(245,244,238,0.6)] hover:text-[var(--m-gold)] hover:bg-[rgba(245,244,238,0.06)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-gold)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Dynamic Measurement Table ── */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-[12px] font-mono border-collapse">
            <thead>
              <tr className="border-b border-[rgba(245,244,238,0.12)] text-[rgba(245,244,238,0.5)]">
                <th className="py-3 px-3 font-semibold tracking-widest uppercase">
                  SIZE
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-3 font-semibold tracking-widest uppercase text-right"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.size + idx}
                  className="border-b border-[rgba(245,244,238,0.06)] last:border-b-0 hover:bg-[rgba(245,244,238,0.02)] transition-colors"
                >
                  <td className="py-3.5 px-3 font-bold text-[var(--m-gold)]">
                    {row.size}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="py-3.5 px-3 text-right text-[var(--m-cream)]"
                    >
                      {row.values[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
