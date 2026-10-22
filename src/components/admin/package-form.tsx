"use client";

import { useActionState } from "react";
import { savePackage } from "@/lib/admin/actions";
import type { Tables } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";

export function PackageForm({ pkg }: { pkg?: Tables<"packages"> }) {
  const [state, action, pending] = useActionState(savePackage, {});
  return (
    <form action={action} className="space-y-5">
      {pkg && <input type="hidden" name="id" value={pkg.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required minLength={3} defaultValue={pkg?.title ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" name="slug" defaultValue={pkg?.slug ?? ""} placeholder="auto from title" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required defaultValue={pkg?.location ?? ""} placeholder="Leh, Ladakh" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" required defaultValue={pkg?.country ?? ""} placeholder="India" />
        </div>
        <div>
          <Label htmlFor="price">Price per person (₹)</Label>
          <Input id="price" name="price" type="number" min={0} step={1} required defaultValue={pkg ? pkg.price_minor / 100 : ""} />
        </div>
        <div>
          <Label htmlFor="duration_days">Duration (days)</Label>
          <Input id="duration_days" name="duration_days" type="number" min={1} max={365} required defaultValue={pkg?.duration_days ?? 3} />
        </div>
        <div>
          <Label htmlFor="max_guests">Max guests</Label>
          <Input id="max_guests" name="max_guests" type="number" min={1} max={100} required defaultValue={pkg?.max_guests ?? 4} />
        </div>
        <div>
          <Label htmlFor="rating">Rating (0–5)</Label>
          <Input id="rating" name="rating" type="number" min={0} max={5} step={0.1} required defaultValue={pkg?.rating ?? 4.5} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="summary">Summary (one line, shown on cards)</Label>
          <Input id="summary" name="summary" maxLength={200} defaultValue={pkg?.summary ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" className="min-h-40" defaultValue={pkg?.description ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cover_image_url">Cover image URL</Label>
          <Input id="cover_image_url" name="cover_image_url" type="url" defaultValue={pkg?.cover_image_url ?? ""} placeholder="Upload photos below, then pick one as cover" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_published" defaultChecked={pkg?.is_published ?? false} /> Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" defaultChecked={pkg?.is_featured ?? false} /> Featured on home
        </label>
      </div>

      {state.error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state.message && <p role="status" className="rounded-xl bg-sky px-3 py-2 text-sm">{state.message}</p>}
      <Button type="submit" loading={pending}>{pending ? "Saving…" : pkg ? "Save changes" : "Create package"}</Button>
    </form>
  );
}
