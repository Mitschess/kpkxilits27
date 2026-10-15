import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

// handy for poking at triggers from the browser console while developing
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

/** Smooth (inertia) scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// The gap under the fixed navbar comes from CSS (`scroll-padding-top` on <html>,
// `scroll-margin-top` on targets); Lenis and scrollIntoView both honour it.
export function scrollToElement(el: HTMLElement, immediate = false) {
  // A pinned section moves inside its spacer; aim at the spacer to land on its start.
  const parent = el.parentElement;
  const target = parent?.classList.contains("pin-spacer") ? parent : el;
  if (target !== el) target.style.scrollMarginTop = getComputedStyle(el).scrollMarginTop;
  if (lenis) lenis.scrollTo(target, { immediate, duration: 1.2 });
  else target.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

// Several overlays (sheet, lightbox, mobile menu) can pause scrolling at once.
let locks = 0;
export function lockScroll() {
  if (locks++ === 0) lenis?.stop();
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) lenis?.start();
}
