"use client";

import { useActionState, useState } from "react";
import { saveItinerary } from "@/lib/admin/actions";
import type { Tables } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { smallButton } from "./ui";

type Day = { title: string; description: string };

export function ItineraryEditor({ packageId, days: initial }: { packageId: string; days: Tables<"package_itinerary">[] }) {
  const [days, setDays] = useState<Day[]>(
    initial.length ? initial.map((d) => ({ title: d.title, description: d.description })) : [{ title: "", description: "" }],
  );
  const [state, action, pending] = useActionState(saveItinerary, {});

  const update = (i: number, patch: Partial<Day>) =>
    setDays((d) => d.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const move = (i: number, dir: -1 | 1) =>
    setDays((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.length) return d;
      const copy = [...d];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="package_id" value={packageId} />
      <input type="hidden" name="days" value={JSON.stringify(days)} />
      <ol className="space-y-3">
        {days.map((d, i) => (
          <li key={i} className="rounded-2xl border border-line p-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky text-sm font-medium">{i + 1}</span>
              <Input
                aria-label={`Day ${i + 1} title`}
                placeholder="Day title"
                value={d.title}
                onChange={(e) => update(i, { title: e.target.value })}
              />
              <button type="button" className={smallButton} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button type="button" className={smallButton} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
              <button type="button" className={`${smallButton} text-red-700`} onClick={() => setDays((x) => x.filter((_, idx) => idx !== i))} aria-label="Remove day">×</button>
            </div>
            <Textarea
              aria-label={`Day ${i + 1} description`}
              placeholder="What happens on this day"
              className="mt-2 min-h-16"
              value={d.description}
              onChange={(e) => update(i, { description: e.target.value })}
            />
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={smallButton} onClick={() => setDays((d) => [...d, { title: "", description: "" }])}>
          + Add day
        </button>
        <Button type="submit" size="sm" loading={pending}>{pending ? "Saving…" : "Save itinerary"}</Button>
        {state.error && <span role="alert" className="text-sm text-red-700">{state.error}</span>}
        {state.message && <span role="status" className="text-sm text-ink-soft">{state.message}</span>}
      </div>
    </form>
  );
}
