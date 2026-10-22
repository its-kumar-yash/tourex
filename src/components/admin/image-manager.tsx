"use client";

import { PendingButton } from "@/components/ui/pending-button";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addPackageImage, removePackageImage, setCoverImage } from "@/lib/admin/actions";
import type { Tables } from "@/lib/supabase/types";
import { smallButton } from "./ui";

const MAX_BYTES = 5 * 1024 * 1024;

export function ImageManager({
  packageId,
  images,
  coverUrl,
}: {
  packageId: string;
  images: Tables<"package_images">[];
  coverUrl: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) throw new Error(`${file.name} is over 5 MB.`);
        if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) throw new Error(`${file.name}: use JPG, PNG, WebP or AVIF.`);
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${packageId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("package-images")
          .upload(path, file, { cacheControl: "31536000", contentType: file.type });
        if (upErr) throw new Error(upErr.message);
        const { data } = supabase.storage.from("package-images").getPublicUrl(path);
        const fd = new FormData();
        fd.set("package_id", packageId);
        fd.set("url", data.publicUrl);
        fd.set("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
        await addPackageImage(fd);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={busy}
          onChange={(e) => upload(e.target.files)}
          className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-maroon file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
        {busy && <span className="text-sm text-ink-soft">Uploading…</span>}
      </div>
      {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => {
          const isCover = img.url === coverUrl;
          return (
            <li key={img.id} className="overflow-hidden rounded-2xl border border-line">
              <div className="relative aspect-[4/3] bg-cloud">
                <Image src={img.url} alt={img.alt} fill sizes="240px" className="object-cover" />
                {isCover && (
                  <span className="absolute left-2 top-2 rounded-full bg-maroon px-2 py-0.5 text-xs text-white">Cover</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                {!isCover ? (
                  <form action={setCoverImage}>
                    <input type="hidden" name="package_id" value={packageId} />
                    <input type="hidden" name="url" value={img.url} />
                    <PendingButton className={smallButton}>Use as cover</PendingButton>
                  </form>
                ) : <span />}
                <form action={removePackageImage}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="package_id" value={packageId} />
                  <PendingButton confirm="Remove this photo?" className={`${smallButton} text-red-700`}>Remove</PendingButton>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
      {images.length === 0 && <p className="mt-3 text-sm text-ink-soft">No photos yet. Upload a few; the first becomes the cover.</p>}
    </div>
  );
}
