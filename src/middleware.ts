import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Only routes that need a server-side session go through middleware. Public
 * pages skip it, so browsing never waits on a Supabase auth round trip; the
 * browser client keeps the session fresh there on its own.
 */
export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/signup", "/reset-password", "/auth/:path*"],
};
