"use client";

import { useState, useActionState } from "react";
import type { AdminDeliveryZoneItem, AdminDeliveryStats } from "@/lib/admin/delivery";
import { formatDeliveryFeeEgp } from "@/lib/admin/delivery-utils";
import {
  createDeliveryZoneAction,
  updateDeliveryZoneAction,
  type DeliveryActionState,
} from "@/app/admin/(protected)/delivery/actions";

interface DeliveryZoneManagerProps {
  zones: AdminDeliveryZoneItem[];
  stats: AdminDeliveryStats;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function DeliveryZoneManager({ zones, stats }: DeliveryZoneManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingZone, setEditingZone] = useState<AdminDeliveryZoneItem | null>(null);

  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-[var(--m-cream)]">
              DELIVERY
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              COD CONFIGURATION
            </span>
          </div>
          <p className="font-mono text-xs text-[rgba(245,244,238,0.5)] mt-1">
            Configure METRONARY delivery areas and Cash on Delivery fees.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setShowCreateModal(true);
              setEditingZone(null);
            }}
            className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(251,133,0,0.25)] flex items-center gap-2"
          >
            <span>+</span> ADD DELIVERY ZONE
          </button>
        </div>
      </div>

      {/* Real Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total Zones */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.45)]">
            TOTAL ZONES
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-cream)]">
            {stats.totalZones}
          </span>
        </div>

        {/* Active Zones */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/70">
            ACTIVE
          </span>
          <span className="text-xl font-bold font-mono text-emerald-300">
            {stats.activeCount}
          </span>
        </div>

        {/* Inactive Zones */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgba(245,244,238,0.4)]">
            INACTIVE
          </span>
          <span className="text-xl font-bold font-mono text-[rgba(245,244,238,0.6)]">
            {stats.inactiveCount}
          </span>
        </div>

        {/* Lowest Fee */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--m-gold)]/70">
            LOWEST FEE
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-gold)]">
            {formatDeliveryFeeEgp(stats.lowestFeeMinor)}
          </span>
        </div>

        {/* Highest Fee */}
        <div className="p-4 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--m-gold)]/70">
            HIGHEST FEE
          </span>
          <span className="text-xl font-bold font-mono text-[var(--m-gold)]">
            {formatDeliveryFeeEgp(stats.highestFeeMinor)}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {zones.length === 0 ? (
        /* Zero-zone Empty State */
        <div className="p-12 text-center rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(245,244,238,0.1)] flex items-center justify-center text-[var(--m-gold)] font-mono text-2xl">
            🚚
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-base font-mono font-bold tracking-wider uppercase text-[var(--m-cream)]">
              NO DELIVERY ZONES CONFIGURED
            </h3>
            <p className="text-xs font-mono text-[rgba(245,244,238,0.5)] leading-relaxed">
              Checkout cannot accept customer orders until at least one active delivery zone is configured.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-[0.16em] uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(251,133,0,0.25)]"
          >
            + CONFIGURE FIRST DELIVERY ZONE
          </button>
        </div>
      ) : (
        /* Delivery Zones Table */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(245,244,238,0.06)]">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              REGISTERED DELIVERY AREAS ({zones.length})
            </h2>
            <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)] uppercase">
              POSTGRESQL RATE TABLE
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[rgba(245,244,238,0.08)] bg-[rgba(22,22,20,0.7)]">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[rgba(245,244,238,0.08)] bg-[rgba(0,0,0,0.5)] text-[10px] tracking-wider uppercase text-[rgba(245,244,238,0.45)]">
                  <th className="py-3.5 px-4 text-left font-bold text-[var(--m-gold)]">ZONE</th>
                  <th className="py-3.5 px-4 text-left font-bold">MATCH KEY</th>
                  <th className="py-3.5 px-4 text-right font-bold">FEE</th>
                  <th className="py-3.5 px-4 text-center font-bold">STATUS</th>
                  <th className="py-3.5 px-4 text-center font-bold">SORT</th>
                  <th className="py-3.5 px-4 text-left font-bold">UPDATED</th>
                  <th className="py-3.5 px-4 text-right font-bold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(245,244,238,0.04)]">
                {zones.map((zone) => (
                  <tr
                    key={zone.id}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-[var(--m-cream)]">
                      {zone.name}
                    </td>

                    {/* Match Key */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[rgba(245,244,238,0.6)]">
                      <span className="px-2 py-0.5 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.08)] text-[var(--m-cream)]">
                        {zone.normalizedKey}
                      </span>
                    </td>

                    {/* Fee */}
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--m-gold)]">
                      {formatDeliveryFeeEgp(zone.feeMinor, zone.currency)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {zone.active ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-gray-900 text-gray-400 border border-gray-700 font-medium">
                          INACTIVE
                        </span>
                      )}
                    </td>

                    {/* Sort Order */}
                    <td className="py-3.5 px-4 text-center text-[rgba(245,244,238,0.5)]">
                      {zone.sortOrder}
                    </td>

                    {/* Updated At */}
                    <td className="py-3.5 px-4 text-[11px] text-[rgba(245,244,238,0.5)] whitespace-nowrap">
                      {formatDate(zone.updatedAt)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingZone(zone);
                          setShowCreateModal(false);
                        }}
                        className="px-3 py-1.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(245,244,238,0.1)] text-[10px] uppercase font-bold tracking-wider text-[rgba(245,244,238,0.7)] group-hover:border-[var(--m-gold)] group-hover:text-[var(--m-gold)] transition-colors"
                      >
                        EDIT ✎
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ZONE MODAL */}
      {showCreateModal && (
        <CreateZoneModal
          defaultSortOrder={zones.length}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* EDIT ZONE MODAL */}
      {editingZone && (
        <EditZoneModal
          zone={editingZone}
          onClose={() => setEditingZone(null)}
        />
      )}
    </div>
  );
}

