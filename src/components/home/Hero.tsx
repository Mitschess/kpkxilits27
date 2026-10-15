import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { SCENE_SETS } from "@/components/lantern/Lantern";
import Bunting from "@/components/deco/Bunting";
import Clouds from "@/components/deco/Clouds";
import Road from "@/components/deco/Road";
import Townscape from "@/components/deco/Townscape";
import { buttonClass } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";

const RING_TEXT = "KAMPUS PULANG KAMPUNG ✦ KPK × INI LHO ITS! 2026 ✦ AYO KENALAN SAMA ITS ✦";


export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-hero-word]", { yPercent: 120, rotate: 6 });
        gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
        gsap.set("[data-hero-badge]", { scale: 0.4, rotate: -25, opacity: 0 });

        const play = () => {
          gsap
            .timeline({ defaults: { ease: "back.out(1.7)" } })
            .to("[data-hero-word]", { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.09 }, 0)
            .to("[data-hero-badge]", { scale: 1, rotate: 0, opacity: 1, duration: 1.1, ease: "elastic.out(1, 0.6)" }, 0.15)
            .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.45);
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
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-b from-[#a9dcff] via-[#dcf1ff] to-[#f2fbff]"
    >
      <Clouds className="-z-10" />
      {/* damar kurung hang from the bunting rope, clear of the navbar */}
      <Bunting className="absolute inset-x-0 top-[76px] md:hidden" flags={14} sag={30} />
      <Bunting
        className="absolute inset-x-0 top-[84px] hidden md:block"
        flags={32}
        sag={30}
        lanterns={[
          { at: 0.47, size: 52, faces: SCENE_SETS[1], className: "hidden lg:block" },
          { at: 0.91, size: 60, faces: SCENE_SETS[0], className: "hidden md:block" },
        ]}
      />

      {/* Sized against the viewport height too, so copy + badge + town all fit on the first screen */}
      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-6 pt-[clamp(7.5rem,19vh,11rem)] pb-6 lg:pb-3 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
        {/* copy */}
        <div className="relative z-10">
          <h1 className="font-display text-[clamp(2.9rem,min(7.6vw,8.2vh),7rem)] leading-[0.92] font-extrabold tracking-[-0.04em] text-ink">
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

          <p data-hero-fade className="mt-4 max-w-lg text-lg leading-relaxed text-pretty text-ink-soft [@media(max-height:820px)]:text-base">
            Jelajahi potensi daerahmu dan temukan jalan menuju masa depan gemilang bersama{" "}
            <strong className="font-bold text-its">Institut Teknologi Sepuluh Nopember</strong>.
          </p>

          <div data-hero-fade className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link to="/#acara" className={buttonClass("sun", "px-7 text-base")}>
              Lihat rangkaian acara
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/fakultas" className={buttonClass("white", "px-7 text-base")}>
              Kenalan sama fakultas
            </Link>
          </div>
        </div>

        {/* logo badge */}
        <div className="relative mx-auto" style={{ width: "min(100%, 30rem, 52vh)" }}>
          <div className="[perspective:1000px]">
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
          </div>
        </div>
      </div>

      <div className="relative">
        <Townscape className="h-[clamp(64px,12vh,170px)]" />
        <Road />
      </div>
    </section>
  );
}
