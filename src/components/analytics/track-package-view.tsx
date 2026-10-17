"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/client";

export function TrackPackageView({ packageId, slug }: { packageId: string; slug: string }) {
  useEffect(() => {
    track("package_view", `/packages/${slug}`, packageId);
  }, [packageId, slug]);
  return null;
}
