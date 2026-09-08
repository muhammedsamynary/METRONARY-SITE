import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-Only Privileged Supabase Storage Helper for METRONARY Admin
 *
 * Security & Lifecycle Rules:
 * 1. Strictly server-only (`import "server-only"`). Never imported into Client Components.
 * 2. Uses modern `SUPABASE_SECRET_KEY` with optional `SUPABASE_SERVICE_ROLE_KEY` legacy fallback.
 * 3. Never logs secret values or leaks keys in error messages.
 * 4. Used ONLY for privileged Storage operations after application authorization (`requireAdmin()`).
 * 5. Does NOT replace standard user-authenticated Supabase Auth client.
 */

export function getStorageBucketName(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "product-media";
}

export function getStorageAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseUrl.trim()) {
    throw new Error(
      "Supabase Storage configuration error: NEXT_PUBLIC_SUPABASE_URL is missing."
    );
  }

  if (!secretKey || !secretKey.trim()) {
    throw new Error(
      "Supabase Storage configuration error: Privileged secret credential (SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY) is not configured in the server environment."
    );
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getStoragePublicUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = getStorageBucketName();

  if (!supabaseUrl) {
    throw new Error("Supabase URL is not configured in environment.");
  }

  const cleanPath = storagePath.startsWith("/") ? storagePath.slice(1) : storagePath;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

export interface SignedUploadUrlResult {
  signedUrl: string;
  path: string;
  token: string;
}

/**
 * Generates a controlled, short-lived signed upload URL for a specific storage path.
 * The browser can upload directly to this URL without requiring service role secrets.
 */
export async function createSignedProductMediaUploadUrl(
  storagePath: string
): Promise<SignedUploadUrlResult> {
  const bucket = getStorageBucketName();
  const client = getStorageAdminClient();

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(storagePath);

  if (error || !data?.signedUrl) {
    console.error("[METRONARY Storage] Error creating signed upload URL:", error);
    throw new Error(
      `Unable to generate signed upload URL: ${error?.message || "Unknown error"}`
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fullSignedUrl = data.signedUrl.startsWith("http")
    ? data.signedUrl
    : `${supabaseUrl}/storage/v1${data.signedUrl}`;

  return {
    signedUrl: fullSignedUrl,
    path: data.path || storagePath,
    token: data.token,
  };
}

/**
 * Verifies that an object actually exists in the bucket after client upload.
 */
export async function verifyStorageObjectExists(
  storagePath: string
): Promise<boolean> {
  try {
    const bucket = getStorageBucketName();
    const client = getStorageAdminClient();

    // Check by path prefix / listing parent directory
    const parts = storagePath.split("/");
    const filename = parts.pop();
    const parentFolder = parts.join("/");

    const { data, error } = await client.storage
      .from(bucket)
      .list(parentFolder, { search: filename });

    if (error || !data) {
      return false;
    }

    return data.some((item) => item.name === filename);
  } catch (err) {
    console.warn("[METRONARY Storage] Verify object error:", err);
    return false;
  }
}

/**
 * Safely removes an object from Supabase Storage (e.g. for orphan cleanup or media deletion)
 */
export async function deleteStorageObject(
  storagePath: string
): Promise<boolean> {
  try {
    const bucket = getStorageBucketName();
    const client = getStorageAdminClient();

    const { error } = await client.storage.from(bucket).remove([storagePath]);
    if (error) {
      console.warn(`[METRONARY Storage] Delete error for path "${storagePath}":`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[METRONARY Storage] Delete exception for path "${storagePath}":`, err);
    return false;
  }
}
