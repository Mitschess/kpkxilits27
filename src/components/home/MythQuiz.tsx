import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, RotateCcw } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/button";
import { MYTHS } from "@/data/home";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Guess = "fakta" | "mitos";

const CONFETTI_COLORS = ["#ffc93c", "#ff4fa3", "#1fbf9a", "#2f5bea", "#ff8a3d"];

function celebrate(from: HTMLElement) {
  if (prefersReducedMotion()) return;
  const r = from.getBoundingClientRect();
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 38,
    colors: CONFETTI_COLORS,
    origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
  });
}

/** "Bener nggak sih?" — guess first, then the card shows the fact. */
export default function MythQuiz() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= MYTHS.length;
  const card = MYTHS[index];

  // every claim here is a myth
  const answer = (g: Guess, e: React.MouseEvent<HTMLButtonElement>) => {
    setGuess(g);
    if (g === "mitos") {
      setScore((s) => s + 1);
      celebrate(e.currentTarget);
    }
  };
  const next = () => {
    setGuess(null);
    setIndex((i) => i + 1);
  };
  const restart = () => {
    setGuess(null);
    setIndex(0);
    setScore(0);
  };

  return (
    <section id="mitos" className="dots relative overflow-hidden bg-pink-light py-24 md:py-32">
      {/* floating question marks */}
      {["top-[12%] left-[6%]", "top-[30%] right-[8%]", "bottom-[14%] left-[12%]", "bottom-[20%] right-[14%]"].map((pos, i) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`absolute hidden animate-bob font-display text-7xl font-extrabold md:block ${pos}`}
          style={{ animationDelay: `-${i * 1.2}s`, color: CONFETTI_COLORS[i], rotate: `${i % 2 ? 12 : -12}deg` }}
        >
          ?
        </span>
      ))}

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          stop="06"
          emoji="🤔"
          label="Mitos vs Fakta"
          highlight="#ffffff"
          title={<>Katanya sih gitu… <em>bener nggak</em>?</>}
          description="Tebak dulu, baru intip faktanya!"
        />

        <div data-reveal className="relative mx-auto mt-12 max-w-3xl">
          {/* the rest of the deck */}
          <div className="absolute inset-x-6 -bottom-4 h-full rotate-[2deg] rounded-[2rem] bg-sun ring-2 ring-ink/10" />
          <div className="absolute inset-x-3 -bottom-2 h-full -rotate-[1.5deg] rounded-[2rem] bg-mint ring-2 ring-ink/10" />

          <div className="card relative min-h-[420px] overflow-hidden p-7 md:p-12">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5" aria-hidden="true">
                {MYTHS.map((_, i) => (
                  <span key={i} className={cn("h-2.5 w-9 rounded-full transition-colors", i < index || (i === index && guess) ? "bg-pink" : "bg-ink/10")} />
                ))}
              </div>
              <span className="rounded-full bg-sun-light px-3 py-1 text-sm font-bold text-ink ring-2 ring-sun">
                Skor {score}/{MYTHS.length} ⭐
              </span>
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[300px] flex-col items-center justify-center text-center"
                >
                  <p className="text-6xl" aria-hidden="true">
                    {score === MYTHS.length ? "🏆" : "🎉"}
                  </p>
                  <p className="mt-4 font-display text-6xl font-extrabold text-ink">
                    {score}/{MYTHS.length}
                  </p>
                  <p className="mt-3 max-w-md text-lg text-ink-soft">
                    {score === MYTHS.length
                      ? "Mantap! Kamu udah kenal ITS luar dalam. Tinggal daftar 😎"
                      : "Ternyata ITS nggak seseram katanya, kan? Masih banyak yang bisa kamu temukan!"}
                  </p>
                  <button type="button" onClick={restart} className={buttonClass("white", "mt-8")}>
                    <RotateCcw size={16} /> Main lagi
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 60, rotate: 2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -60, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="pt-10"
                >
                  <p className="font-hand text-2xl font-bold text-pink">Katanya…</p>
                  <p className="mt-2 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-ink md:text-5xl">
                    “{card.myth}”
                  </p>

                  <AnimatePresence mode="wait">
                    {!guess ? (
                      <motion.div key="ask" exit={{ opacity: 0, y: -8 }} className="mt-10 grid grid-cols-2 gap-4 sm:max-w-md">
                        <button type="button" onClick={(e) => answer("fakta", e)} className={buttonClass("white", "py-4 text-base")}>
                          ✅ Fakta
                        </button>
                        <button type="button" onClick={(e) => answer("mitos", e)} className={buttonClass("pink", "py-4 text-base")}>
                          🙅 Mitos
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                        <div className="flex flex-wrap items-center gap-4">
                          <motion.span
                            initial={{ scale: 2, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: -6 }}
                            transition={{ type: "spring", stiffness: 320, damping: 14 }}
                            className="rounded-2xl border-4 border-pink px-4 py-1 font-display text-3xl font-extrabold tracking-wide text-pink uppercase"
                          >
                            Mitos!
                          </motion.span>
                          <span className={cn("rounded-full px-3 py-1 text-sm font-bold", guess === "mitos" ? "bg-mint-light text-mint-dark" : "bg-sun-light text-ink")}>
                            {guess === "mitos" ? "Tebakanmu tepat 🎉" : "Eits, kena tipu 😄"}
                          </span>
                        </div>
                        <p className="mt-5 max-w-2xl rounded-2xl bg-cream p-5 text-lg leading-relaxed text-pretty text-ink">{card.fact}</p>
                        <button type="button" onClick={next} className={buttonClass("blue", "mt-7")}>
                          {index === MYTHS.length - 1 ? "Lihat skor" : "Kartu berikutnya"}
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
