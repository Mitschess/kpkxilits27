import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Fades/rises every `[data-reveal]` element inside `scope` as it scrolls into view.
 * Call once per page, after sections that pin (children run their effects first).
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current);
        gsap.set(els, { opacity: 0, y: 36 });
        ScrollTrigger.batch(els, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            // After a long jump (nav link, hash) everything scrolled past enters at once:
            // show those immediately and only animate what's actually on screen.
            const passed = batch.filter((el) => el.getBoundingClientRect().bottom <= 0);
            const onScreen = batch.filter((el) => el.getBoundingClientRect().bottom > 0);
            gsap.set(passed, { opacity: 1, y: 0 });
            gsap.to(onScreen, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "expo.out",
              stagger: Math.min(0.08, 0.5 / Math.max(onScreen.length, 1)),
              overwrite: true,
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
