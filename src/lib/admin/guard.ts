import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";

/**
 * Server-side admin gate. Signed-out visitors go to login; signed-in
 * non-admins get a 404 so the admin area is not advertised. RLS still
 * enforces every write regardless of this check.
 */
export async function requireAdmin(nextPath = "/admin") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (user.profile?.role !== "admin") notFound();
  return user;
}
