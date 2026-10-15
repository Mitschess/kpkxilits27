import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
import Bunting from "@/components/deco/Bunting";
import Clouds from "@/components/deco/Clouds";
import Road from "@/components/deco/Road";
import Sun from "@/components/deco/Sun";
import Townscape from "@/components/deco/Townscape";
import { buttonClass } from "@/components/ui/button";
import { FACULTIES } from "@/data/faculties";
import { gsap, useGSAP } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";

const RING_TEXT = "KAMPUS PULANG KAMPUNG ✦ KPK × INI LHO ITS! 2026 ✦ AYO KENALAN SAMA ITS ✦";

const STICKERS = [
  { text: `🎓 ${FACULTIES.length} fakultas`, position: "top-[6%] -left-2 -rotate-6 md:-left-6", style: "bg-pink text-white" },
  { text: "🚌 Gresik → ITS", position: "bottom-[14%] -left-4 rotate-3 md:-left-10", style: "bg-mint text-white" },
  { text: "✨ Buat siswa SMA/K", position: "top-[44%] -right-3 rotate-6 md:-right-8", style: "bg-white text-ink" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-hero-word]", { yPercent: 120, rotate: 6 });
        gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
        gsap.set("[data-hero-badge]", { scale: 0.4, rotate: -25, opacity: 0 });
        gsap.set("[data-hero-sticker]", { scale: 0, opacity: 0 });
        gsap.set("[data-hero-lantern]", { y: -220 });

        const play = () => {
          gsap
            .timeline({ defaults: { ease: "back.out(1.7)" } })
            .to("[data-hero-word]", { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.09 }, 0)
            .to("[data-hero-badge]", { scale: 1, rotate: 0, opacity: 1, duration: 1.1, ease: "elastic.out(1, 0.6)" }, 0.15)
            .to("[data-hero-lantern]", { y: 0, duration: 1.6, stagger: 0.15, ease: "elastic.out(1, 0.5)" }, 0.2)
            .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.45)
            .to("[data-hero-sticker]", { scale: 1, opacity: 1, duration: 0.6, stagger: 0.12 }, 0.8);
        };
        return onIntroDone(play);
      });
    },
    { scope: root },
  );

  // the logo badge leans gently towards the mouse
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>("[data-tilt]");
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const onMove = (e: MouseEvent) => {
      ry((e.clientX / window.innerWidth - 0.5) * 16);
      rx((e.clientY / window.innerHeight - 0.5) * -12);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={root}
      id="beranda"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#a9dcff] via-[#dcf1ff] to-[#f2fbff] pt-24"
    >
      <Sun className="absolute -top-28 -left-28 -z-10 h-80 w-80 md:-top-36 md:-left-24 md:h-[26rem] md:w-[26rem]" />
      <Clouds className="-z-10" />
      <Bunting className="absolute inset-x-0 top-[76px] -z-10 md:top-[84px]" flags={24} sag={34} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-24 pb-10 md:pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        {/* copy */}
        <div className="relative z-10">
          <p data-hero-fade className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-[0_3px_0_rgb(27_31_59/0.12)] ring-2 ring-ink/10">
            <span className="inline-block animate-wiggle" aria-hidden="true">
              👋
            </span>
            Halo, siswa SMA/K se-Kabupaten Gresik!
          </p>

          <h1 className="mt-7 font-display text-[clamp(3.3rem,8.4vw,7.6rem)] leading-[0.92] font-extrabold tracking-[-0.04em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-word className="inline-block">
                Kampus
              </span>
            </span>
            <span className="block overflow-hidden pt-[0.06em] pb-[0.14em]">
              {/* GSAP animates the outer span; the tilt lives on the inner one so it survives */}
              <span data-hero-word className="inline-block">
                <span className="inline-block -rotate-2 rounded-[0.32em] bg-sun px-[0.22em] pb-[0.06em] shadow-[0_0.09em_0_#e5a500]">
                  Pulang
                </span>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-word className="inline-block">
                Kampung<span className="text-pink">!</span>
              </span>
            </span>
          </h1>

          <p data-hero-fade className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft md:text-xl">
            Jelajahi potensi daerahmu dan temukan jalan menuju masa depan gemilang bersama{" "}
            <strong className="font-bold text-its">Institut Teknologi Sepuluh Nopember</strong>.
          </p>

          <div data-hero-fade className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link to="/#acara" className={buttonClass("sun", "px-7 text-base")}>
              Lihat rangkaian acara
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/#fakultas" className={buttonClass("white", "px-7 text-base")}>
              Kenalan sama fakultas
            </Link>
          </div>

          <div data-hero-fade className="mt-9 flex flex-wrap gap-3 text-sm font-semibold text-ink">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 ring-2 ring-ink/10">
              <CalendarDays size={16} className="text-pink" /> 5 – 24 Januari 2026
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 ring-2 ring-ink/10">
              <MapPin size={16} className="text-mint" /> Kabupaten Gresik
            </span>
          </div>
        </div>

        {/* logo badge with hanging lanterns */}
        <div className="relative mx-auto w-full max-w-[26rem] [perspective:1000px] lg:max-w-[30rem]">
          <div className="pointer-events-none absolute -top-40 -left-4 hidden md:block" aria-hidden="true">
            <div data-hero-lantern>
              <div className="animate-bob">
                <Lantern size={62} faces={SCENE_SETS[1]} spinDuration={14} />
              </div>
            </div>
          </div>
          {/* phones stack the badge under the copy, where a hanging lantern would cover the buttons */}
          <div className="pointer-events-none absolute -top-44 -right-2 z-20 hidden md:block" aria-hidden="true">
            <div data-hero-lantern>
              <div className="animate-bob" style={{ animationDelay: "-2s" }}>
                <Lantern size={74} faces={SCENE_SETS[0]} spinDuration={18} />
              </div>
            </div>
          </div>

          <div data-hero-badge>
            <div data-tilt className="relative aspect-square">
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
                <defs>
                  <path id="ring" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
                </defs>
                {/* textLength = circumference, so the phrase wraps the circle exactly once */}
                <text fontFamily="Bricolage Grotesque Variable, sans-serif" fontWeight="800" fontSize="21" fill="#1b1f3b">
                  <textPath href="#ring" textLength={Math.floor(2 * Math.PI * 176) - 4} lengthAdjust="spacing">
                    {RING_TEXT}
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-[13%] rounded-full bg-white shadow-[0_10px_0_rgb(27_31_59/0.1),0_30px_60px_-20px_rgb(47_91_234/0.45)] ring-4 ring-white" />
              <div className="absolute inset-[13%] rounded-full bg-[conic-gradient(from_0deg,#fff2c4,#ffe1ef,#d3f7eb,#e2f3ff,#fff2c4)] opacity-70" />
              <img
                src="/images/logo/hero.webp"
                alt="Logo KPK × Ini Lho ITS! 2026"
                width={810}
                height={810}
                fetchPriority="high"
                className="absolute inset-[11%] h-[78%] w-[78%] scale-110 object-contain drop-shadow-[0_10px_14px_rgb(27_31_59/0.18)]"
              />
            </div>
          </div>

          {STICKERS.map((s) => (
            <span key={s.text} className={`absolute z-10 ${s.position}`}>
              <span
                data-hero-sticker
                className={`block rounded-full px-4 py-2 text-sm font-extrabold whitespace-nowrap shadow-[0_4px_0_rgb(27_31_59/0.18)] ring-2 ring-ink/10 ${s.style}`}
              >
                {s.text}
              </span>
            </span>
          ))}
        </div>
      </div>

      <Townscape className="h-[130px] md:h-[200px]" />
      <Road />
    </section>
  );
}
