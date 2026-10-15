import { useRef } from "react";
import { ArrowRight, CalendarDays, GraduationCap } from "lucide-react";
import SectionFade from "@/components/deco/SectionFade";
import Bus from "@/components/deco/Bus";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENTS } from "@/data/home";
import { gsap, useGSAP } from "@/lib/motion";

const TINTS = ["#ffc93c", "#ff4fa3", "#1fbf9a", "#9b7bff", "#ff8a3d"];

/**
 * The event line-up as stops along the road to ITS. On desktop the section pins
 * and vertical scrolling drives the cards (and the bus) sideways; on phones
 * it's a vertical timeline.
 */
export default function EventsSection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bus = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const scroll = { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.9, invalidateOnRefresh: true };
        gsap.to(track.current, { x: () => -distance(), ease: "none", scrollTrigger: { ...scroll, pin: true } });
        // the bus drives along the bottom as you go
        gsap.fromTo(bus.current, { left: "2%" }, { left: "88%", ease: "none", scrollTrigger: scroll });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="acara" className="dots-light relative isolate overflow-hidden bg-its lg:h-[100svh]">
      <SectionFade edge="top" color="var(--color-its)" className="h-20 lg:h-28" />
      <div
        ref={track}
        className="relative flex flex-col gap-10 px-6 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:py-0 lg:pr-[14vw] lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        <div className="shrink-0 lg:w-[min(30rem,34vw)]">
          <SectionHeading
            inverted
            icon={CalendarDays}
            label="Rangkaian Acara"
            title={<>Lima <em>pemberhentian</em> menuju ITS.</>}
            description="Dari kunjungan ke sekolahmu sampai pesta penutupan. Ikuti rutenya, jangan sampai ketinggalan satu pun!"
          />
          <p data-reveal className="mt-8 hidden -rotate-2 items-center gap-2 font-hand text-2xl font-bold text-sun lg:flex">
            Terus gulir, busnya jalan! <ArrowRight size={20} />
          </p>
        </div>

        <ol className="relative flex flex-col gap-8 border-l-4 border-dashed border-white/40 pl-6 lg:flex-row lg:gap-8 lg:border-0 lg:pl-0">
          {EVENTS.map((e, i) => (
            <li key={e.title} data-reveal className="relative lg:w-[min(24rem,28vw)] lg:shrink-0">
              {/* stop marker on the mobile timeline */}
              <span className="absolute top-6 -left-[38px] grid h-6 w-6 place-items-center rounded-full border-[3px] border-ink bg-sun lg:hidden" />

              <article
                className={`group card relative p-3 transition duration-300 ease-bounce hover:-translate-y-2 ${i % 2 ? "lg:mt-16 lg:rotate-1" : "lg:-rotate-1"}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem]">
                  <img
                    src={e.image}
                    alt={e.title}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                  />
                  <span
                    className="absolute top-3 left-3 grid h-12 w-12 place-items-center rounded-full border-[3px] border-ink font-display text-lg font-extrabold text-ink"
                    style={{ background: TINTS[i % TINTS.length] }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="px-3 pt-4 pb-3">
                  <span className="inline-flex -rotate-1 items-center gap-1.5 rounded-full bg-sun-light px-3 py-1 text-xs font-bold text-ink ring-2 ring-sun">
                    <CalendarDays size={13} /> {e.date}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-tight font-extrabold tracking-tight text-ink">{e.title}</h3>
                  <p className="mt-1 text-ink-soft">{e.desc}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>

      {/* road with the bus (desktop) */}
      <div className="absolute inset-x-0 bottom-0 hidden h-14 border-t-[3px] border-ink bg-[#4a5070] lg:block" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff_0_34px,transparent_34px_68px)]" />
        <div ref={bus} className="absolute bottom-[40%] w-28">
          <Bus className="w-full" />
        </div>
        <span className="absolute right-6 bottom-full mb-2 inline-flex items-center gap-1.5 rounded-lg border-[3px] border-ink bg-sun px-2.5 py-1 text-sm font-extrabold text-ink">
          ITS <GraduationCap size={16} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
