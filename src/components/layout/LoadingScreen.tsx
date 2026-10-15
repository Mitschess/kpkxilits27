import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Bus from "@/components/deco/Bus";
import Clouds from "@/components/deco/Clouds";
import { finishIntro } from "@/lib/intro";
import { safeStorage } from "@/lib/utils";

const SEEN_KEY = "kpk_has_loaded";

function caption(p: number) {
  if (p < 30) return "Lagi mbungkus Nasi Krawu…";
  if (p < 60) return "Nyumet Damar Kurung…";
  if (p < 90) return "Mancal motor nang ITS…";
  return "Siap sukses bareng KPK!";
}

/** Once per session: the KPK bus drives from Gresik to ITS while the site "loads". */
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
    const t = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#bfe6ff] to-cream px-6"
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          role="status"
          aria-label={`Memuat ${progress}%`}
        >
          <Clouds count={4} />

          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="relative grid h-40 w-40 place-items-center rounded-full bg-white shadow-[0_8px_0_rgb(27_31_59/0.1)] ring-4 ring-white"
          >
            <img src="/images/logo/hero.webp" alt="KPK × ILITS 2026" className="h-full w-full scale-125 object-contain" />
          </motion.div>

          <p className="mt-8 font-display text-6xl font-extrabold tracking-tight text-ink tabular-nums">
            {progress}
            <span className="text-its">%</span>
          </p>
          <p className="mt-2 font-hand text-2xl font-semibold text-ink-soft">{caption(progress)}</p>

          {/* the road is the progress bar */}
          <div className="relative mt-16 w-full max-w-md">
            <div className="relative h-5 rounded-full border-[3px] border-ink bg-[#4a5070]">
              <div className="absolute inset-x-3 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff_0_14px,transparent_14px_28px)]" />
            </div>
            <div className="absolute bottom-3 w-20 transition-[left] duration-200" style={{ left: `calc(${progress}% - ${progress * 0.8}px)` }}>
              <Bus className="w-full" />
            </div>
            <div className="mt-3 flex justify-between text-sm font-bold text-ink">
              <span>Gresik</span>
              <span className="text-its">ITS 🎓</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
