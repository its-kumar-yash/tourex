import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";
import { safeNext } from "@/lib/auth/redirect";
import type { SearchParams } from "@/lib/filters";
import { AuthForm } from "@/components/auth/auth-form";
import { Input, Label } from "@/components/ui/field";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const linkError = sp.error === "link";

  return (
    <>
      <h1 className="display text-3xl font-medium">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-soft">Sign in to reserve trips and see your bookings.</p>
      {linkError && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          That link is invalid or has expired. Please sign in or request a new one.
        </p>
      )}
      <div className="mt-6">
        <AuthForm action={signIn} submitLabel="Sign in" hidden={{ next }}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-ink-soft hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-ink hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
