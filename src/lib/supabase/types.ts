// Placeholder until Phase 1 generates types from the live schema with
// `npx supabase gen types typescript`. Keeping the name stable lets the
// clients be typed now and swapped later without touching call sites.
export type Database = Record<string, never>;
