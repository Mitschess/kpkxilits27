import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/motion";

/** Pause smooth scrolling of the page while an overlay is open. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockScroll();
    return unlockScroll;
  }, [active]);
}
