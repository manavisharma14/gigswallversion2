// src/components/GA.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GA({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;
    // @ts-expect-error gtag is defined by GA script
    if (typeof window.gtag !== "function") return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    // Send an explicit GA4 page_view
    // @ts-expect-error gtag exists at runtime
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaId, pathname, searchParams]);

  return null;
}