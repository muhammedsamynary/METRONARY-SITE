"use client";

import React, { useState, useTransition, useActionState } from "react";
import Image from "next/image";
import {
  setPrimaryProductMediaAction,
  updateProductMediaAction,
  deleteProductMediaAction,
  addLocalProductMediaAction,
  prepareProductMediaUploadAction,
  finalizeProductMediaUploadAction,
  type MediaActionState,
} from "@/app/admin/(protected)/products/[id]/actions";
import type { AdminProductDetailMedia } from "@/lib/admin/products";

interface ProductMediaManagerProps {
  productId: string;
  productName: string;
  media: AdminProductDetailMedia[];
}

const COMMON_LOCAL_ASSETS = [
  "/products/fearless.png",
  "/products/1973.png",
  "/products/old-boy-w.png",
  "/products/old-boy.png",
  "/products/orange-work-shirt.png",
  "/products/look-at-sky.png",
  "/products/time.png",
  "/products/decorarive.png",
  "/products/digital-camo-shorts.png",
  "/products/desert-camo-shorts.png",
  "/products/chatgpt-apr9.png",
  "/products/chatgpt-aug15.png",
  "/products/chatgpt-aug21-1.png",
  "/products/chatgpt-aug21-2.png",
];

/**
 * Edit Modal / Form for Individual Media Item
 */
