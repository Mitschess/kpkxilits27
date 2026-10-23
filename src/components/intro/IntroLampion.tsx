import { useRef, useState } from "react";
import Bunting from "@/components/deco/Bunting";
import Townscape from "@/components/deco/Townscape";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
import { gsap } from "@/lib/motion";
import { HERO_LOGO, IntroBar, useIntro, type IntroProps } from "./shared";

// same counts as the hero bunting
const FLAGS = 32;
const FLAGS_MOBILE = 14;
// where the lantern lands and the logo appears (and where the portal opens from)
const STAGE_Y = "36%";

// a fixed sky, so it looks the same on every visit
const STARS = Array.from({ length: 70 }, (_, i) => {
  const rand = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return { left: rand(1) * 100, top: rand(2) * 72, size: 1.5 + rand(3) * 2.5, delay: rand(4) * 2.6 };
});

/**
 * Night falls on Gresik: stars come out, a damar kurung lowers on its cord and
 * lights up, the town draws itself in gold line art and the bunting goes up.
 * The lantern turns into the KPK × ILITS logo, then a portal opens from it onto
 * the daytime hero: from a night in the kampung to a morning at ITS.
 */
export default function IntroLampion({ onDone }: IntroProps) {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [flagsUp, setFlagsUp] = useState(0);

  useIntro(root, onDone, () => ({
    holdAt: 4.5,
    build: (t, q) => {
      const flags = { up: 0 };
      gsap.set(q("[data-stars]"), { autoAlpha: 0 });
      gsap.set(q("[data-warm]"), { autoAlpha: 0 });
      gsap.set(q("[data-glow]"), { scale: 0, autoAlpha: 0 });
      gsap.set(q("[data-lantern]"), { y: "-80vh" });
      gsap.set(q("[data-logo]"), { scale: 0, autoAlpha: 0 });
      gsap.set(q("[data-word]"), { yPercent: 115 });
      gsap.set(q("[data-eyebrow]"), { autoAlpha: 0, letterSpacing: "0.7em" });

      t.to(q("[data-stars]"), { autoAlpha: 1, duration: 1.2, ease: "power1.out" }, 0)
        // the lantern comes down on its cord, still dark
        .to(q("[data-lantern]"), { y: 0, duration: 1.15, ease: "back.out(1.25)" }, 0.15)
        // ...and lights up
        .call(() => setLit(true), [], 1.3)
        .to(q("[data-glow]"), { scale: 1, autoAlpha: 1, duration: 0.9, ease: "power2.out" }, 1.3)
        .to(q("[data-warm]"), { autoAlpha: 1, duration: 1 }, 1.35)
        // the town draws itself in gold, the bunting goes up flag by flag
        .to(q(".lineart *"), { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut", stagger: { amount: 0.7, from: "random" } }, 1.45)
        .to(flags, { up: FLAGS, duration: 1.1, ease: "none", onUpdate: () => setFlagsUp(Math.round(flags.up)) }, 1.55)
        // the lantern spins away into a flash and the logo takes its place
        .to(q("[data-lantern] .lantern"), { scale: 0.2, rotate: 25, autoAlpha: 0, duration: 0.55, ease: "power2.in" }, 2.85)
        .to(q("[data-glow]"), { scale: 1.5, duration: 0.6, ease: "power2.out" }, 2.95)
        .to(q("[data-logo]"), { scale: 1, autoAlpha: 1, duration: 1.1, ease: "elastic.out(1, 0.6)" }, 3.15)
        .to(q("[data-word]"), { yPercent: 0, duration: 0.7, stagger: 0.09 }, 3.35)
        .to(q("[data-eyebrow]"), { autoAlpha: 1, letterSpacing: "0.25em", duration: 0.9 }, 3.55);
    },
    // a portal opens from the logo onto the daytime hero
    exit: (t, _q, el) => {
      const portal = Math.hypot(window.innerWidth, window.innerHeight) + 120;
      t.to(el, { "--portal": `${portal}px`, duration: 1.15, ease: "power3.inOut" }, "exit");
    },
    still: (q) => {
      setLit(true);
      setFlagsUp(FLAGS);
      gsap.set(q(".lineart *"), { strokeDashoffset: 0 });
      gsap.set(q("[data-lantern]"), { autoAlpha: 0 });
    },
  }));

  const mask = `radial-gradient(circle at 50% ${STAGE_Y}, transparent var(--portal), #000 calc(var(--portal) + 70px))`;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Memuat KPK × Ini Lho ITS! 2026"
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ "--portal": "-80px", maskImage: mask, WebkitMaskImage: mask } as React.CSSProperties}
    >
      {/* night sky over Gresik, warming up once the lantern is lit */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#2b3d94_0%,#151d55_50%,#0b1033_100%)]" />
      <div
        data-warm
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% ${STAGE_Y}, rgb(255 201 60 / 0.3), rgb(255 138 61 / 0.1) 32%, transparent 64%)` }}
      />
      <div data-stars className="absolute inset-0" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute animate-twinkle rounded-full bg-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `-${s.delay}s` }}
          />
        ))}
      </div>

      {/* same rope and spot as the hero's bunting */}
      <Bunting className="absolute inset-x-0 top-[76px] md:hidden" flags={FLAGS_MOBILE} sag={30} shown={Math.round((flagsUp / FLAGS) * FLAGS_MOBILE)} />
      <Bunting className="absolute inset-x-0 top-[84px] hidden md:block" flags={FLAGS} sag={30} shown={flagsUp} />

      {/* the stage: lantern first, then the logo in the same spot */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: STAGE_Y }}>
        <div
          data-glow
          className="pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgb(255 215 94 / 0.5), rgb(255 138 61 / 0.16) 40%, transparent 70%)" }}
        />
        <div data-lantern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-100">
          <Lantern size={104} faces={SCENE_SETS[0]} lit={lit} spinDuration={9} />
        </div>
        <div
          data-logo
          className="relative grid h-[clamp(7rem,22vh,10.5rem)] w-[clamp(7rem,22vh,10.5rem)] place-items-center rounded-full bg-white shadow-[0_0_0_10px_rgb(255_255_255/0.08),0_0_90px_24px_rgb(255_201_60/0.45)]"
        >
          <img src={HERO_LOGO} alt="" className="h-full w-full scale-125 object-contain" />
        </div>
      </div>

      {/* title under the stage */}
      <div
        className="absolute inset-x-0 px-6 text-center"
        style={{ top: `calc(${STAGE_Y} + clamp(3.5rem, 11vh, 5.25rem) + 1.25rem)` }}
        aria-hidden="true"
      >
        <p data-eyebrow className="eyebrow text-[0.7rem] text-sun md:text-xs">
          KPK × Ini Lho ITS! 2026
        </p>
        <p className="mt-3 font-display text-[clamp(2.1rem,min(6vw,8vh),4.25rem)] leading-[1] font-extrabold tracking-tight text-white">
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-word className="inline-block">
              Kampus
            </span>
          </span>{" "}
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-word className="inline-block -rotate-2 rounded-[0.3em] bg-sun px-[0.2em] text-ink">
              Pulang
            </span>
          </span>{" "}
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-word className="inline-block">
              Kampung<span className="text-pink">!</span>
            </span>
          </span>
        </p>
      </div>

      {/* Gresik in gold line art, sitting where the hero's town is */}
      <div className="absolute inset-x-0 bottom-0" aria-hidden="true">
        <Townscape className="lineart h-[clamp(64px,12vh,170px)] drop-shadow-[0_0_6px_rgb(255_201_60/0.55)]" />
        <div className="h-14 border-t-2 border-sun/70 md:h-16" />
      </div>

      <IntroBar />
    </div>
  );
}
