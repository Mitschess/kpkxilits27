import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/button";
import { MYTHS } from "@/data/home";
import { cn } from "@/lib/utils";

type Guess = "fakta" | "mitos";

/** "Bener nggak sih?" — guess first, then the card turns over to the fact. */
export default function MythQuiz() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= MYTHS.length;
  const card = MYTHS[index];

  // every claim here is a myth
  const answer = (g: Guess) => {
    setGuess(g);
    if (g === "mitos") setScore((s) => s + 1);
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
    <section id="mitos" className="relative overflow-hidden bg-night-900 py-28 md:py-36">
      <div className="weave absolute inset-0 opacity-50" />
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgb(236 59 146 / 0.16), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          stop="06"
          label="Mitos vs Fakta"
          title={<>Katanya sih gitu… <em>bener nggak</em>?</>}
          description="Tebak dulu, baru intip faktanya."
        />

        <div data-reveal className="relative mx-auto mt-14 max-w-3xl">
          {/* the rest of the deck */}
          <div className="absolute inset-x-6 -bottom-3 h-full rotate-[1.5deg] rounded-[2rem] bg-night-700/60 ring-1 ring-paper/5" />
          <div className="absolute inset-x-3 -bottom-1.5 h-full -rotate-1 rounded-[2rem] bg-night-700/80 ring-1 ring-paper/5" />

          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-night-700 to-night-800 p-7 ring-1 ring-paper/15 md:p-12">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5" aria-hidden="true">
                {MYTHS.map((_, i) => (
                  <span key={i} className={cn("h-1.5 w-8 rounded-full transition-colors", i < index || (i === index && guess) ? "bg-lantern" : "bg-paper/15")} />
                ))}
              </div>
              <span className="text-sm text-mist">
                Skor <span className="font-semibold text-paper">{score}</span>/{MYTHS.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[300px] flex-col items-center justify-center text-center"
                >
                  <p className="eyebrow text-lantern">Hasil tebakanmu</p>
                  <p className="mt-4 font-display text-7xl font-semibold text-paper">
                    {score}/{MYTHS.length}
                  </p>
                  <p className="mt-4 max-w-md text-lg text-mist">
                    {score === MYTHS.length
                      ? "Mantap! Kamu sudah kenal ITS luar dalam. Tinggal daftar 😎"
                      : "Ternyata ITS nggak seseram katanya, kan? Masih banyak yang bisa kamu temukan."}
                  </p>
                  <button type="button" onClick={restart} className={buttonClass("ghost", "mt-8")}>
                    <RotateCcw size={16} /> Main lagi
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40, rotate: 1 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -40, rotate: -1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-10"
                >
                  <p className="eyebrow text-mist">Katanya…</p>
                  <p className="mt-3 font-serif text-4xl leading-tight text-balance text-paper italic md:text-6xl">“{card.myth}”</p>

                  <AnimatePresence mode="wait">
                    {!guess ? (
                      <motion.div key="ask" exit={{ opacity: 0, y: -8 }} className="mt-10 grid grid-cols-2 gap-3 sm:max-w-md">
                        <button type="button" onClick={() => answer("fakta")} className={buttonClass("ghost", "py-4")}>
                          Fakta
                        </button>
                        <button type="button" onClick={() => answer("mitos")} className={buttonClass("lantern", "py-4")}>
                          Mitos
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                        <div className="flex flex-wrap items-center gap-4">
                          <motion.span
                            initial={{ scale: 1.8, opacity: 0, rotate: -18 }}
                            animate={{ scale: 1, opacity: 1, rotate: -8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 16 }}
                            className="rounded-xl border-[3px] border-magenta px-4 py-1 font-display text-3xl font-bold tracking-wide text-[#ff8cc0] uppercase"
                          >
                            Mitos!
                          </motion.span>
                          <span className={cn("text-sm font-medium", guess === "mitos" ? "text-mint" : "text-gold")}>
                            {guess === "mitos" ? "Tebakanmu tepat 🎉" : "Eits, kena tipu 😄"}
                          </span>
                        </div>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-paper/90">{card.fact}</p>
                        <button type="button" onClick={next} className={buttonClass("lantern", "mt-8")}>
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
