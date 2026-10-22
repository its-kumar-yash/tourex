/** Decorative Indian motifs. Purely visual: aria-hidden, no layout impact. */

export function Mandala({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const inner = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="86" strokeDasharray="2 5" />
      {petals.map((a) => (
        <ellipse key={a} cx="100" cy="42" rx="11" ry="30" transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="44" />
      {inner.map((a) => (
        <ellipse key={a} cx="100" cy="72" rx="8" ry="20" transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="16" />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}

/** Small diya-style divider used under section headings. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-2 text-saffron ${className}`}>
      <span className="h-px w-10 bg-current opacity-60" />
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2c1.6 2.4 2.6 4.3 2.6 5.8A2.6 2.6 0 0 1 12 10.4a2.6 2.6 0 0 1-2.6-2.6C9.4 6.3 10.4 4.4 12 2Z" />
        <path d="M3 13h18c-.6 4.2-4.4 7-9 7s-8.4-2.8-9-7Z" opacity=".85" />
      </svg>
      <span className="h-px w-10 bg-current opacity-60" />
    </span>
  );
}
