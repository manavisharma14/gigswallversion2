// src/components/GA.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GA({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || typeof window === "undefined" || !("gtag" in window)) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    // @ts-expect-error: gtag injected by the GA script
    window.gtag("config", gaId, { page_path: url });
  }, [gaId, pathname, searchParams]);

  return null;
}