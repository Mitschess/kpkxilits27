import { useRef, type RefObject } from "react";
import { ChevronsRight } from "lucide-react";
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
 * Returns the "skip" handler.
 */
export function useIntro(root: RefObject<HTMLDivElement | null>, onDone: () => void, scene: () => IntroScene) {
  const timeline = useRef<gsap.core.Timeline | null>(null);

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
        timeline.current = t;
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
      gsap.set(q("[data-intro-skip]"), { autoAlpha: 0 });
      t.to(q("[data-intro-skip]"), { autoAlpha: 1, duration: 0.4 }, 0.6);
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
      t.to(q("[data-intro-skip]"), { autoAlpha: 0, duration: 0.2 }, "exit");
      s.exit(t, q, el);
      timeline.current = t;
      assetsReady().then(() => {
        ready = true;
        if (waiting) t.play();
      });
    },
    { scope: root },
  );

  return () => {
    finishIntro();
    const t = timeline.current;
    if (!t) return onDone();
    if (t.labels.exit !== undefined) t.seek("exit").play();
    else t.progress(1);
  };
}

export function SkipButton({ onClick, light = false, className }: { onClick: () => void; light?: boolean; className?: string }) {
  return (
    <button
      data-intro-skip
      type="button"
      onClick={onClick}
      className={cn(
        "absolute right-4 bottom-6 z-30 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-sm transition md:right-8 md:bottom-8",
        light ? "bg-ink/10 text-ink ring-1 ring-ink/20 hover:bg-ink/15" : "bg-white/10 text-white/85 ring-1 ring-white/25 hover:bg-white/20",
        className,
      )}
    >
      Lewati <ChevronsRight size={16} aria-hidden="true" />
    </button>
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
