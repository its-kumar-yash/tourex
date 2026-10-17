"use client";

import { useActionState } from "react";
import type { AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

type Action = (prev: AuthState, formData: FormData) => Promise<AuthState>;

/** Shared wrapper: runs a server action and shows its error or message. */
export function AuthForm({
  action,
  submitLabel,
  children,
  hidden = {},
}: {
  action: Action;
  submitLabel: string;
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
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="rounded-xl bg-sky px-3 py-2 text-sm">
          {state.message}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : submitLabel}
      </Button>
    </form>
  );
}
