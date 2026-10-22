import type { Metadata } from "next";
import Link from "next/link";
import { safeNext } from "@/lib/auth/redirect";
import type { SearchParams } from "@/lib/filters";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const next = safeNext((await searchParams).next);
  return (
    <>
      <p className="font-display text-lg text-saffron-deep">स्वागत है</p>
      <h1 className="display text-3xl">Create your account</h1>
      <p className="mt-2 text-sm text-ink-soft">Reserve packages and track your bookings in one place.</p>
      <div className="mt-6">
        <SignupForm next={next} />
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-maroon hover:underline">Sign in</Link>
      </p>
    </>
  );
}
