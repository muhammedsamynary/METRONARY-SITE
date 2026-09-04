import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase Auth Session Refresh Proxy Utility
 *
 * Responsibilities:
 * - Reads auth tokens from incoming cookies
 * - Validates identity and refreshes expired tokens via `supabase.auth.getUser()`
 * - Propagates refreshed cookies back to both request and response
 * - Does NOT make admin authorization decisions in this foundation phase
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Pass through if Supabase Auth credentials are not yet configured in local environment
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Validates the JWT and claims in the SSR Proxy path
  await supabase.auth.getClaims();

  return supabaseResponse;
}
