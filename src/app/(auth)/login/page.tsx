import type { Metadata } from "next";
import Link from "next/link";
import { safeNext } from "@/lib/auth/redirect";
import type { SearchParams } from "@/lib/filters";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  return (
    <>
      <p className="font-display text-lg text-saffron-deep">नमस्ते</p>
      <h1 className="display text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-soft">Sign in to reserve trips and see your bookings.</p>
      {sp.error === "link" && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
          That link is invalid or has expired. Please sign in or request a new one.
        </p>
      )}
      <div className="mt-6">
        <LoginForm next={next} />
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-maroon hover:underline">Create an account</Link>
      </p>
    </>
  );
}
