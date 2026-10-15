import { useRef } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENTS } from "@/data/home";
import { gsap, useGSAP } from "@/lib/motion";

/**
 * The event line-up as stops along a route. On desktop the section pins and
 * vertical scrolling drives the cards sideways; on phones it's a vertical timeline.
 */
export default function EventsSection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });

        // each photo drifts a little inside its frame as it travels
        gsap.utils.toArray<HTMLElement>("[data-event-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="acara" className="relative isolate overflow-hidden bg-night-950 lg:h-[100svh]">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 60% 50% at 85% 70%, rgb(236 59 146 / 0.13), transparent 60%)" }}
      />

      <div
        ref={track}
        className="relative flex flex-col gap-10 px-6 py-28 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-12 lg:py-0 lg:pr-[14vw] lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        <div className="shrink-0 lg:w-[min(32rem,36vw)]">
          <SectionHeading
            stop="03"
            label="Rangkaian Acara"
            title={<>Lima <em>pemberhentian</em> menuju ITS.</>}
            description="Dari kunjungan ke sekolahmu sampai pesta penutupan. Ikuti rutenya, jangan sampai ketinggalan satu pun."
          />
          <p data-reveal className="mt-8 hidden items-center gap-2 text-sm text-lantern lg:flex">
            Terus gulir <ArrowRight size={16} className="animate-pulse" />
          </p>
        </div>

        {/* mobile timeline line */}
        <ol className="relative flex flex-col gap-10 border-l border-dashed border-paper/20 pl-6 lg:flex-row lg:gap-10 lg:border-0 lg:pl-0">
          {/* the road the stops sit on (desktop) */}
          <li
            aria-hidden="true"
            className="pointer-events-none absolute -right-[14vw] -bottom-[34px] -left-12 hidden h-px bg-[repeating-linear-gradient(to_right,rgb(255_243_220/0.3)_0_10px,transparent_10px_20px)] lg:block"
          />
          {EVENTS.map((e, i) => (
            <li key={e.title} data-reveal className="relative lg:w-[min(27rem,30vw)] lg:shrink-0">
              {/* stop marker */}
              <span className="absolute top-2 -left-[31px] h-3 w-3 rounded-full bg-lantern shadow-[0_0_14px_3px_rgb(255_178_63/0.6)] lg:hidden" />

              <article className="group relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] ring-1 ring-paper/10">
                  <img
                    data-event-img
                    src={e.image}
                    alt={e.title}
                    decoding="async"
                    className="absolute inset-0 h-full w-full scale-[1.18] object-cover saturate-[0.85] transition duration-700 group-hover:saturate-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/20 to-transparent" />
                  <div className="absolute inset-0 bg-lantern/10 mix-blend-overlay" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-night-950/70 px-3 py-1.5 text-xs font-medium text-paper backdrop-blur">
                    <CalendarDays size={13} className="text-lantern" /> {e.date}
                  </span>
                  <span className="absolute right-5 bottom-2 font-display text-[6.5rem] leading-none font-bold text-transparent [-webkit-text-stroke:1.5px_rgb(255_243_220/0.55)]">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight text-paper">{e.title}</h3>
                <p className="mt-2 text-mist">{e.desc}</p>
                {/* stop on the road (desktop) */}
                <span className="absolute -bottom-10 left-0 hidden h-3 w-3 rounded-full bg-lantern shadow-[0_0_14px_3px_rgb(255_178_63/0.6)] lg:block" />
              </article>
            </li>
          ))}
        </ol>
      </div>

      {/* progress along the route */}
      <div className="absolute right-6 bottom-8 left-6 mx-auto hidden h-0.5 max-w-7xl overflow-hidden rounded-full bg-paper/10 lg:block">
        <div ref={progress} className="h-full origin-left bg-lantern" />
      </div>
    </section>
  );
}
