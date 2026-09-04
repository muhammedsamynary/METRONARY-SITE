import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-Side Supabase Client for Next.js App Router (Next.js 16 / React 19)
 *
 * Supports:
 * - Server Components (reads cookies via getAll)
 * - Server Actions (reads and mutates cookies via setAll)
 * - Route Handlers
 *
 * Note: Database CRUD remains strictly within Prisma. This client is for
 * Supabase Auth identity and session management only.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be configured."
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be safely ignored if Next.js proxy / middleware refreshes user sessions.
        }
      },
    },
  });
}
