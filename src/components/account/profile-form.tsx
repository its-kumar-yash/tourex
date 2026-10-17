"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function ProfileForm({ fullName, phone, email }: { fullName: string; phone: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="p-email">Email</Label>
        <Input id="p-email" value={email} readOnly className="bg-cloud" />
      </div>
      <div>
        <Label htmlFor="p-name">Full name</Label>
        <Input id="p-name" name="full_name" defaultValue={fullName} required minLength={2} autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="p-phone">Phone</Label>
        <Input id="p-phone" name="phone" type="tel" defaultValue={phone} autoComplete="tel" placeholder="+91 98765 43210" />
      </div>
      {state.error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state.message && <p role="status" className="rounded-xl bg-sky px-3 py-2 text-sm">{state.message}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save profile"}</Button>
    </form>
  );
}
