import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
import Starfield from "@/components/ui/Starfield";
import { finishIntro } from "@/lib/intro";
import { safeStorage } from "@/lib/utils";

const SEEN_KEY = "kpk_has_loaded";

function caption(p: number) {
  if (p < 30) return "Lagi mbungkus Nasi Krawu…";
  if (p < 60) return "Nyumet Damar Kurung…";
  if (p < 90) return "Mancal motor nang ITS…";
  return "Siap sukses bareng KPK!";
}

/** Once per session: a damar kurung slowly lights up while the site "loads". */
export default function LoadingScreen() {
  const [show, setShow] = useState(() => !safeStorage.get("session", SEEN_KEY));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) {
      finishIntro();
      return;
    }
    safeStorage.set("session", SEEN_KEY, "1");
    const id = setInterval(() => setProgress((p) => Math.min(100, p + Math.floor(Math.random() * 7) + 2)), 90);
    return () => clearInterval(id);
  }, [show]);

  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => setShow(false), 650);
    return () => clearTimeout(t);
  }, [progress]);

  const lit = progress / 100;

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-night-950"
          exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          role="status"
          aria-label={`Memuat ${progress}%`}
        >
          <Starfield density={0.8} />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 42%, rgb(255 178 63 / ${0.2 * lit}) 0%, transparent 45%)`,
            }}
          />

          <div
            className="relative mt-10"
            style={{ filter: `brightness(${0.3 + 0.7 * lit}) saturate(${0.3 + 0.7 * lit})` }}
          >
            <Lantern size={104} faces={SCENE_SETS[0]} spinDuration={9} />
          </div>

          <div className="relative mt-24 flex flex-col items-center text-center">
            <p className="font-display text-7xl font-semibold tracking-tight text-paper tabular-nums md:text-8xl">
              {progress}
              <span className="text-lantern">%</span>
            </p>
            <p className="mt-3 font-serif text-xl text-mist italic">{caption(progress)}</p>
            <div className="mt-6 h-px w-56 overflow-hidden bg-paper/10">
              <div className="h-full bg-lantern shadow-[0_0_12px_rgb(255_178_63)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
