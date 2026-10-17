import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { Input, Label } from "@/components/ui/field";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="display text-3xl font-medium">Reset your password</h1>
      <p className="mt-2 text-sm text-ink-soft">We will email you a link to choose a new one.</p>
      <div className="mt-6">
        <AuthForm action={requestPasswordReset} submitLabel="Send reset link">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/login" className="font-medium text-ink hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
