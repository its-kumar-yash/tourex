import type { ComponentProps } from "react";

const control =
  "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-muted focus:border-sky-deep";

export function Label({ className = "", ...props }: ComponentProps<"label">) {
  return <label className={`mb-1.5 block text-sm font-medium ${className}`} {...props} />;
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${control} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return <select className={`${control} appearance-none ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={`min-h-28 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-sky-deep ${className}`}
      {...props}
    />
  );
}
