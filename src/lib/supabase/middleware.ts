import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, hasSupabaseEnv } from "@/lib/env";

/**
 * Refreshes the Supabase session cookie on every matched request so Server
 * Components always see a valid session. Route protection for /account and
 * /admin is added in Phase 3 and 4 respectively.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Phase 0: let the app run before credentials exist.
  if (!hasSupabaseEnv()) return response;

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and getUser(): a missing
  // await here is the classic cause of users being logged out at random.
  await supabase.auth.getUser();

  return response;
}
