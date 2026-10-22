"use client";

import { useActionState } from "react";
import type { AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

type Action = (prev: AuthState, formData: FormData) => Promise<AuthState>;

export function FormAlert({ state }: { state: AuthState }) {
  return (
    <>
      {state.error && (
        <p role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
          <span aria-hidden="true">⚠</span> {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="rounded-xl border border-sky-deep/50 bg-sky px-3 py-2.5 text-sm">{state.message}</p>
      )}
    </>
  );
}

/** Generic wrapper for simple one-field forms (forgot / reset password). */
export function AuthForm({
  action,
  submitLabel,
  pendingLabel = "Please wait…",
  children,
  hidden = {},
}: {
  action: Action;
  submitLabel: string;
  pendingLabel?: string;
  children: React.ReactNode;
  hidden?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-4">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {children}
      <FormAlert state={state} />
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
