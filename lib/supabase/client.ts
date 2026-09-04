import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-Side Supabase Client
 *
 * Utilized for client-side auth state listeners and interactive auth events if needed.
 * Important:
 * - Admin authorization logic is NEVER performed in the browser client.
 * - Admin roles/permissions are NEVER stored in localStorage.
 * - Storefront business data queries remain strictly server-side via Prisma.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be configured."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
