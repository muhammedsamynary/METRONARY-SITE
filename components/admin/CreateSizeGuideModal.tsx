"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSizeGuideAction,
  type CreateSizeGuideActionState,
} from "@/app/admin/(protected)/size-guides/[id]/actions";

export function CreateSizeGuideModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction, isPending] = useActionState<
    CreateSizeGuideActionState,
    FormData
  >(createSizeGuideAction, { success: false });

  // On successful creation, navigate to the new guide's dynamic editor
  useEffect(() => {
    if (state.success && state.guideId) {
      router.push(`/admin/size-guides/${state.guideId}`);
    }
  }, [state.success, state.guideId, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] transition-all shadow-[0_0_12px_rgba(251,133,0,0.25)] flex items-center gap-1.5 self-start sm:self-auto"
      >
        <span>+ CREATE SIZE GUIDE</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[rgba(24,24,20,0.98)] border border-[rgba(251,133,0,0.35)] shadow-[0_16px_48px_rgba(0,0,0,0.9)] flex flex-col gap-6 font-mono text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--m-gold)] shadow-[0_0_8px_rgba(251,133,0,0.6)]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--m-gold)]">
                  CREATE NEW SIZE GUIDE
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="text-[rgba(245,244,238,0.5)] hover:text-[var(--m-cream)] uppercase text-[10px] transition-colors"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Error Notifications */}
            {state.error && !state.success && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex flex-col gap-1">
                <p className="font-bold">{state.error}</p>
              </div>
            )}

            {/* Creation Form */}
            <form action={formAction} className="flex flex-col gap-5">
              {/* Guide Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="create-guide-name"
                  className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.7)]"
                >
                  Size Guide Name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="create-guide-name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. OVERSIZED T-SHIRT SIZE GUIDE"
                  className="px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.14)] text-xs text-[var(--m-cream)] uppercase focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                />
                {state.fieldErrors?.name && (
                  <p className="text-[10px] text-rose-400">{state.fieldErrors.name}</p>
                )}
                <span className="text-[10px] text-[rgba(245,244,238,0.35)]">
                  Descriptive internal name for this sizing matrix.
                </span>
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="create-guide-unit"
                  className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.7)]"
                >
                  Measurement Unit <span className="text-amber-400">*</span>
                </label>
                <input
                  id="create-guide-unit"
                  name="unit"
                  type="text"
                  required
                  maxLength={20}
                  defaultValue="CM"
                  placeholder="e.g. CM or IN"
                  className="px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.14)] text-xs text-[var(--m-cream)] uppercase focus:border-[var(--m-gold)] focus:outline-none transition-colors"
                />
                {state.fieldErrors?.unit && (
                  <p className="text-[10px] text-rose-400">{state.fieldErrors.unit}</p>
                )}
                <span className="text-[10px] text-[rgba(245,244,238,0.35)]">
                  Standard unit displayed on the storefront size chart (e.g. CM, IN).
                </span>
              </div>

              {/* Optional Notes */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="create-guide-notes"
                  className="text-[10px] uppercase tracking-wider text-[rgba(245,244,238,0.7)]"
                >
                  Tailoring & Fit Notes (Optional)
                </label>
                <textarea
                  id="create-guide-notes"
                  name="notes"
                  rows={3}
                  maxLength={1000}
                  placeholder="e.g. All measurements taken flat across the garment in CM."
                  className="px-3.5 py-2.5 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.14)] text-xs text-[rgba(245,244,238,0.85)] focus:border-[var(--m-gold)] focus:outline-none transition-colors leading-relaxed"
                />
                {state.fieldErrors?.notes && (
                  <p className="text-[10px] text-rose-400">{state.fieldErrors.notes}</p>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(245,244,238,0.08)]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_rgba(251,133,0,0.25)]"
                >
                  {isPending ? "CREATING GUIDE..." : "CREATE SIZE GUIDE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