function CreateZoneModal({
  defaultSortOrder,
  onClose,
}: {
  defaultSortOrder: number;
  onClose: () => void;
}) {
  const [createState, createFormAction, isPending] = useActionState<
    DeliveryActionState,
    FormData
  >(createDeliveryZoneAction, { success: false });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-[rgba(24,24,20,0.98)] border border-[rgba(245,244,238,0.15)] shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[var(--m-gold)]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--m-cream)]">
              + ADD DELIVERY ZONE
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-[rgba(245,244,238,0.4)] hover:text-[var(--m-cream)]"
          >
            ✕
          </button>
        </div>

        {createState.success && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300">
            {createState.message || "Zone created successfully."}
          </div>
        )}

        {createState.error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex flex-col gap-1 text-xs font-mono text-red-300">
            <p>{createState.error}</p>
            {createState.fieldErrors && (
              <ul className="list-disc list-inside text-[11px] text-red-400">
                {Object.entries(createState.fieldErrors).map(([k, msg]) => (
                  <li key={k}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form action={createFormAction} className="flex flex-col gap-5">
          {/* Zone Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
              Zone Name <span className="text-amber-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Cairo"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
            />
          </div>

          {/* Match Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
              Match Key (Normalized)
            </label>
            <input
              name="matchKey"
              type="text"
              maxLength={100}
              placeholder="e.g. cairo or new-cairo"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)] lowercase"
            />
            <span className="text-[10px] font-mono text-[rgba(245,244,238,0.4)]">
              Leave blank to auto-generate from Zone Name. Normalized automatically (lowercase, hyphens).
            </span>
          </div>

          {/* Delivery Fee & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                Delivery Fee (EGP) <span className="text-amber-500">*</span>
              </label>
              <input
                name="fee"
                type="text"
                required
                placeholder="e.g. 75 or 75.50"
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                Sort Order
              </label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={defaultSortOrder}
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              id="create-active"
              name="active"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.2)] text-[var(--m-gold)] focus:ring-0"
            />
            <label
              htmlFor="create-active"
              className="text-xs font-mono uppercase tracking-wider text-[var(--m-cream)] cursor-pointer"
            >
              Active for Storefront Checkout
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(245,244,238,0.08)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 transition-all"
            >
              {isPending ? "CREATING..." : "CREATE ZONE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditZoneModal({
  zone,
  onClose,
}: {
  zone: AdminDeliveryZoneItem;
  onClose: () => void;
}) {
  const updateActionWithId = updateDeliveryZoneAction.bind(null, zone.id);
  const [updateState, updateFormAction, isPending] = useActionState<
    DeliveryActionState,
    FormData
  >(updateActionWithId, { success: false });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-[rgba(24,24,20,0.98)] border border-[rgba(245,244,238,0.15)] shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[var(--m-gold)]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--m-cream)]">
              EDIT DELIVERY ZONE: {zone.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-[rgba(245,244,238,0.4)] hover:text-[var(--m-cream)]"
          >
            ✕
          </button>
        </div>

        {updateState.success && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300">
            {updateState.message || "Zone updated successfully."}
          </div>
        )}

        {updateState.error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex flex-col gap-1 text-xs font-mono text-red-300">
            <p>{updateState.error}</p>
            {updateState.fieldErrors && (
              <ul className="list-disc list-inside text-[11px] text-red-400">
                {Object.entries(updateState.fieldErrors).map(([k, msg]) => (
                  <li key={k}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form action={updateFormAction} className="flex flex-col gap-5">
          {/* Zone Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
              Zone Name <span className="text-amber-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              maxLength={100}
              defaultValue={zone.name}
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
            />
          </div>

          {/* Match Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
              Match Key (Normalized) <span className="text-amber-500">*</span>
            </label>
            <input
              name="matchKey"
              type="text"
              maxLength={100}
              defaultValue={zone.normalizedKey}
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)] lowercase"
            />
          </div>

          {/* Delivery Fee & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                Delivery Fee (EGP) <span className="text-amber-500">*</span>
              </label>
              <input
                name="fee"
                type="text"
                required
                defaultValue={(zone.feeMinor / 100).toString()}
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.7)]">
                Sort Order
              </label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={zone.sortOrder}
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.12)] focus:border-[var(--m-gold)] focus:outline-none text-xs font-mono text-[var(--m-cream)]"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              id="edit-active"
              name="active"
              type="checkbox"
              defaultChecked={zone.active}
              className="w-4 h-4 rounded bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.2)] text-[var(--m-gold)] focus:ring-0"
            />
            <label
              htmlFor="edit-active"
              className="text-xs font-mono uppercase tracking-wider text-[var(--m-cream)] cursor-pointer"
            >
              Active for Storefront Checkout
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(245,244,238,0.08)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)]"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[var(--m-gold)] text-black hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 transition-all"
            >
              {isPending ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
