import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowDown, ArrowRight, CalendarDays, MapPin, Route } from "lucide-react";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
import Skyline from "@/components/ui/Skyline";
import Starfield from "@/components/ui/Starfield";
import { buttonClass } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";

// Hanging lanterns: position (desktop), size, depth for parallax, bob delay
const LANTERNS = [
  // phones: only the big one, shrunk into the gap beside the title
  { pos: "right-[3%] top-[15%] origin-top-right scale-[0.55] lg:right-[13%] lg:top-[17%] lg:scale-100", size: 150, depth: 1, delay: 0, faces: SCENE_SETS[0], spin: 26 },
  { pos: "hidden md:block right-[36%] top-[9%]", size: 78, depth: 0.55, delay: 1.2, faces: SCENE_SETS[1], spin: 18 },
  { pos: "hidden md:block right-[3%] top-[50%]", size: 70, depth: 0.7, delay: 2.1, faces: SCENE_SETS[2], spin: 20 },
  { pos: "hidden md:block right-[30%] top-[52%]", size: 96, depth: 0.85, delay: 0.6, faces: SCENE_SETS[3], spin: 24 },
  { pos: "hidden md:block right-[48%] top-[26%]", size: 46, depth: 0.35, delay: 1.7, faces: SCENE_SETS[2], spin: 16 },
];

const TITLE = [
  { text: "Kampus", className: "" },
  { text: "Pulang", className: "font-serif font-normal italic text-gold text-glow pr-4" },
  { text: "Kampung", className: "" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // entrance — waits for the loading screen
        // lines rise out of a mask; the mask is lifted afterwards so the glow isn't cropped
        gsap.set("[data-hero-mask]", { overflow: "hidden" });
        gsap.set("[data-hero-line]", { yPercent: 110 });
        gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
        gsap.set("[data-hero-lantern]", { opacity: 0, y: -160 });
        gsap.set("[data-hero-skyline]", { yPercent: 40, opacity: 0 });

        const play = () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to("[data-hero-skyline]", { yPercent: 0, opacity: 1, duration: 1.6 }, 0)
            .to("[data-hero-lantern]", { opacity: 1, y: 0, duration: 2, stagger: 0.12, ease: "elastic.out(1, 0.6)" }, 0.1)
            .to("[data-hero-line]", { yPercent: 0, duration: 1.3, stagger: 0.1 }, 0.25)
            .set("[data-hero-mask]", { overflow: "visible" })
            .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.7);
        };
        const unsubscribe = onIntroDone(play);

        // leaving the hero: lanterns drift up faster than the text
        gsap.to("[data-hero-sky]", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: 12,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return unsubscribe;
      });
    },
    { scope: root },
  );

  // mouse parallax on the lantern layer
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>("[data-depth]");
    if (!els?.length || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const movers = [...els].map((el) => ({
      depth: Number(el.dataset.depth),
      x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
    }));
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(dx * -40 * m.depth);
        m.y(dy * -24 * m.depth);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={root}
      id="beranda"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night-950"
    >
      {/* night sky */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 72% 18%, #1b2866 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 90%, rgb(236 59 146 / 0.14) 0%, transparent 60%), linear-gradient(180deg, #050920 0%, #0a1033 60%, #0d1540 100%)",
        }}
      />
      <Starfield className="-z-10" />

      {/* lanterns */}
      <div data-hero-sky className="pointer-events-none absolute inset-0 -z-10 md:opacity-50 lg:opacity-100">
        {LANTERNS.map((l, i) => (
          <div key={i} className={`absolute ${l.pos}`}>
            <div data-depth={l.depth}>
              <div data-hero-lantern>
                <div className="animate-bob" style={{ animationDelay: `-${l.delay}s` }}>
                  <Lantern size={l.size} faces={l.faces} spinDuration={l.spin} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* copy */}
      <div data-hero-copy className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pt-28 pb-44 md:pb-56">
        <h1 className="font-display text-[clamp(3.4rem,9vw,8.25rem)] leading-[0.88] font-semibold tracking-[-0.045em] text-paper">
          {TITLE.map((line) => (
            <span key={line.text} data-hero-mask className="block pb-[0.06em]">
              <span data-hero-line className={`inline-block ${line.className}`}>
                {line.text}
              </span>
            </span>
          ))}
        </h1>

        <p data-hero-fade className="mt-7 max-w-xl text-lg leading-relaxed text-pretty text-mist md:text-xl">
          Jelajahi potensi daerahmu dan temukan jalan menuju masa depan gemilang bersama Institut Teknologi Sepuluh
          Nopember.
        </p>

        <div data-hero-fade className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="/#acara" className={buttonClass("lantern")}>
            Lihat rangkaian acara
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/#fakultas" className={buttonClass("ghost")}>
            Jelajahi fakultas
          </Link>
        </div>

        <dl data-hero-fade className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-paper/80">
          {[
            { icon: CalendarDays, label: "Waktu", value: "5 – 24 Januari 2026" },
            { icon: MapPin, label: "Lokasi", value: "Kabupaten Gresik" },
            { icon: Route, label: "Rute", value: "Gresik → ITS Surabaya" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={16} className="text-lantern" />
              <dt className="sr-only">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Gresik at night */}
      <div data-hero-skyline className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-24 bg-gradient-to-b from-transparent to-night-950/0" />
        <Skyline className="h-[130px] md:h-[200px]" />
      </div>

      <Link
        to="/#tentang"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs text-paper/70 transition hover:text-lantern"
      >
        {/* GSAP animates the inner span so it never touches the centering translate */}
        <span data-hero-fade className="flex flex-col items-center gap-2">
          <span className="eyebrow text-[0.62rem]">Mulai perjalanan</span>
          <ArrowDown size={16} className="animate-bounce" />
        </span>
      </Link>
    </section>
  );
}
