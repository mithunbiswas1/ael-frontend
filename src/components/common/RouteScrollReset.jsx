"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { unlockAllDialogScrolls } from "@/components/ui/Dialog";

export default function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Unconditionally unlock page scrolling on route transitions
    unlockAllDialogScrolls();
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
      const mainEl = document.querySelector("main");
      if (mainEl && mainEl.style.overflow === "hidden") {
        mainEl.style.overflow = "";
      }
    }
  }, [pathname]);

  return null;
}
