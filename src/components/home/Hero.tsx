import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { SCENE_SETS } from "@/components/lantern/Lantern";
import Bunting from "@/components/deco/Bunting";
import Clouds from "@/components/deco/Clouds";
import Road from "@/components/deco/Road";
import Townscape from "@/components/deco/Townscape";
import { buttonClass } from "@/components/ui/button";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";



const FIREWORK_COLORS = ["#ffc93c", "#ff4fa3", "#1fbf9a", "#2f5bea", "#ff8a3d", "#9b7bff", "#ffffff"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<HTMLCanvasElement>(null);

  // Fireworks from behind the logo while the pointer is on it (a tap gives a short show).
  useEffect(() => {
    const badge = badgeRef.current;
    const canvas = fireworksRef.current;
    if (!badge || !canvas || prefersReducedMotion()) return;
    const fire = confetti.create(canvas, { resize: true, useWorker: false });
    let timer = 0;
    let tapTimer = 0;
    // The canvas is 1.8x the badge, so the white disc is about 0.24 of it from the centre:
    // shells burst just outside it and the sparks fall back behind the logo.
    const burst = () => {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.27 + Math.random() * 0.1;
      fire({
        origin: { x: 0.5 + Math.cos(angle) * r, y: 0.5 + Math.sin(angle) * r * 0.85 },
        // a tight ring of sparks that opens fast, hangs, then drifts down
        particleCount: 55,
        spread: 360,
        startVelocity: 20 + Math.random() * 8,
        gravity: 0.45,
        decay: 0.89,
        ticks: 85,
        scalar: 1.05,
        shapes: ["star", "circle"],
        colors: FIREWORK_COLORS,
      });
    };
    const start = () => {
      if (timer) return;
      burst();
      window.setTimeout(burst, 160);
      timer = window.setInterval(burst, 480);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const onEnter = (e: PointerEvent) => e.pointerType === "mouse" && start();
    const onLeave = (e: PointerEvent) => e.pointerType === "mouse" && stop();
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      start();
      window.clearTimeout(tapTimer);
      tapTimer = window.setTimeout(stop, 1600);
    };
    badge.addEventListener("pointerenter", onEnter);
    badge.addEventListener("pointerleave", onLeave);
    badge.addEventListener("pointerdown", onTap);
    return () => {
      stop();
      window.clearTimeout(tapTimer);
      fire.reset();
      badge.removeEventListener("pointerenter", onEnter);
      badge.removeEventListener("pointerleave", onLeave);
      badge.removeEventListener("pointerdown", onTap);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Grab the elements now: `play` runs later from the intro, whose own GSAP
        // scope would otherwise be used to resolve selector strings.
        const q = gsap.utils.selector(root);
        const words = q("[data-hero-word]");
        const fades = q("[data-hero-fade]");
        const badge = q("[data-hero-badge]");
        gsap.set(words, { yPercent: 120, rotate: 6 });
        gsap.set(fades, { opacity: 0, y: 24 });
        gsap.set(badge, { scale: 0.4, rotate: -25, opacity: 0 });

        const play = () => {
          gsap
            .timeline({ defaults: { ease: "back.out(1.7)" } })
            .to(words, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.09 }, 0)
            .to(badge, { scale: 1, rotate: 0, opacity: 1, duration: 1.1, ease: "elastic.out(1, 0.6)" }, 0.15)
            .to(fades, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.45);
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

        {/* logo badge; fireworks go off behind it while you point at it */}
        <div ref={badgeRef} className="relative mx-auto" style={{ width: "min(100%, 30rem, 52vh)" }}>
          {/* outside the 3D wrapper so it can sit behind the badge (perspective makes a stacking context) */}
          <canvas ref={fireworksRef} className="pointer-events-none absolute -inset-[40%] -z-10 h-[180%] w-[180%]" aria-hidden="true" />
          <div className="[perspective:1000px]">
            <div data-hero-badge>
              <div data-tilt className="relative aspect-square">
                <div className="absolute inset-[7%] rounded-full bg-white shadow-[0_10px_0_rgb(27_31_59/0.1),0_30px_60px_-20px_rgb(47_91_234/0.45)] ring-4 ring-white" />
                <div className="absolute inset-[7%] rounded-full bg-[conic-gradient(from_0deg,#fff2c4,#ffe1ef,#d3f7eb,#e2f3ff,#fff2c4)] opacity-70" />
                <img
                  src="/images/logo/hero.webp"
                  alt="Logo KPK × Ini Lho ITS! 2026"
                  width={810}
                  height={810}
                  fetchPriority="high"
                  className="absolute inset-[4%] h-[92%] w-[92%] scale-110 object-contain drop-shadow-[0_10px_14px_rgb(27_31_59/0.18)]"
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
