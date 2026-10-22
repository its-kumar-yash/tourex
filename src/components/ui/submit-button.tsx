"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

type Props = ComponentProps<typeof Button> & { pendingText?: string };

/**
 * Submit button for server-action forms: disables itself and shows a spinner
 * while its form is submitting, so admins never double-submit or wonder
 * whether a click registered.
 */
export function SubmitButton({
  pendingText,
  children,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} {...props}>
      {pending && pendingText ? pendingText : children}
    </Button>
  );
}

