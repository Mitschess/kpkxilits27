import { useEffect } from "react";
import { useLocation } from "react-router";
import { ScrollTrigger, scrollToElement, scrollToTop } from "@/lib/motion";

/**
 * Scroll to `#hash` targets after navigation (e.g. "/#acara" from another page),
 * otherwise back to the top on route change.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToTop();
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let frame = 0;
    let settle = 0;
    // The target may not exist yet while the page is still mounting.
    const seek = () => {
      const el = document.getElementById(id);
      if (!el) {
        if (tries++ < 90) frame = requestAnimationFrame(seek);
        return;
      }
      ScrollTrigger.refresh();
      scrollToElement(el);
      // Pinned sections settle their spacing a moment later; re-aim once.
      settle = window.setTimeout(() => scrollToElement(el), 900);
    };
    seek();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [pathname, hash, key]);

  return null;
}
