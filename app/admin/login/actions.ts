"use server";

import { createClient } from "@/lib/supabase/server";
import { getPrismaClient } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export interface LoginActionResult {
  success?: boolean;
  error?: string;
}

const GENERIC_LOGIN_ERROR =
  "Invalid credentials or administrator access is not enabled.";

/**
 * Admin Login Server Action
 *
 * Flow:
 * 1. Authenticate credentials with Supabase Auth (signInWithPassword).
 * 2. Authorize verified user ID against PostgreSQL `AdminAccess` table.
 * 3. Enforce active status and ADMIN / SUPER_ADMIN role.
 * 4. If unauthorized, immediately revoke Supabase session and return generic error.
 * 5. On full authorization, redirect to /admin.
 */
export async function loginAdmin(
  _prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  try {
    const supabase = await createClient();

    // 1. Authenticate with Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      return { error: GENERIC_LOGIN_ERROR };
    }

    // 2. Authorize via PostgreSQL AdminAccess table
    const prisma = getPrismaClient();
    if (!prisma) {
      await supabase.auth.signOut();
      return { error: GENERIC_LOGIN_ERROR };
    }

    const adminAccess = await prisma.adminAccess.findUnique({
      where: { authUserId: data.user.id },
    });

    // 3. Enforce active admin status
    if (
      !adminAccess ||
      !adminAccess.active ||
      (adminAccess.role !== "ADMIN" && adminAccess.role !== "SUPER_ADMIN")
    ) {
      // Immediately revoke/sign out Supabase session to prevent orphaned unprivileged sessions
      await supabase.auth.signOut();
      return { error: GENERIC_LOGIN_ERROR };
    }
  } catch (err) {
    console.error("[METRONARY Admin Auth] Login action error:", err);
    return { error: GENERIC_LOGIN_ERROR };
  }

  // 4. Redirect on successful authentication + authorization
  redirect("/admin");
}

/**
 * Admin Logout Server Action
 *
 * Revokes active Supabase session and redirects back to /admin/login.
 */
export async function logoutAdmin(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[METRONARY Admin Auth] Logout action error:", err);
  }

  redirect("/admin/login");
}
