import type { Metadata } from "next";
import { updatePassword } from "@/lib/auth/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { Input, Label } from "@/components/ui/field";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="display text-3xl font-medium">Choose a new password</h1>
      <div className="mt-6">
        <AuthForm action={updatePassword} submitLabel="Update password">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
          </div>
        </AuthForm>
      </div>
    </>
  );
}
