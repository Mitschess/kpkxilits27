import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap, useGSAP } from "@/lib/motion";
import { ROUTE_STOPS } from "@/data/home";
import { cn } from "@/lib/utils";

/**
 * The journey from Gresik to ITS as a vertical route on the left edge:
 * fills with light as you scroll, one stop per section. Large screens only.
 */
export default function RouteRail() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useGSAP(() => {
    gsap.fromTo(
      fillRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        // refreshed after the pinned sections so their spacing is included
        scrollTrigger: { trigger: "#tentang", start: "top center", endTrigger: "#galeri", end: "bottom center", scrub: true, refreshPriority: -1 },
      },
    );
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ROUTE_STOPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const activeIndex = ROUTE_STOPS.findIndex((s) => s.id === active);

  return (
    <nav
      aria-label="Rute halaman"
      className={cn(
        "fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 flex-col items-center transition-opacity duration-500 min-[1400px]:flex",
        // hidden while the event cards slide sideways underneath it
        active && active !== "acara" ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <span className="eyebrow mb-3 text-[0.6rem] text-mist/70 [writing-mode:vertical-rl]">Gresik</span>
      <div className="relative flex flex-col gap-7 py-2">
        <div className="absolute top-0 bottom-0 left-[4.5px] w-px bg-[repeating-linear-gradient(to_bottom,rgb(255_243_220/0.25)_0_4px,transparent_4px_9px)]" />
        <div
          ref={fillRef}
          className="absolute top-0 bottom-0 left-[4.5px] w-px origin-top bg-lantern shadow-[0_0_10px_rgb(255_178_63)]"
        />
        {ROUTE_STOPS.map((s, i) => {
          const isActive = s.id === active;
          return (
            <Link key={s.id} to={`/#${s.id}`} className="group relative flex items-center" aria-current={isActive ? "location" : undefined}>
              <span
                className={cn(
                  "relative z-10 block h-2.5 w-2.5 rounded-full border transition-all duration-300",
                  i <= activeIndex ? "border-lantern bg-lantern" : "border-paper/40 bg-night-950",
                  isActive && "scale-150 shadow-[0_0_14px_3px_rgb(255_178_63/0.7)]",
                )}
              />
              <span
                className={cn(
                  "eyebrow pointer-events-none absolute left-6 rounded-full bg-night-950/90 px-2.5 py-1 text-[0.6rem] whitespace-nowrap opacity-0 ring-1 ring-paper/10 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  isActive ? "text-lantern" : "-translate-x-1 text-paper/70",
                )}
              >
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>
      <span className="eyebrow mt-3 text-[0.6rem] text-lantern [writing-mode:vertical-rl]">ITS</span>
    </nav>
  );
}
