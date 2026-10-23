import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import Bunting from "@/components/deco/Bunting";
import { gsap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { HERO_LOGO, IntroBar, useIntro, type IntroProps } from "./shared";

const FLAGS = 24;
const CONFETTI_COLORS = ["#ffc93c", "#ff4fa3", "#1fbf9a", "#2f5bea", "#ff8a3d", "#9b7bff"];

// marquee bulbs clockwise around the sign: 9 along the top and bottom, 6 down each side
const BULBS = (() => {
  const spots: { left: number; top: number }[] = [];
  for (let i = 0; i < 9; i++) spots.push({ left: ((i + 0.5) / 9) * 100, top: 0 });
  for (let i = 0; i < 6; i++) spots.push({ left: 100, top: ((i + 0.5) / 6) * 100 });
  for (let i = 8; i >= 0; i--) spots.push({ left: ((i + 0.5) / 9) * 100, top: 100 });
  for (let i = 5; i >= 0; i--) spots.push({ left: 0, top: ((i + 0.5) / 6) * 100 });
  return spots;
})();

// stage curtain: velvet folds with a darker hem
const CURTAIN =
  "linear-gradient(to bottom, transparent 55%, rgb(40 0 20 / 0.35)), repeating-linear-gradient(90deg, #e0336f 0 28px, #b51d5a 28px 56px)";

function celebrate() {
  const shot = (x: number, angle: number) =>
    confetti({ particleCount: 70, angle, spread: 60, startVelocity: 55, origin: { x, y: 0.9 }, colors: CONFETTI_COLORS, zIndex: 120 });
  shot(0.1, 60);
  shot(0.9, 120);
}

/**
 * Festival night on stage: curtains closed, spotlights sweeping, the bunting
 * goes up and a marquee sign drops in. Its bulbs light up one by one as the
 * site loads, confetti pops, the sign flies off and the curtains open onto it.
 */
export default function IntroPanggung({ onDone }: IntroProps) {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);
  const [flags, setFlags] = useState(0);
  const [party, setParty] = useState(false);

  useIntro(root, onDone, () => ({
    holdAt: 4.3,
    build: (t, q) => {
      const p = { v: 0 };
      gsap.set(q("[data-beam]"), { autoAlpha: 0 });
      gsap.set(q("[data-sign]"), { y: "-120vh" });
      gsap.set(q("[data-word]"), { scale: 0, autoAlpha: 0 });

      t.to(q("[data-beam]"), { autoAlpha: 1, duration: 0.8, stagger: 0.15 }, 0)
        .to(q("[data-beam='l']"), { rotate: 22, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0.2)
        .to(q("[data-beam='r']"), { rotate: -22, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0.2)
        .to(q("[data-sign]"), { y: 0, duration: 1.2, ease: "bounce.out" }, 0.35)
        // bulbs and flags fill up like a progress bar
        .to(p, { v: 1, duration: 2.5, ease: "none", onUpdate: () => (setLit(Math.round(p.v * BULBS.length)), setFlags(Math.round(p.v * FLAGS))) }, 0.9)
        .to(q("[data-word]"), { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: "back.out(2.2)" }, 1.5)
        .call(
          () => {
            setParty(true);
            celebrate();
          },
          [],
          3.5,
        );
    },
    // the sign flies off and the curtains open onto the site
    exit: (t, q) => {
      t.to(q("[data-sign]"), { y: "-120vh", duration: 0.6, ease: "power2.in" }, "exit")
        .to(q("[data-beam]"), { autoAlpha: 0, duration: 0.4 }, "exit")
        .to(q("[data-curtain='l']"), { xPercent: -100, duration: 1.1, ease: "power3.inOut" }, "exit+=0.25")
        .to(q("[data-curtain='r']"), { xPercent: 100, duration: 1.1, ease: "power3.inOut" }, "exit+=0.25")
        .to(q("[data-valance]"), { yPercent: -110, duration: 0.9, ease: "power3.inOut" }, "exit+=0.45");
    },
    still: () => {
      setLit(BULBS.length);
      setFlags(FLAGS);
    },
  }));

  return (
    <div ref={root} role="status" aria-label="Memuat KPK × Ini Lho ITS! 2026" className="fixed inset-0 z-[100] overflow-hidden">
      {/* the curtains: closed until the show starts */}
      <div data-curtain="l" className="absolute inset-y-0 left-0 w-1/2 border-r-[6px] border-sun" style={{ background: CURTAIN }} />
      <div data-curtain="r" className="absolute inset-y-0 right-0 w-1/2 border-l-[6px] border-sun" style={{ background: CURTAIN }} />

      {/* spotlights from the top corners */}
      {(["l", "r"] as const).map((side) => (
        <div
          key={side}
          data-beam={side}
          className={cn(
            "pointer-events-none absolute -top-[10vh] h-[130vh] w-[46vw] mix-blend-screen",
            side === "l" ? "left-[2vw] origin-top-left -rotate-[18deg]" : "right-[2vw] origin-top-right rotate-[18deg]",
          )}
          style={{
            background: "linear-gradient(to bottom, rgb(255 236 170 / 0.6), rgb(255 236 170 / 0.08) 80%, transparent)",
            clipPath: side === "l" ? "polygon(0 0, 14% 0, 100% 100%, 40% 100%)" : "polygon(86% 0, 100% 0, 60% 100%, 0 100%)",
          }}
        />
      ))}

      {/* the valance along the top, with the bunting under it */}
      <div data-valance className="absolute inset-x-0 top-0 h-[11vh] border-b-[5px] border-sun bg-its shadow-[0_8px_24px_rgb(0_0_0/0.35)]">
        <div className="absolute inset-x-0 top-[38%] h-1.5 bg-[repeating-linear-gradient(90deg,#ffc93c_0_10px,transparent_10px_22px)] opacity-80" />
        <Bunting className="absolute inset-x-0 top-full" flags={FLAGS} sag={22} shown={flags} />
      </div>

      {/* the marquee sign, hanging from two ropes */}
      <div className="absolute inset-0 flex items-center justify-center px-6 pt-[8vh]">
        <div data-sign className="relative">
          <span className="absolute bottom-full left-[16%] h-[40vh] w-[3px] bg-ink/70" />
          <span className="absolute right-[16%] bottom-full h-[40vh] w-[3px] bg-ink/70" />
          <div className="relative w-[clamp(17rem,44vw,32rem)] rounded-[2rem] border-4 border-ink bg-white px-6 py-[clamp(1rem,4vh,2rem)] text-center shadow-[0_10px_0_rgb(27_31_59/0.25),0_30px_60px_-10px_rgb(0_0_0/0.5)]">
            {BULBS.map((b, i) => (
              <span
                key={i}
                className={cn(
                  "absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink transition-colors duration-150",
                  i < lit ? "bg-sun shadow-[0_0_10px_3px_rgb(255_201_60/0.8)]" : "bg-ink/25",
                  party && "animate-blink",
                )}
                style={{ left: `${b.left}%`, top: `${b.top}%`, animationDelay: i % 2 ? "-0.3s" : "0s" }}
              />
            ))}
            <img src={HERO_LOGO} alt="" className="mx-auto h-[clamp(4.5rem,14vh,7.5rem)] w-auto scale-125 object-contain" />
            <p className="eyebrow mt-2 text-[0.65rem] text-its md:text-xs">KPK × Ini Lho ITS! 2026</p>
            <p className="mt-2 font-display text-[clamp(1.8rem,min(4.6vw,6vh),3.1rem)] leading-[1.05] font-extrabold tracking-tight text-ink" aria-hidden="true">
              <span data-word className="inline-block">
                Kampus
              </span>{" "}
              <span data-word className="inline-block -rotate-2 rounded-[0.3em] bg-sun px-[0.2em]">
                Pulang
              </span>{" "}
              <span data-word className="inline-block">
                Kampung<span className="text-pink">!</span>
              </span>
            </p>
            <p className="mt-2 font-hand text-xl font-bold text-pink md:text-2xl">Pertunjukan segera dimulai!</p>
          </div>
        </div>
      </div>

      <IntroBar />
    </div>
  );
}
