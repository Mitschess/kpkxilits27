import type { RefObject } from "react";
import { finishIntro } from "@/lib/intro";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const HERO_LOGO = "/images/logo/hero.webp";
const MAX_WAIT = 8000; // ms: a slow asset never holds the site hostage

export interface IntroProps {
  onDone: () => void;
}

/** Resolves once the first screen has what it needs: the fonts and the hero logo. */
export function assetsReady(): Promise<void> {
  const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  const logo = new Promise<void>((done) => {
    const img = new Image();
    img.onload = img.onerror = () => done();
    img.src = HERO_LOGO;
  });
  const timeout = new Promise<void>((done) => setTimeout(done, MAX_WAIT));
  return Promise.race([Promise.all([fonts, logo]).then(() => undefined), timeout]);
}

export type Q = (selector: string) => HTMLElement[];

export interface IntroScene {
  /** Everything before the site is revealed, starting at 0. */
  build: (t: gsap.core.Timeline, q: Q) => void;
  /** When to wait for the fonts and logo if they aren't in yet (seconds). */
  holdAt: number;
  /** The reveal, starting at the "exit" label. */
  exit: (t: gsap.core.Timeline, q: Q, el: HTMLElement) => void;
  /** Reduced motion: put the scene in its finished state (it then just fades out). */
  still?: (q: Q, el: HTMLElement) => void;
}

/**
 * Runs an intro scene: plays it, holds before the reveal until the assets are
 * in, starts the page's entrance as the reveal begins, and unmounts when done.
 * There is no skip: every visitor sees the whole intro.
 */
export function useIntro(root: RefObject<HTMLDivElement | null>, onDone: () => void, scene: () => IntroScene) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el) as Q;
      const s = scene();

      if (prefersReducedMotion()) {
        s.still?.(q, el);
        const t = gsap.timeline({ paused: true, onComplete: onDone });
        t.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.6, onStart: finishIntro });
        assetsReady().then(() => t.play());
        return;
      }

      let ready = false;
      let waiting = false;
      const bar = q("[data-intro-bar]")[0];
      const t = gsap.timeline({
        defaults: { ease: "power3.out" },
        onUpdate: () => bar && (bar.style.transform = `scaleX(${t.progress()})`),
        onComplete: onDone,
      });
      s.build(t, q);
      t.call(
        () => {
          if (ready) return;
          waiting = true;
          t.pause();
        },
        [],
        s.holdAt,
      );
      t.addLabel("exit", s.holdAt + 0.05);
      t.call(() => finishIntro(), [], "exit");
      s.exit(t, q, el);
      assetsReady().then(() => {
        ready = true;
        if (waiting) t.play();
      });
    },
    { scope: root },
  );
}

/** Thin progress line along the bottom, filled by the timeline. */
export function IntroBar({ light = false }: { light?: boolean }) {
  return (
    <div className={cn("absolute inset-x-0 bottom-0 z-30 h-1", light ? "bg-ink/10" : "bg-white/10")} aria-hidden="true">
      <div data-intro-bar className="h-full origin-left scale-x-0 bg-sun" />
    </div>
  );
}
