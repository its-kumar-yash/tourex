"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/lib/auth/actions";
import { PHONE_HINT } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { FormAlert } from "./auth-form";
import { PasswordInput } from "./password-input";

export function SignupForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, {});

  if (state.message) {
    return (
      <div className="rounded-2xl border border-sky-deep/50 bg-sky p-5 text-center">
        <p className="font-display text-2xl text-maroon">Check your inbox</p>
        <p className="mt-2 text-sm">{state.message}</p>
      </div>
    );
  }

  const f = state.fields ?? {};
  // key remounts inputs with the echoed values after a failed submit.
  return (
    <form action={action} className="space-y-4" key={JSON.stringify(f)} noValidate={false}>
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" autoComplete="name" required minLength={2} defaultValue={f.full_name} placeholder="Priya Sharma" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={f.email} placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="phone">Mobile number</Label>
        <div className="flex">
          <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line bg-cloud px-3 text-sm text-ink-soft">+91</span>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required
            defaultValue={f.phone}
            placeholder="98765 43210"
            aria-describedby="phone-hint"
            className="rounded-l-none!"
          />
        </div>
        <p id="phone-hint" className="mt-1 text-xs text-ink-muted">{PHONE_HINT}</p>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={8} aria-describedby="pw-hint" />
        <p id="pw-hint" className="mt-1 text-xs text-ink-muted">At least 8 characters.</p>
      </div>
      <FormAlert state={state} />
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {pending ? "Creating your account…" : "Create account"}
      </Button>
    </form>
  );
}
