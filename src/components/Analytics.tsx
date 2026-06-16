"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view (localStorage-based)
    const trackPageView = (path: string) => {
      try {
        const views = JSON.parse(localStorage.getItem("page-views:v1") || "{}");
        views[path] = (views[path] || 0) + 1;
        views["_total"] = (views["_total"] || 0) + 1;
        localStorage.setItem("page-views:v1", JSON.stringify(views));

        // Track last visit
        localStorage.setItem("last-visit:v1", JSON.stringify({
          path,
          timestamp: Date.now(),
        }));
      } catch {
        // Silently fail
      }
    };

    trackPageView(pathname);
  }, [pathname]);

  // Don't render anything visible
  return null;
}
