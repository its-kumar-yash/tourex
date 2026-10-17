"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/client";

const SKIP = [/^\/admin/, /^\/api/, /^\/auth/, /^\/account/];

/** Records one page_view per client-side navigation. Mounted once in the root layout. */
export function TrackPageView() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || last.current === pathname) return;
    last.current = pathname;
    if (SKIP.some((re) => re.test(pathname))) return;
    track("page_view", pathname);
  }, [pathname]);

  return null;
}
