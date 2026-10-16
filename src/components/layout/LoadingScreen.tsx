import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Bunting from "@/components/deco/Bunting";
import Clouds from "@/components/deco/Clouds";
import Road from "@/components/deco/Road";
import Townscape from "@/components/deco/Townscape";
import { SCENE_SETS } from "@/components/lantern/Lantern";
import { useScrollLock } from "@/hooks/useScrollLock";
import { finishIntro } from "@/lib/intro";
import { safeStorage } from "@/lib/utils";

const SEEN_KEY = "kpk_has_loaded";
// same counts as the hero bunting
const FLAGS = 32;
const FLAGS_MOBILE = 14;
const MIN_TIME = 1800; // ms: the intro never just flashes by
const MAX_TIME = 6000; // ms: a slow asset never holds the site hostage
const HERO_LOGO = "/images/logo/hero.webp";

function caption(p: number) {
  if (p < 30) return "Lagi mbungkus Nasi Krawu…";
  if (p < 60) return "Nyumet Damar Kurung…";
  if (p < 90) return "Mancal motor nang ITS…";
  return "Siap sukses bareng KPK!";
}

/** Resolves once the first screen has what it needs: the fonts and the hero logo. */
function firstScreenReady(): Promise<void> {
  const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  const logo = new Promise<void>((done) => {
    const img = new Image();
    img.onload = img.onerror = () => done();
    img.src = HERO_LOGO;
  });
  const minTime = new Promise<void>((done) => setTimeout(done, MIN_TIME));
  const maxTime = new Promise<void>((done) => setTimeout(done, MAX_TIME));
  return Promise.race([Promise.all([fonts, logo, minTime]).then(() => undefined), maxTime]);
}

/**
 * Once per session (or with `?intro` in the URL): the festival gets ready while
 * the site loads. Flags go up one by one, the damar kurung lights up, and the
 * KPK bus drives from Gresik to ITS along the same road as the hero, so the
 * fade-out lands seamlessly on the first screen.
 */
export default function LoadingScreen() {
  const [show, setShow] = useState(
    () => !safeStorage.get("session", SEEN_KEY) || new URLSearchParams(window.location.search).has("intro"),
  );
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  useScrollLock(show);

  useEffect(() => {
    if (!show) {
      finishIntro();
      return;
    }
    safeStorage.set("session", SEEN_KEY, "1");
    let alive = true;
    firstScreenReady().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [show]);

  // creep up to 90% on our own; the last stretch waits for the real assets
  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const cap = ready ? 100 : 90;
        if (p >= cap) return p;
        const step = ready ? 6 + Math.floor(Math.random() * 5) : 2 + Math.floor(Math.random() * 6);
        return Math.min(cap, p + step);
      });
    }, 90);
    return () => clearInterval(id);
  }, [show, ready]);

  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => setShow(false), 700);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-gradient-to-b from-[#a9dcff] via-[#dcf1ff] to-[#f2fbff]"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
          role="status"
          aria-label={`Memuat ${progress}%`}
        >
          <Clouds count={4} />

          {/* The flags go up as it loads and the damar kurung lights up halfway. Same rope,
              flags and spot as the hero's bunting, so they line up during the fade-out. */}
          <Bunting
            className="absolute inset-x-0 top-[76px] md:hidden"
            flags={FLAGS_MOBILE}
            sag={30}
            shown={Math.round((progress / 100) * FLAGS_MOBILE)}
          />
          <Bunting
            className="absolute inset-x-0 top-[84px] hidden md:block"
            flags={FLAGS}
            sag={30}
            shown={Math.round((progress / 100) * FLAGS)}
            lanterns={[{ at: 0.91, size: 60, faces: SCENE_SETS[0], lit: progress >= 40, className: "hidden md:block" }]}
          />

          <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-[clamp(8rem,22vh,11rem)]">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="relative grid h-[clamp(7rem,20vh,10rem)] w-[clamp(7rem,20vh,10rem)] place-items-center rounded-full bg-white shadow-[0_8px_0_rgb(27_31_59/0.1)] ring-4 ring-white"
            >
              <img src={HERO_LOGO} alt="KPK × ILITS 2026" className="h-full w-full scale-125 object-contain" />
            </motion.div>

            <p className="mt-[clamp(1rem,3vh,2rem)] font-display text-[clamp(3rem,8vh,3.75rem)] leading-none font-extrabold tracking-tight text-ink tabular-nums">
              {progress}
              <span className="text-its">%</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={caption(progress)}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 font-hand text-2xl font-semibold text-ink-soft"
              >
                {caption(progress)}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* same town and road as the hero: the bus is the progress bar */}
          <div className="relative">
            <Townscape className="h-[clamp(64px,12vh,170px)]" />
            <Road progress={progress} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
