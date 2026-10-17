"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="px-4 py-24 text-center sm:px-8">
      <h1 className="display text-4xl font-medium">Something went wrong</h1>
      <p className="mt-3 text-ink-soft">Please try again. If it keeps happening, contact us.</p>
      {error.digest && <p className="mt-2 text-xs text-ink-muted">Ref {error.digest}</p>}
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="outline">Back to home</ButtonLink>
      </div>
    </div>
  );
}
