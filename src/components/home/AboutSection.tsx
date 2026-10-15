import { useRef } from "react";
import CountUp from "@/components/ui/CountUp";
import SectionHeading from "@/components/ui/SectionHeading";
import { CABINET_DATA } from "@/data/cabinet";
import { FACULTIES } from "@/data/faculties";
import { EVENTS } from "@/data/home";
import { gsap, useGSAP } from "@/lib/motion";

// Words wrapped in [] are highlighted.
const STORY =
  "KPK (Kampus Pulang Kampung) merupakan salah satu event oleh [IMAGES ITS] yang bekerja sama dengan [Ini Lho ITS!] Bertujuan untuk memperkenalkan ITS dari segi akademis maupun non akademis serta lingkungan yang ada di dalamnya bagi siswa-siswi SMA/K sederajat di [Kabupaten Gresik].";

function storyWords() {
  const words: { text: string; mark: boolean }[] = [];
  for (const part of STORY.split(/(\[[^\]]+\])/)) {
    const mark = part.startsWith("[");
    for (const w of part.replace(/[[\]]/g, "").split(" ")) {
      if (!w) continue;
      // stray punctuation sticks to the word before it
      if (/^[.,;:!?]$/.test(w) && words.length) words[words.length - 1].text += w;
      else words.push({ text: w, mark });
    }
  }
  return words;
}

const STATS = [
  { emoji: "🗓️", value: EVENTS.length, label: "Rangkaian acara seru", bg: "bg-sun-light", ring: "ring-sun" },
  { emoji: "🏛️", value: FACULTIES.length, label: "Fakultas buat dikenalin", bg: "bg-pink-light", ring: "ring-pink" },
  { emoji: "📚", value: FACULTIES.reduce((n, f) => n + f.departments.length, 0), label: "Departemen & prodi", bg: "bg-mint-light", ring: "ring-mint" },
  { emoji: "🙌", value: CABINET_DATA.reduce((n, d) => n + d.members.length, 0), label: "Panitia siap nyambut", bg: "bg-its-light", ring: "ring-its" },
];

const FLOATERS = [
  { emoji: "🎒", className: "top-[8%] left-[4%]", delay: "0s" },
  { emoji: "🏠", className: "top-[18%] right-[2%]", delay: "-1.4s" },
  { emoji: "🎓", className: "bottom-[16%] left-[0%]", delay: "-2.6s" },
  { emoji: "⭐", className: "bottom-[6%] right-[10%]", delay: "-0.8s" },
];

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

  // each word darkens as it scrolls through the middle of the screen
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: "[data-story]", start: "top 80%", end: "bottom 55%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tentang" className="dots relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionHeading stop="01" emoji="👀" label="Tentang KPK" title={<>Kampus yang <em>pulang</em> ke kampung halaman.</>} />

          <p data-story className="mt-10 font-display text-2xl leading-[1.4] font-semibold tracking-tight text-ink md:text-[2.05rem]">
            {storyWords().map((w, i) => (
              <span key={i} data-word className={w.mark ? "marker [--hl:var(--color-sun-light)] text-its" : undefined}>
                {w.text}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* the door home is always open */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div data-reveal className="relative w-full max-w-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[45%_55%_48%_52%/55%_45%_55%_45%] bg-sky-light ring-4 ring-white shadow-[0_10px_0_rgb(27_31_59/0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#fff2c4_0%,transparent_60%)]" />
              <img
                src="/images/pintu-kpk.webp"
                alt="Ilustrasi pintu pulang KPK"
                loading="lazy"
                className="absolute inset-x-[12%] bottom-[10%] w-[76%] drop-shadow-[0_14px_18px_rgb(27_31_59/0.2)]"
              />
            </div>
            {FLOATERS.map((f) => (
              <span
                key={f.emoji}
                className={`absolute grid h-14 w-14 animate-bob place-items-center rounded-2xl bg-white text-2xl shadow-[0_4px_0_rgb(27_31_59/0.12)] ring-2 ring-ink/10 ${f.className}`}
                style={{ animationDelay: f.delay }}
                aria-hidden="true"
              >
                {f.emoji}
              </span>
            ))}
            <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 -rotate-3 rounded-full bg-pink px-5 py-2 font-hand text-2xl font-bold whitespace-nowrap text-white shadow-[0_4px_0_#db2b81]">
              #SemangatPulangKampung
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-3 px-6 md:mt-24 md:grid-cols-4 md:gap-5">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            data-reveal
            className={`group rounded-[1.75rem] p-6 ring-2 ring-ink/10 transition duration-300 ease-bounce hover:-translate-y-1.5 md:p-7 ${s.bg} ${i % 2 ? "md:rotate-1" : "md:-rotate-1"}`}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-[0_3px_0_rgb(27_31_59/0.1)] transition group-hover:rotate-12" aria-hidden="true">
              {s.emoji}
            </span>
            <CountUp value={s.value} className="mt-5 block font-display text-5xl font-extrabold tracking-tight text-ink md:text-6xl" />
            <p className="mt-1 text-sm font-semibold text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
