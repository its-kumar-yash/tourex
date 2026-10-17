export function Rating({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${className}`}
      aria-label={`Rated ${value} out of 5`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-amber-400">
        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
      </svg>
      {value.toFixed(1)}
    </span>
  );
}
