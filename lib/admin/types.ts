import type { AdminRole } from "@/generated/prisma/client";

export type { AdminRole };

/**
 * Authenticated Identity extracted from verified Supabase Auth session
 */
export interface AuthenticatedIdentity {
  authUserId: string;
  email: string | null;
}

/**
 * Authoritative Admin Session Context verified against PostgreSQL AdminAccess
 */
export interface AdminSessionContext {
  authUserId: string;
  adminAccessId: string;
  role: AdminRole;
  email: string | null;
  name: string | null;
}
