import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { safeNext } from "@/lib/auth/redirect";
import type { SearchParams } from "@/lib/filters";
import { AuthForm } from "@/components/auth/auth-form";
import { Input, Label } from "@/components/ui/field";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const next = safeNext((await searchParams).next);
  return (
    <>
      <h1 className="display text-3xl font-medium">Create an account</h1>
      <p className="mt-2 text-sm text-ink-soft">Reserve packages and track your bookings.</p>
      <div className="mt-6">
        <AuthForm action={signUp} submitLabel="Create account" hidden={{ next }}>
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" autoComplete="name" required minLength={2} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-ink-muted">At least 8 characters.</p>
          </div>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-ink hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
