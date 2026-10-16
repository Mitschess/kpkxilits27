import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Check, CircleHelp, PartyPopper, RotateCcw, Star, Trophy, X } from "lucide-react";
import SectionFade from "@/components/deco/SectionFade";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/button";
import { MYTHS, type MythFact } from "@/data/home";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Guess = MythFact["answer"];

const ROUND_SIZE = 5;
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

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A fresh round: random cards in random order, always with at least two of each answer. */
function drawRound(): MythFact[] {
  const myths = shuffle(MYTHS.filter((c) => c.answer === "mitos"));
  const facts = shuffle(MYTHS.filter((c) => c.answer === "fakta"));
  const picked = [...myths.slice(0, 2), ...facts.slice(0, 2)];
  const rest = shuffle([...myths.slice(2), ...facts.slice(2)]);
  return shuffle([...picked, ...rest.slice(0, ROUND_SIZE - picked.length)]);
}

/** "Bener nggak sih?" — guess first, then the card shows whether it's a myth or a fact. */
export default function MythQuiz() {
  const [deck, setDeck] = useState(drawRound);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= deck.length;
  const card = deck[index];
  const correct = guess !== null && guess === card?.answer;

  const answer = (g: Guess, e: React.MouseEvent<HTMLButtonElement>) => {
    setGuess(g);
    if (g === card.answer) {
      setScore((s) => s + 1);
      celebrate(e.currentTarget);
    }
  };
  const next = () => {
    setGuess(null);
    setIndex((i) => i + 1);
  };
  // every replay deals a new set of cards
  const restart = () => {
    setDeck(drawRound());
    setGuess(null);
    setIndex(0);
    setScore(0);
  };

  return (
    <section id="mitos" className="dots screen-section relative isolate overflow-hidden bg-pink-light">
      <SectionFade edge="top" color="var(--color-pink-light)" className="h-24" />
      <SectionFade edge="bottom" color="var(--color-cream)" />
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

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <SectionHeading
          icon={CircleHelp}
          label="Mitos vs Fakta"
          highlight="#ffffff"
          title={<>Katanya sih gitu… <em>bener nggak</em>?</>}
          description="Tebak dulu, baru intip faktanya!"
        />

        <div data-reveal className="relative mx-auto w-full max-w-3xl">
          {/* the rest of the deck */}
          <div className="absolute inset-x-6 -bottom-4 h-full rotate-[2deg] rounded-[2rem] bg-sun ring-2 ring-ink/10" />
          <div className="absolute inset-x-3 -bottom-2 h-full -rotate-[1.5deg] rounded-[2rem] bg-mint ring-2 ring-ink/10" />

          <div className="card relative min-h-[420px] overflow-hidden p-7 md:p-12 lg:min-h-[clamp(20rem,54vh,26rem)] lg:p-[clamp(1.75rem,4.6vh,3rem)]">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5" aria-hidden="true">
                {deck.map((_, i) => (
                  <span key={i} className={cn("h-2.5 w-9 rounded-full transition-colors", i < index || (i === index && guess) ? "bg-pink" : "bg-ink/10")} />
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sun-light px-3 py-1 text-sm font-bold text-ink ring-2 ring-sun">
                <Star size={14} strokeWidth={2.5} className="fill-sun text-sun-dark" aria-hidden="true" />
                Skor {score}/{deck.length}
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
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-sun-light text-ink ring-4 ring-sun" aria-hidden="true">
                    {score === deck.length ? <Trophy size={38} strokeWidth={2.25} /> : <PartyPopper size={38} strokeWidth={2.25} />}
                  </span>
                  <p className="mt-4 font-display text-6xl font-extrabold text-ink">
                    {score}/{deck.length}
                  </p>
                  <p className="mt-3 max-w-md text-lg text-ink-soft">
                    {score === deck.length
                      ? "Mantap! Kamu udah kenal ITS luar dalam. Tinggal daftar!"
                      : "Ternyata ITS nggak seseram katanya, kan? Masih banyak yang bisa kamu temukan!"}
                  </p>
                  <button type="button" onClick={restart} className={buttonClass("white", "mt-8")}>
                    <RotateCcw size={16} /> Main lagi, kartu baru
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${card.claim}-${index}`}
                  initial={{ opacity: 0, x: 60, rotate: 2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -60, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="pt-10 lg:pt-[clamp(1.25rem,4vh,2.5rem)]"
                >
                  <p className="font-hand text-2xl font-bold text-pink">Katanya…</p>
                  <p className="mt-2 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-ink md:text-5xl lg:text-[clamp(1.85rem,5vh,3rem)]">
                    “{card.claim}”
                  </p>

                  <AnimatePresence mode="wait">
                    {!guess ? (
                      <motion.div key="ask" exit={{ opacity: 0, y: -8 }} className="mt-10 grid grid-cols-2 gap-4 sm:max-w-md lg:mt-[clamp(1.5rem,5vh,2.5rem)]">
                        <button type="button" onClick={(e) => answer("fakta", e)} className={buttonClass("white", "py-4 text-base")}>
                          <Check size={18} strokeWidth={3} aria-hidden="true" /> Fakta
                        </button>
                        <button type="button" onClick={(e) => answer("mitos", e)} className={buttonClass("pink", "py-4 text-base")}>
                          <X size={18} strokeWidth={3} aria-hidden="true" /> Mitos
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 lg:mt-[clamp(1rem,3.4vh,2rem)]">
                        <div className="flex flex-wrap items-center gap-4">
                          <motion.span
                            initial={{ scale: 2, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: -6 }}
                            transition={{ type: "spring", stiffness: 320, damping: 14 }}
                            className={cn(
                              "rounded-2xl border-4 px-4 py-1 font-display text-3xl font-extrabold tracking-wide uppercase",
                              card.answer === "mitos" ? "border-pink text-pink" : "border-mint-dark text-mint-dark",
                            )}
                          >
                            {card.answer === "mitos" ? "Mitos!" : "Fakta!"}
                          </motion.span>
                          <span className={cn("rounded-full px-3 py-1 text-sm font-bold", correct ? "bg-mint-light text-mint-dark" : "bg-sun-light text-ink")}>
                            {correct ? "Tebakanmu tepat!" : "Eits, kena tipu!"}
                          </span>
                        </div>
                        <p className="mt-5 max-w-2xl rounded-2xl bg-cream p-5 text-lg leading-relaxed text-pretty text-ink lg:mt-[clamp(0.75rem,2.4vh,1.25rem)] lg:p-4 lg:text-[clamp(0.95rem,2.4vh,1.125rem)]">{card.explanation}</p>
                        <button type="button" onClick={next} className={buttonClass("blue", "mt-7 lg:mt-[clamp(1rem,3.4vh,1.75rem)]")}>
                          {index === deck.length - 1 ? "Lihat skor" : "Kartu berikutnya"}
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
