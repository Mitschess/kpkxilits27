import { useRef } from "react";
import { gsap } from "@/lib/motion";
import { HERO_LOGO, IntroBar, useIntro, type IntroProps } from "./shared";

const BANDS = [
  { word: "Kampus", bg: "#ffc93c", fg: "#1b1f3b" },
  { word: "Pulang", bg: "#ff4fa3", fg: "#ffffff" },
  { word: "Kampung", bg: "#1fbf9a", fg: "#1b1f3b" },
  { word: "KPK × ILITS 2026", bg: "#2f5bea", fg: "#ffffff" },
];

/**
 * Fast and loud: four bands of giant words slam in from alternating sides and
 * keep scrolling, the logo spins in on top while it counts to 100%, then the
 * bands split away left and right to uncover the site.
 */
export default function IntroKinetik({ onDone }: IntroProps) {
  const root = useRef<HTMLDivElement>(null);

  useIntro(root, onDone, () => ({
    holdAt: 3.2,
    build: (t, q) => {
      const bands = q("[data-band]");
      const rows = q("[data-row]");
      const countEl = q("[data-count]")[0];
      const count = { v: 0 };
      bands.forEach((b, i) => gsap.set(b, { xPercent: i % 2 ? 105 : -105 }));
      gsap.set(q("[data-badge]"), { scale: 0, rotate: -140 });
      gsap.set(q("[data-chip]"), { autoAlpha: 0, y: 16 });

      t.to(bands, { xPercent: 0, duration: 0.7, stagger: 0.12, ease: "expo.out" }, 0);
      // the words keep sliding, neighbours in opposite directions
      rows.forEach((r, i) => t.fromTo(r, { xPercent: i % 2 ? -25 : 0 }, { xPercent: i % 2 ? 0 : -25, duration: 4.4, ease: "none" }, 0));
      t.to(q("[data-badge]"), { scale: 1, rotate: 0, duration: 1, ease: "elastic.out(1, 0.55)" }, 0.85)
        .to(q("[data-chip]"), { autoAlpha: 1, y: 0, duration: 0.4 }, 1.05)
        .to(count, { v: 100, duration: 1.9, ease: "power1.inOut", onUpdate: () => countEl && (countEl.textContent = String(Math.round(count.v))) }, 1.05)
        .to(q("[data-stack]"), { scale: 1.06, duration: 1.4, ease: "power2.inOut" }, 1.6);
    },
    // the bands split away and uncover the site
    exit: (t, q, el) => {
      t.set(el, { backgroundColor: "transparent" }, "exit")
        .to(q("[data-badge], [data-chip]"), { scale: 0, autoAlpha: 0, duration: 0.35, ease: "back.in(2)" }, "exit")
        .to(q("[data-band]"), { xPercent: (i: number) => (i % 2 ? -105 : 105), duration: 0.75, stagger: 0.08, ease: "expo.in" }, "exit+=0.2");
    },
    still: (q) => {
      const countEl = q("[data-count]")[0];
      if (countEl) countEl.textContent = "100";
    },
  }));

  return (
    <div ref={root} role="status" aria-label="Memuat KPK × Ini Lho ITS! 2026" className="fixed inset-0 z-[100] overflow-hidden bg-cream">
      <div data-stack className="absolute inset-0 flex flex-col" aria-hidden="true">
        {BANDS.map((b) => (
          <div key={b.word} data-band className="flex flex-1 items-center overflow-hidden border-y-[3px] border-ink" style={{ background: b.bg, color: b.fg }}>
            <div data-row className="flex shrink-0 items-center gap-[0.35em] font-display text-[clamp(2.75rem,min(15vw,15vh),9.5rem)] leading-none font-extrabold tracking-tight whitespace-nowrap uppercase">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="flex items-center gap-[0.35em]">
                  {b.word}
                  <span className="text-[0.5em] opacity-70">✦</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* the logo spins in on top, counting up */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span
          data-badge
          className="grid h-[clamp(9rem,28vh,15rem)] w-[clamp(9rem,28vh,15rem)] place-items-center rounded-full border-[6px] border-ink bg-white shadow-[0_10px_0_#1b1f3b]"
        >
          <img src={HERO_LOGO} alt="" className="h-full w-full scale-125 object-contain" />
        </span>
        <span data-chip className="mt-5 rounded-full border-[3px] border-ink bg-white px-6 py-2 font-display text-3xl font-extrabold text-ink tabular-nums shadow-[0_5px_0_#1b1f3b] md:text-4xl">
          <span data-count>0</span>%
        </span>
      </div>

      <IntroBar />
    </div>
  );
}
