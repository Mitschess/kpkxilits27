import { useRef, useState } from "react";
import Lantern from "@/components/lantern/Lantern";
import SectionHeading from "@/components/ui/SectionHeading";
import { VALUES } from "@/data/home";
import { gsap, ScrollTrigger, scrollToY, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS = VALUES.length;
const EMOJI = ["🧭", "🎭", "🤝", "🚀"];

/**
 * The four values of the logo painted on the four faces of one big lantern.
 * On desktop the section pins and scrolling turns the lantern face by face.
 */
export default function PhilosophySection() {
  const root = useRef<HTMLElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        setPinned(true);
        let current = 0;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${STEPS * 85}%`,
            pin: true,
            scrub: 0.8,
            snap: { snapTo: 1 / (STEPS - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut", delay: 0.05 },
            onUpdate: (self) => {
              const i = Math.round(self.progress * (STEPS - 1));
              if (i !== current) {
                current = i;
                setActive(i);
              }
            },
          },
        });
        // a slight angle keeps two faces in view, so it reads as a box
        tl.fromTo(cube.current, { rotateX: -12, rotateY: -22 }, { rotateY: -22 - 90 * (STEPS - 1), ease: "none" });
        trigger.current = tl.scrollTrigger ?? null;
        return () => {
          setPinned(false);
          trigger.current = null;
        };
      });
    },
    { scope: root },
  );

  // Clicking a value scrolls to the point where the lantern shows it
  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return setActive(i);
    scrollToY(st.start + ((st.end - st.start) * i) / (STEPS - 1));
  };

  const value = VALUES[active];

  return (
    <section ref={root} id="filosofi" className="relative isolate overflow-hidden bg-sun-light lg:h-[100svh]">
      {/* sunburst behind the lantern, tinted by the face in front */}
      <div className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[160vmax] -translate-x-1/2 -translate-y-1/2 lg:left-1/4">
        <div className="h-full w-full animate-spin-slow rounded-full bg-[repeating-conic-gradient(rgb(255_201_60/0.32)_0deg_9deg,transparent_9deg_18deg)]" />
      </div>
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{ background: `radial-gradient(circle at 26% 55%, ${value.color}38 0%, transparent 42%)` }}
      />

      <div className="mx-auto grid h-full max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-0">
        {/* the lantern */}
        <div className="order-2 flex flex-col items-center lg:order-1">
          <div className="relative mt-20 lg:mt-24">
            <Lantern
              ref={cube}
              size={200}
              faces={VALUES.map((v) => v.art)}
              spin={!pinned}
              spinDuration={16}
              className="scale-[0.8] md:scale-100"
            />
          </div>
          <div className="mt-24 h-5 w-48 rounded-[100%] bg-ink/15 blur-md" />
          <p className="mt-3 hidden -rotate-2 font-hand text-2xl font-bold text-ink-soft lg:block">Gulir buat muterin lampionnya ↓</p>
        </div>

        {/* the meaning */}
        <div className="order-1 lg:order-2">
          <SectionHeading stop="02" emoji="🏮" label="Filosofi Logo" highlight="#ffffff" title={<>Empat nilai dalam <em>satu lampion</em>.</>} />

          <div data-reveal className="mt-7 flex items-center gap-4 rounded-[1.5rem] bg-white/70 p-3 pr-5 ring-2 ring-ink/10">
            <img src="/images/logo/hero.webp" alt="Logo KPK × ILITS 2026" className="h-16 w-16 shrink-0 rounded-2xl bg-white object-contain" />
            <p className="text-sm leading-relaxed font-medium text-ink-soft">
              Logo KPK × ILITS 2026 merangkum perjalanan dari kampung halaman menuju masa depan, lewat empat nilai ini.
            </p>
          </div>

          <ol className="mt-6 space-y-2.5">
            {VALUES.map((v, i) => {
              const on = !pinned || i === active;
              return (
                <li key={v.name} data-reveal>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    disabled={!pinned}
                    className={cn(
                      "group flex w-full items-start gap-4 rounded-[1.5rem] p-4 text-left ring-2 transition-all duration-500 ease-bounce disabled:cursor-default",
                      on ? "bg-white shadow-[0_5px_0_rgb(27_31_59/0.1)] ring-ink/10" : "opacity-55 ring-transparent hover:opacity-90",
                      pinned && on && "scale-[1.02]",
                    )}
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl"
                      style={{ background: `${v.color}26`, boxShadow: on ? `inset 0 0 0 2px ${v.color}` : undefined }}
                      aria-hidden="true"
                    >
                      {EMOJI[i]}
                    </span>
                    <span className="flex-1 pt-1">
                      <span className="block font-display text-2xl font-extrabold tracking-tight text-ink">{v.name}</span>
                      <span className={cn("grid transition-all duration-500", on ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                        <span className="overflow-hidden text-pretty text-ink-soft">{v.text}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
