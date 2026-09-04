import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getPrismaClient } from "@/lib/db/prisma";
import { AdminAuthorizationError } from "./errors";
import type { AdminSessionContext, AuthenticatedIdentity } from "./types";

/**
 * Verified Supabase Identity Resolver
 *
 * 1. Initializes the server Supabase SSR client with request cookies.
 * 2. Validates user token against Supabase Auth servers via `getUser()`.
 * 3. Returns verified subject (authUserId) and email, or null if unauthenticated.
 *
 * Security:
 * - Never trusts client-provided identity, parameters, or localStorage.
 * - Never uses unverified getSession() as an authorization source.
 */
export async function getAuthenticatedIdentity(): Promise<AuthenticatedIdentity | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.id) {
      return null;
    }

    return {
      authUserId: user.id,
      email: user.email ?? null,
    };
  } catch {
    // Graceful fallback if Supabase client is unconfigured or cookies are unavailable
    return null;
  }
}

/**
 * Authoritative Admin Access Lookup
 *
 * Maps verified Supabase identity (`claims.sub` / `user.id`) to METRONARY PostgreSQL AdminAccess record.
 *
 * Authorization Criteria:
 * - Supabase user identity is cryptographically verified
 * - Matching AdminAccess record exists in PostgreSQL
 * - AdminAccess.active === true
 * - AdminAccess.role is ADMIN or SUPER_ADMIN
 *
 * Returns null if any condition fails without throwing.
 */
export async function getAdminAccess(): Promise<AdminSessionContext | null> {
  const identity = await getAuthenticatedIdentity();
  if (!identity) {
    return null;
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return null;
  }

  try {
    const adminRecord = await prisma.adminAccess.findUnique({
      where: { authUserId: identity.authUserId },
    });

    if (!adminRecord || !adminRecord.active) {
      return null;
    }

    if (
      adminRecord.role !== "ADMIN" &&
      adminRecord.role !== "SUPER_ADMIN"
    ) {
      return null;
    }

    return {
      authUserId: adminRecord.authUserId,
      adminAccessId: adminRecord.id,
      role: adminRecord.role,
      email: adminRecord.email ?? identity.email,
      name: adminRecord.name,
    };
  } catch (error) {
    console.error("[METRONARY Auth] Error resolving admin access:", error);
    return null;
  }
}

/**
 * Enforce Admin Access (For Server Actions & Protected Data Layers)
 *
 * Throws controlled `AdminAuthorizationError` if caller is not an active admin.
 */
export async function requireAdmin(): Promise<AdminSessionContext> {
  const adminContext = await getAdminAccess();
  if (!adminContext) {
    throw new AdminAuthorizationError(
      "Unauthorized: Active administrator privileges required.",
      "UNAUTHORIZED"
    );
  }
  return adminContext;
}

/**
 * Enforce Super-Admin Access
 *
 * Throws controlled `AdminAuthorizationError` if caller is not an active SUPER_ADMIN.
 */
export async function requireSuperAdmin(): Promise<AdminSessionContext> {
  const adminContext = await requireAdmin();
  if (adminContext.role !== "SUPER_ADMIN") {
    throw new AdminAuthorizationError(
      "Forbidden: Super-administrator privileges required.",
      "INSUFFICIENT_PERMISSIONS"
    );
  }
  return adminContext;
}
