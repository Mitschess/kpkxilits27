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
    // the hero and footer count too, so the rail can step aside there
    ["beranda", ...ROUTE_STOPS.map((s) => s.id), "kontak"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const activeIndex = ROUTE_STOPS.findIndex((s) => s.id === active);
  // shown only on a stop; hidden over the hero, the footer, and while the event cards slide past
  const visible = activeIndex >= 0 && active !== "acara";

  return (
    <nav
      aria-label="Rute halaman"
      className={cn(
        "fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 flex-col items-center transition-opacity duration-500 min-[1400px]:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <span className="mb-3 rounded-full bg-mint px-1.5 py-2 text-[0.6rem] font-extrabold tracking-widest text-white uppercase [writing-mode:vertical-rl]">Gresik</span>
      <div className="relative flex flex-col gap-7 py-2">
        <div className="absolute top-0 bottom-0 left-[4.5px] w-px bg-[repeating-linear-gradient(to_bottom,rgb(27_31_59/0.25)_0_4px,transparent_4px_9px)]" />
        <div
          ref={fillRef}
          className="absolute top-0 bottom-0 left-[4px] w-[3px] origin-top rounded-full bg-its"
        />
        {ROUTE_STOPS.map((s, i) => {
          const isActive = s.id === active;
          return (
            <Link key={s.id} to={`/#${s.id}`} className="group relative flex items-center" aria-current={isActive ? "location" : undefined}>
              <span
                className={cn(
                  "relative z-10 block h-3 w-3 rounded-full border-2 transition-all duration-300",
                  i <= activeIndex ? "border-its bg-its" : "border-ink/30 bg-white",
                  isActive && "scale-[1.7] border-ink bg-sun",
                )}
              />
              <span
                className={cn(
                  "eyebrow pointer-events-none absolute left-6 rounded-full bg-white px-2.5 py-1 text-[0.6rem] whitespace-nowrap opacity-0 shadow-[0_3px_0_rgb(27_31_59/0.12)] ring-2 ring-ink/10 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  isActive ? "text-its" : "-translate-x-1 text-ink",
                )}
              >
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>
      <span className="mt-3 rounded-full bg-its px-1.5 py-2 text-[0.6rem] font-extrabold tracking-widest text-white uppercase [writing-mode:vertical-rl]">ITS</span>
    </nav>
  );
}
