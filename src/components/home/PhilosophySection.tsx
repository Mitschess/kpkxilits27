import { useRef, useState } from "react";
import Lantern from "@/components/lantern/Lantern";
import SectionHeading from "@/components/ui/SectionHeading";
import { VALUES } from "@/data/home";
import { gsap, ScrollTrigger, scrollToY, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS = VALUES.length;

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
    if (!st || !root.current) return setActive(i);
    scrollToY(st.start + ((st.end - st.start) * i) / (STEPS - 1));
  };

  const value = VALUES[active];

  return (
    <section ref={root} id="filosofi" className="relative isolate overflow-hidden bg-night-900 lg:h-[100svh]">
      {/* light takes the color of the face in front */}
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{ background: `radial-gradient(circle at 28% 55%, ${value.color}33 0%, transparent 45%)` }}
      />
      <div className="weave absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto grid h-full max-w-7xl items-center gap-12 px-6 py-28 lg:grid-cols-2 lg:py-0">
        {/* the lantern */}
        <div className="order-2 flex flex-col items-center lg:order-1">
          <div className="relative mt-16 lg:mt-24">
            <Lantern
              ref={cube}
              size={200}
              faces={VALUES.map((v) => v.art)}
              spin={!pinned}
              spinDuration={16}
              className="scale-[0.8] md:scale-100"
            />
          </div>
          <div className="mt-24 h-6 w-56 rounded-[100%] bg-black/50 blur-xl" />
          <p className="mt-2 hidden font-serif text-lg text-mist italic lg:block">
            Gulir untuk memutar lampion <span className="text-lantern not-italic">↓</span>
          </p>
        </div>

        {/* the meaning */}
        <div className="order-1 lg:order-2">
          <SectionHeading stop="02" label="Filosofi Logo" title={<>Empat cahaya dalam <em>satu lampion</em>.</>} />

          <div data-reveal className="mt-8 flex items-center gap-4">
            <img src="/images/logo/hero.webp" alt="Logo KPK × ILITS 2026" className="h-20 w-20 rounded-2xl bg-paper object-contain p-1" />
            <p className="text-sm leading-relaxed text-mist">
              Logo KPK × ILITS 2026 merangkum perjalanan dari kampung halaman menuju masa depan — lewat empat nilai ini.
            </p>
          </div>

          <ol className="mt-10 space-y-2">
            {VALUES.map((v, i) => {
              const on = !pinned || i === active;
              return (
                <li key={v.name} data-reveal>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    disabled={!pinned}
                    className={cn(
                      "group flex w-full gap-5 rounded-2xl border p-5 text-left transition-all duration-500 disabled:cursor-default",
                      on ? "border-paper/15 bg-paper/[0.04]" : "border-transparent opacity-45 hover:opacity-80",
                    )}
                  >
                    <span className="font-display text-sm font-semibold tabular-nums" style={{ color: v.color }}>
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-2xl font-semibold tracking-tight text-paper md:text-3xl">
                        {v.name}
                      </span>
                      <span
                        className={cn(
                          "grid transition-all duration-500",
                          on ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden text-pretty text-mist">{v.text}</span>
                      </span>
                    </span>
                    {pinned && (
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition" style={{ background: on ? v.color : "transparent", boxShadow: on ? `0 0 12px ${v.color}` : "none" }} />
                    )}
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
