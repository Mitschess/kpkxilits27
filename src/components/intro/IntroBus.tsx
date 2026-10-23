import { useRef } from "react";
import Bus from "@/components/deco/Bus";
import Clouds from "@/components/deco/Clouds";
import Townscape from "@/components/deco/Townscape";
import { GRESIK_DISTRICTS } from "@/data/home";
import { gsap } from "@/lib/motion";
import { HERO_LOGO, IntroBar, useIntro, type IntroProps } from "./shared";

const KM = GRESIK_DISTRICTS.find((d) => d.name === "Gresik Kota")?.km ?? 28;
// the town drawing's width in viewBox units (see Townscape)
const SCENE_WIDTH = 1660;

/**
 * A sunny morning ride: the KPK bus drives from the harbour past the cement
 * plant, Masjid Jami' and the town's landmarks while the kilometres tick up,
 * pulls up at ITS, and the morning sky lifts away onto the site.
 */
export default function IntroBus({ onDone }: IntroProps) {
  const root = useRef<HTMLDivElement>(null);

  useIntro(root, onDone, () => ({
    holdAt: 4.5,
    build: (t, q) => {
      const vw = window.innerWidth;
      const world = q("[data-world]")[0];
      const kmEl = q("[data-km]")[0];
      // Lay the whole town out at this height, one screen of sea/city on each side,
      // then pan it past the bus from the harbour to the ITS campus.
      const scale = world.getBoundingClientRect().height / 200;
      gsap.set(world, { width: SCENE_WIDTH * scale + 2 * vw });
      const from = -vw + 260 * scale; // the sea and fishing boats in view
      const to = -0.3 * vw - 1522 * scale; // ITS ends up at 70% of the screen
      // where the bus parks: centred under the ITS building
      const bus = q("[data-bus]")[0];
      const busBox = bus.getBoundingClientRect();
      const park = 0.7 * vw - (busBox.left + busBox.width / 2);
      const km = { v: 0 };

      gsap.set(world, { x: from });
      gsap.set(q("[data-title] > *"), { y: 30, autoAlpha: 0 });
      gsap.set(q("[data-bus]"), { x: -0.35 * vw });
      gsap.set(q("[data-arrive]"), { scale: 0, autoAlpha: 0 });
      gsap.set(q("[data-sampai]"), { autoAlpha: 0, y: 12 });

      t.to(q("[data-title] > *"), { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 0.1)
        .to(q("[data-bus]"), { x: 0, duration: 0.8, ease: "power2.out" }, 0.15)
        // the drive: town and road markings slide by together while the km count up
        .to(world, { x: to, duration: 3.1, ease: "power1.inOut" }, 0.6)
        .to(q("[data-dashes]"), { backgroundPositionX: `${to - from}px`, duration: 3.1, ease: "power1.inOut" }, 0.6)
        .to(
          km,
          { v: KM, duration: 3.1, ease: "power1.inOut", onUpdate: () => kmEl && (kmEl.textContent = String(Math.round(km.v))) },
          0.6,
        )
        // pulling up at ITS
        .to(q("[data-bus]"), { x: park, duration: 0.7, ease: "power2.out" }, 3.55)
        .to(q("[data-otw]"), { autoAlpha: 0, y: -12, duration: 0.3 }, 3.6)
        .to(q("[data-sampai]"), { autoAlpha: 1, y: 0, duration: 0.4 }, 3.75)
        .to(q("[data-arrive]"), { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2.2)" }, 3.95);
    },
    // the morning sky lifts away like a curtain
    exit: (t, _q, el) => {
      t.to(el, { yPercent: -100, duration: 0.95, ease: "power3.inOut" }, "exit");
    },
    still: (q) => {
      const kmEl = q("[data-km]")[0];
      if (kmEl) kmEl.textContent = String(KM);
      gsap.set(q("[data-otw]"), { autoAlpha: 0 });
      gsap.set(q("[data-sampai]"), { autoAlpha: 1 });
    },
  }));

  return (
    <div
      ref={root}
      role="status"
      aria-label="Memuat KPK × Ini Lho ITS! 2026"
      className="fixed inset-0 z-[100] overflow-hidden bg-gradient-to-b from-[#a9dcff] via-[#dcf1ff] to-[#f2fbff]"
    >
      <Clouds count={4} />

      <div data-title className="absolute inset-x-0 top-[9vh] flex flex-col items-center px-6 text-center" aria-hidden="true">
        <span className="grid h-[clamp(4rem,12vh,5.5rem)] w-[clamp(4rem,12vh,5.5rem)] place-items-center rounded-full bg-white shadow-[0_6px_0_rgb(27_31_59/0.1)] ring-4 ring-white">
          <img src={HERO_LOGO} alt="" className="h-full w-full scale-125 object-contain" />
        </span>
        <p className="eyebrow mt-4 text-[0.7rem] text-its md:text-xs">KPK × Ini Lho ITS! 2026</p>
        <p className="mt-2 font-display text-[clamp(3.5rem,13vh,7.5rem)] leading-none font-extrabold tracking-tight text-ink tabular-nums">
          <span data-km>0</span>
          <span className="text-its"> km</span>
        </p>
        <p className="relative mt-3 h-9 w-full font-hand text-2xl font-bold text-ink-soft md:text-3xl">
          <span data-otw className="absolute inset-x-0">
            Otw dari Gresik ke ITS…
          </span>
          <span data-sampai className="absolute inset-x-0 text-pink">
            Sampai! Ayo kenalan sama ITS!
          </span>
        </p>
      </div>

      {/* the town slides by behind the bus */}
      <div className="absolute inset-x-0 bottom-0" aria-hidden="true">
        <div data-world className="h-[clamp(140px,30vh,260px)] will-change-transform">
          <Townscape className="h-full" />
        </div>
        <div className="relative h-16 border-t-[3px] border-ink bg-[#4a5070] md:h-20">
          <div
            data-dashes
            className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff_0_34px,transparent_34px_68px)]"
            style={{ backgroundPositionX: "0px" }}
          />
          <div data-bus className="absolute bottom-[42%] left-[18%] w-28 md:w-40">
            <span
              data-arrive
              className="absolute -top-11 left-1/2 -translate-x-1/2 -rotate-3 rounded-full bg-pink px-3.5 py-1.5 font-display text-sm font-extrabold whitespace-nowrap text-white shadow-[0_4px_0_#db2b81] md:text-base"
            >
              Sampai di ITS!
            </span>
            <Bus className="w-full animate-bump drop-shadow-[0_6px_0_rgb(27_31_59/0.25)]" />
          </div>
        </div>
      </div>

      <IntroBar light />
    </div>
  );
}