function EditMediaModal({
  productId,
  mediaItem,
  onClose,
}: {
  productId: string;
  mediaItem: AdminProductDetailMedia;
  onClose: () => void;
}) {
  const updateAction = updateProductMediaAction.bind(null, productId, mediaItem.id);
  const [state, formAction, isPending] = useActionState<MediaActionState, FormData>(
    updateAction,
    { success: false }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[rgba(24,24,20,0.95)] border border-[rgba(245,244,238,0.15)] shadow-[0_16px_48px_rgba(0,0,0,0.8)] flex flex-col gap-5 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
          <span className="font-bold uppercase tracking-wider text-[var(--m-gold)]">
            EDIT MEDIA METADATA
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[rgba(245,244,238,0.5)] hover:text-[var(--m-cream)] uppercase text-[10px]"
          >
            ✕ CLOSE
          </button>
        </div>

        {state.success && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
            <span>✓ Metadata updated.</span>
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] uppercase underline text-emerald-400"
            >
              Done
            </button>
          </div>
        )}

        {state.error && !state.success && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.06)]">
            <div className="relative w-14 h-14 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(245,244,238,0.1)] overflow-hidden shrink-0 flex items-center justify-center p-1">
              <Image
                src={mediaItem.src}
                alt={mediaItem.alt || "Preview"}
                width={56}
                height={56}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase text-[rgba(245,244,238,0.4)]">
                SOURCE PATH
              </span>
              <span className="text-[11px] text-[var(--m-cream)] truncate max-w-[240px]">
                {mediaItem.src}
              </span>
            </div>
          </div>

          {/* Alt Text */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
              Alt Description (SEO & Accessibility)
            </label>
            <input
              name="alt"
              type="text"
              defaultValue={mediaItem.alt || ""}
              placeholder="e.g. METRONARY Front Graphic View"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
          </div>

          {/* Color Tag */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
              Color Tag (Optional — leave blank for Universal Media)
            </label>
            <input
              name="color"
              type="text"
              defaultValue={mediaItem.color || ""}
              placeholder="e.g. BLACK, WHITE (blank = Universal)"
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-gold)] focus:border-[var(--m-gold)] focus:outline-none"
            />
          </div>

          {/* Sort Order */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
              Sort Order Position
            </label>
            <input
              name="sortOrder"
              type="number"
              step="1"
              defaultValue={mediaItem.sortOrder}
              className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
            />
          </div>

          {/* Transparent Alpha Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="edit-hasAlpha"
              name="hasAlpha"
              type="checkbox"
              defaultChecked={mediaItem.hasAlpha}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="edit-hasAlpha" className="text-xs text-[var(--m-cream)] cursor-pointer">
              Transparent Background (PNG / Alpha)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(245,244,238,0.06)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs uppercase text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 transition-colors"
            >
              {isPending ? "SAVING..." : "SAVE METADATA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Media Card Component
 */
function MediaCard({
  productId,
  mediaItem,
  onEdit,
}: {
  productId: string;
  mediaItem: AdminProductDetailMedia;
  onEdit: () => void;
}) {
  const [isSettingPrimary, startSetPrimaryTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleSetPrimary = () => {
    setActionError(null);
    startSetPrimaryTransition(async () => {
      const res = await setPrimaryProductMediaAction(productId, mediaItem.id);
      if (!res.success && res.error) {
        setActionError(res.error);
      }
    });
  };

  const handleDelete = () => {
    setActionError(null);
    setShowDeleteConfirm(false);
    startDeleteTransition(async () => {
      const res = await deleteProductMediaAction(productId, mediaItem.id);
      if (!res.success && res.error) {
        setActionError(res.error);
      }
    });
  };

  return (
    <div
      className={`relative rounded-xl bg-[rgba(22,22,20,0.7)] border flex flex-col justify-between overflow-hidden transition-all duration-200 ${
        mediaItem.isPrimary
          ? "border-[rgba(251,133,0,0.4)] shadow-[0_0_20px_rgba(251,133,0,0.15)]"
          : "border-[rgba(245,244,238,0.08)] hover:border-[rgba(245,244,238,0.2)]"
      }`}
    >
      {/* Top Preview Stage */}
      <div className="relative aspect-square w-full bg-[rgba(12,12,10,0.85)] flex items-center justify-center p-4 border-b border-[rgba(245,244,238,0.06)] group">
        <Image
          src={mediaItem.src}
          alt={mediaItem.alt || "Product Media"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 250px"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {mediaItem.isPrimary ? (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-[var(--m-gold)] text-black shadow-[0_0_10px_rgba(251,133,0,0.5)]">
              ★ PRIMARY
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-[rgba(0,0,0,0.6)] text-[rgba(245,244,238,0.6)] border border-[rgba(245,244,238,0.1)]">
              #{mediaItem.sortOrder}
            </span>
          )}

          {mediaItem.color ? (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-amber-950/70 text-[var(--m-gold)] border border-amber-500/40 font-bold">
              {mediaItem.color}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-[rgba(255,255,255,0.06)] text-[rgba(245,244,238,0.4)] border border-[rgba(245,244,238,0.08)]">
              UNIVERSAL
            </span>
          )}

          {mediaItem.hasAlpha && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-sky-950/60 text-sky-300 border border-sky-500/30">
              ALPHA
            </span>
          )}
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 flex flex-col gap-2 font-mono text-xs">
        {/* Source Path */}
        <div className="flex flex-col">
          <span className="text-[9px] text-[rgba(245,244,238,0.4)] uppercase">SOURCE PATH</span>
          <span
            className="text-[11px] text-[var(--m-cream)] truncate select-all"
            title={mediaItem.src}
          >
            {mediaItem.src}
          </span>
        </div>

        {/* Color Tag */}
        <div className="flex flex-col">
          <span className="text-[9px] text-[rgba(245,244,238,0.4)] uppercase">COLOR TAG</span>
          <span className="text-[11px] text-[var(--m-gold)] truncate">
            {mediaItem.color ? mediaItem.color : "Universal (All Colors)"}
          </span>
        </div>

        {/* Alt Text */}
        <div className="flex flex-col">
          <span className="text-[9px] text-[rgba(245,244,238,0.4)] uppercase">ALT TEXT</span>
          <span className="text-[11px] text-[rgba(245,244,238,0.7)] truncate">
            {mediaItem.alt || "—"}
          </span>
        </div>

        {actionError && (
          <div className="p-2 rounded bg-rose-950/50 border border-rose-500/30 text-[10px] text-rose-300">
            {actionError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[rgba(245,244,238,0.06)] flex items-center justify-between gap-1.5">
          {!mediaItem.isPrimary && (
            <button
              type="button"
              disabled={isSettingPrimary || isDeleting}
              onClick={handleSetPrimary}
              className="px-2.5 py-1.5 rounded-lg bg-[rgba(251,133,0,0.1)] hover:bg-[var(--m-gold)] text-[var(--m-gold)] hover:text-black border border-[rgba(251,133,0,0.3)] text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
            >
              {isSettingPrimary ? "SETTING..." : "MAKE PRIMARY"}
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={onEdit}
              disabled={isDeleting || isSettingPrimary}
              className="px-2.5 py-1.5 rounded-lg bg-[rgba(245,244,238,0.05)] hover:bg-[rgba(245,244,238,0.1)] border border-[rgba(245,244,238,0.12)] text-[10px] font-bold uppercase text-[var(--m-cream)] transition-colors disabled:opacity-40"
            >
              EDIT
            </button>

            {showDeleteConfirm ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2 py-1 rounded bg-red-600 text-white text-[9px] font-bold uppercase hover:bg-red-700"
                >
                  {isDeleting ? "..." : "CONFIRM"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 rounded bg-neutral-800 text-[rgba(245,244,238,0.7)] text-[9px] uppercase"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting || isSettingPrimary}
                className="px-2 py-1.5 rounded-lg hover:bg-red-950/40 text-[rgba(245,244,238,0.4)] hover:text-red-400 border border-transparent hover:border-red-500/30 text-[10px] uppercase transition-colors disabled:opacity-40"
                title="Remove Media"
              >
                REMOVE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Add Media Form Panel Component
 */
function AddMediaPanel({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"local" | "upload">("local");

  // Local Action Form
  const localAction = addLocalProductMediaAction.bind(null, productId);
  const [localState, localFormAction, isLocalPending] = useActionState<
    MediaActionState,
    FormData
  >(localAction, { success: false });

  // Direct-to-Storage Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Form Field State for Direct Upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadColor, setUploadColor] = useState("");
  const [uploadHasAlpha, setUploadHasAlpha] = useState(true);
  const [uploadIsPrimary, setUploadIsPrimary] = useState(false);

  const [selectedLocalSrc, setSelectedLocalSrc] = useState<string>("/products/fearless.png");

  const handleDirectUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(false);

    if (!uploadFile) {
      setUploadError("Please select an image file to upload.");
      return;
    }

    // 1. Client-Side Size Validation (Max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (uploadFile.size > MAX_SIZE) {
      setUploadError("IMAGE TOO LARGE — MAXIMUM FILE SIZE IS 10MB");
      return;
    }

    // 2. Client-Side MIME Validation
    const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!ALLOWED_MIMES.includes(uploadFile.type.toLowerCase())) {
      setUploadError("UNSUPPORTED IMAGE FORMAT — Only PNG, JPG, and WEBP formats are supported.");
      return;
    }

    setIsUploading(true);

    try {
      // 3. Request Signed Upload Authorization from Server (Metadata Only)
      setUploadProgressText("AUTHORIZING UPLOAD...");
      const prepRes = await prepareProductMediaUploadAction(productId, {
        filename: uploadFile.name,
        mimeType: uploadFile.type,
        fileSize: uploadFile.size,
      });

      if (!prepRes.success || !prepRes.signedUrl || !prepRes.storagePath) {
        setUploadError(prepRes.error || "UPLOAD FAILED — Could not authorize storage upload.");
        setIsUploading(false);
        return;
      }

      // 4. Upload File Binary Directly from Browser to Supabase Storage
      setUploadProgressText("UPLOADING TO STORAGE...");
      const uploadRes = await fetch(prepRes.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": uploadFile.type,
        },
        body: uploadFile,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text().catch(() => "");
        console.error("[METRONARY Storage Client] Direct upload failed:", uploadRes.status, errorText);
        setUploadError("UPLOAD FAILED — Direct storage upload failed. Please try again.");
        setIsUploading(false);
        return;
      }

      // 5. Finalize ProductMedia Registration in Database
      setUploadProgressText("REGISTERING MEDIA...");
      const finRes = await finalizeProductMediaUploadAction(productId, {
        storagePath: prepRes.storagePath,
        alt: uploadAlt || null,
        color: uploadColor.trim() || null,
        hasAlpha: uploadHasAlpha,
        isPrimary: uploadIsPrimary,
      });

      if (!finRes.success) {
        setUploadError(finRes.error || "MEDIA REGISTRATION FAILED");
        setIsUploading(false);
        return;
      }

      setUploadSuccess(true);
      setUploadFile(null);
      setUploadAlt("");
      setUploadColor("");
    } catch (err: unknown) {
      console.error("[METRONARY Storage Client] Unexpected error during upload:", err);
      setUploadError("UPLOAD FAILED — An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[rgba(26,26,22,0.95)] border border-[rgba(251,133,0,0.35)] shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,244,238,0.08)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--m-gold)]" />
          <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-[var(--m-gold)]">
            ATTACH PRODUCT MEDIA
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[rgba(245,244,238,0.5)] hover:text-[var(--m-cream)] uppercase"
        >
          Cancel ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(245,244,238,0.08)] max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab("local")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "local"
              ? "bg-[var(--m-gold)] text-black shadow-[0_0_10px_rgba(251,133,0,0.3)]"
              : "text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)]"
          }`}
        >
          LOCAL ASSET PATH
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "upload"
              ? "bg-[var(--m-gold)] text-black shadow-[0_0_10px_rgba(251,133,0,0.3)]"
              : "text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)]"
          }`}
        >
          SUPABASE UPLOAD
        </button>
      </div>

      {/* TAB 1: LOCAL ASSET PATH */}
      {activeTab === "local" && (
        <form action={localFormAction} className="flex flex-col gap-4">
          {localState.success && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
              <span>✓ Local asset registered successfully.</span>
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] uppercase underline text-emerald-400"
              >
                Done
              </button>
            </div>
          )}

          {localState.error && !localState.success && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
              {localState.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
                Asset Path <span className="text-amber-400">*</span>
              </label>
              <input
                name="src"
                type="text"
                required
                value={selectedLocalSrc}
                onChange={(e) => setSelectedLocalSrc(e.target.value)}
                placeholder="/products/example.png"
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
              />
              <span className="text-[10px] text-[rgba(245,244,238,0.35)]">
                Must be an existing static file inside /public/products/
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
                Alt Description (Optional)
              </label>
              <input
                name="alt"
                type="text"
                placeholder="e.g. Front View"
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
                Color Tag (Optional)
              </label>
              <input
                name="color"
                type="text"
                placeholder="e.g. BLACK (blank = Universal)"
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-gold)] focus:border-[var(--m-gold)] focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Select Preset Pills */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase text-[rgba(245,244,238,0.4)]">
              Quick Select Available Assets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_LOCAL_ASSETS.map((asset) => (
                <button
                  key={asset}
                  type="button"
                  onClick={() => setSelectedLocalSrc(asset)}
                  className={`px-2 py-1 rounded text-[9px] border transition-colors ${
                    selectedLocalSrc === asset
                      ? "bg-[rgba(251,133,0,0.15)] text-[var(--m-gold)] border-[rgba(251,133,0,0.4)] font-bold"
                      : "bg-[rgba(0,0,0,0.3)] text-[rgba(245,244,238,0.6)] border-[rgba(245,244,238,0.08)] hover:text-[var(--m-cream)]"
                  }`}
                >
                  {asset.split("/").pop()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[rgba(245,244,238,0.06)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="hasAlpha"
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[var(--m-cream)]">Transparent Background (Alpha)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="isPrimary"
                type="checkbox"
                defaultChecked={false}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[var(--m-cream)]">Set as Primary Media</span>
            </label>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs uppercase text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLocalPending}
                className="px-5 py-2 rounded-lg bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-[0_0_12px_rgba(251,133,0,0.25)]"
              >
                {isLocalPending ? "REGISTERING..." : "REGISTER ASSET"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: SUPABASE STORAGE DIRECT UPLOAD */}
      {activeTab === "upload" && (
        <form onSubmit={handleDirectUploadSubmit} className="flex flex-col gap-4">
          {uploadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
              <span>✓ Media uploaded and attached successfully.</span>
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] uppercase underline text-emerald-400"
              >
                Done
              </button>
            </div>
          )}

          {uploadError && !uploadSuccess && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
              {uploadError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
                Image File (PNG, JPG, WEBP — Max 10MB) <span className="text-amber-400">*</span>
              </label>
              <input
                type="file"
                required
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => {
                  setUploadError(null);
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 10 * 1024 * 1024) {
                    setUploadError("IMAGE TOO LARGE — MAXIMUM FILE SIZE IS 10MB");
                  }
                  setUploadFile(file);
                }}
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-[rgba(251,133,0,0.15)] file:text-[var(--m-gold)] file:cursor-pointer hover:file:bg-[var(--m-gold)] hover:file:text-black cursor-pointer"
              />
              <span className="text-[10px] text-[rgba(245,244,238,0.35)]">
                Uploaded directly from browser to Supabase Storage.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
                Alt Description (Optional)
              </label>
              <input
                type="text"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                placeholder="e.g. Back Graphic Angle"
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-cream)] focus:border-[var(--m-gold)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-[rgba(245,244,238,0.6)]">
                Color Tag (Optional)
              </label>
              <input
                type="text"
                value={uploadColor}
                onChange={(e) => setUploadColor(e.target.value)}
                placeholder="e.g. BLACK (blank = Universal)"
                className="px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(245,244,238,0.12)] text-xs text-[var(--m-gold)] focus:border-[var(--m-gold)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[rgba(245,244,238,0.06)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uploadHasAlpha}
                onChange={(e) => setUploadHasAlpha(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[var(--m-cream)]">Transparent Background (Alpha)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uploadIsPrimary}
                onChange={(e) => setUploadIsPrimary(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--m-gold)] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[var(--m-cream)]">Set as Primary Media</span>
            </label>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg text-xs uppercase text-[rgba(245,244,238,0.6)] hover:text-[var(--m-cream)] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !uploadFile}
                className="px-5 py-2 rounded-lg bg-[var(--m-gold)] text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-[0_0_12px_rgba(251,133,0,0.25)]"
              >
                {isUploading ? (uploadProgressText || "UPLOADING...") : "UPLOAD & ATTACH"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

/**
 * Main ProductMediaManager Component
 */
export function ProductMediaManager({
  productId,
  productName,
  media,
}: ProductMediaManagerProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminProductDetailMedia | null>(null);

  const primaryMedia = media.find((m) => m.isPrimary);

  return (
    <div className="p-6 rounded-xl bg-[rgba(22,22,20,0.7)] border border-[rgba(245,244,238,0.08)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[rgba(245,244,238,0.06)]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[var(--m-gold)]">
              PRODUCT MEDIA GALLERY ({media.length})
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              MANAGEMENT ACTIVE
            </span>
          </div>
          <p className="text-[11px] font-mono text-[rgba(245,244,238,0.45)] mt-0.5">
            Manage storefront gallery angles, transparent alphas, and primary showcase assets for {productName}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddPanel((prev) => !prev)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[var(--m-gold)] border border-[rgba(251,133,0,0.3)] hover:border-[var(--m-gold)] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>{showAddPanel ? "✕ CLOSE" : "+ ADD MEDIA"}</span>
        </button>
      </div>

      {/* Add Media Panel */}
      {showAddPanel && (
        <AddMediaPanel
          productId={productId}
          onClose={() => setShowAddPanel(false)}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditMediaModal
          productId={productId}
          mediaItem={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Media Cards Grid */}
      {media.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono text-[rgba(245,244,238,0.4)] bg-[rgba(0,0,0,0.25)] rounded-xl border border-[rgba(245,244,238,0.04)] flex flex-col items-center justify-center gap-2">
          <span className="font-bold text-[var(--m-cream)]">NO MEDIA ASSETS REGISTERED</span>
          <span className="text-[11px] text-[rgba(245,244,238,0.35)]">
            Click &quot;+ ADD MEDIA&quot; above to register a local image or upload via Supabase Storage.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              productId={productId}
              mediaItem={item}
              onEdit={() => setEditingItem(item)}
            />
          ))}
        </div>
      )}

      {/* Footer Notes */}
      <div className="pt-2 border-t border-[rgba(245,244,238,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] text-[rgba(245,244,238,0.35)]">
        <span>
          Primary asset is synchronized to Product.thumbnail and served across catalog listings.
        </span>
        {primaryMedia && (
          <span className="text-[var(--m-gold)] font-semibold truncate max-w-xs">
            Current Primary: {primaryMedia.src.split("/").pop()}
          </span>
        )}
      </div>
    </div>
  );
}
