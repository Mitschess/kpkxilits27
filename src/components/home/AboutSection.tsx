import { useRef } from "react";
import { CalendarRange, GraduationCap, Layers, Users } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import SectionHeading from "@/components/ui/SectionHeading";
import { CABINET_DATA } from "@/data/cabinet";
import { FACULTIES } from "@/data/faculties";
import { EVENTS } from "@/data/home";
import { gsap, useGSAP } from "@/lib/motion";

// Words wrapped in [] are highlighted once lit.
const STORY =
  "KPK (Kampus Pulang Kampung) merupakan salah satu event oleh [IMAGES ITS] yang bekerja sama dengan [Ini Lho ITS]. Bertujuan untuk memperkenalkan ITS dari segi akademis maupun non akademis serta lingkungan yang ada di dalamnya bagi siswa-siswi SMA/K sederajat di [Kabupaten Gresik].";

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
  { icon: CalendarRange, value: EVENTS.length, label: "Rangkaian acara" },
  { icon: GraduationCap, value: FACULTIES.length, label: "Fakultas dikenalkan" },
  { icon: Layers, value: FACULTIES.reduce((n, f) => n + f.departments.length, 0), label: "Departemen & prodi" },
  { icon: Users, value: CABINET_DATA.reduce((n, d) => n + d.members.length, 0), label: "Panitia bergerak" },
];

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

  // Each word lights up as it passes through the middle of the screen
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: "[data-story]", start: "top 78%", end: "bottom 50%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tentang" className="relative overflow-hidden bg-night-950 py-28 md:py-40">
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgb(70 114 255 / 0.18), transparent 65%)" }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionHeading stop="01" label="Tentang KPK" title={<>Kampus yang <em>pulang</em> ke kampung halaman.</>} />

          <p data-story className="mt-10 font-display text-2xl leading-[1.35] font-medium tracking-tight text-paper md:text-[2.1rem]">
            {storyWords().map((w, i) => (
              <span key={i} data-word className={w.mark ? "text-gold" : undefined}>
                {w.text}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* doorway: the way home is always open */}
        <div className="flex items-center justify-center lg:col-span-5">
          <div data-reveal className="relative w-full max-w-sm">
            <div
              className="absolute -inset-10 rounded-full opacity-80 blur-2xl"
              style={{ background: "radial-gradient(circle, rgb(255 178 63 / 0.35), transparent 65%)" }}
            />
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl border border-paper/15 bg-gradient-to-b from-night-700 via-night-800 to-night-900 p-8 pt-16">
              <div className="weave absolute inset-0" />
              <img src="/images/pintu-kpk.webp" alt="Ilustrasi pintu pulang KPK" loading="lazy" className="relative mx-auto w-4/5 drop-shadow-[0_20px_40px_rgb(255_178_63/0.35)]" />
              <p className="relative mt-6 text-center font-serif text-2xl text-gold italic">#SemangatPulangKampung</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-3 px-6 md:mt-28 md:grid-cols-4 md:gap-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} data-reveal className="glass group relative overflow-hidden rounded-3xl p-6 md:p-8">
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-lantern/10 blur-2xl transition group-hover:bg-lantern/25" />
            <Icon size={22} className="text-lantern" />
            <CountUp value={value} className="mt-6 block font-display text-5xl font-semibold tracking-tight text-paper md:text-6xl" />
            <p className="mt-2 text-sm text-mist">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
