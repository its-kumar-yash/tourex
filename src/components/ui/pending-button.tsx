"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "./button";

/**
 * Plain submit button for server-action forms. While the form submits it is
 * disabled, and the button that was actually pressed shows a spinner (forms
 * with several named buttons, like Confirm / Reject, only spin the one used).
 * `confirm` asks before destructive actions.
 */
export function PendingButton({
  children,
  className = "",
  confirm,
  name,
  value,
  ...props
}: ComponentProps<"button"> & { confirm?: string }) {
  const { pending, data } = useFormStatus();
  const mine = pending && (!name || data?.get(name) === value);
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      aria-busy={mine || undefined}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`inline-flex items-center gap-1.5 disabled:opacity-60 ${className}`}
      {...props}
    >
      {mine && <Spinner className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
