import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, BookOpen, Briefcase, ChevronRight, Instagram, Sparkles } from "lucide-react";
import type { Competition, Department, Faculty } from "@/data/faculties";
import { cn } from "@/lib/utils";

const LEVEL: Record<Competition, string> = {
  Rendah: "bg-mint-light text-mint-dark",
  Sedang: "bg-sun-light text-[#8a6100]",
  Tinggi: "bg-pink-light text-pink-dark",
};

const accreditation = (a: string) => (/prodi baru/i.test(a) ? "Prodi baru ✨" : `Akreditasi ${a}`);

const slide = {
  initial: (dir: number) => ({ opacity: 0, x: 40 * dir }),
  animate: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -40 * dir }),
};

/** Contents of the faculty sheet: department list ⇄ department detail. */
export default function FacultyPanel({ faculty, initialDept = null }: { faculty: Faculty; initialDept?: Department | null }) {
  const [dept, setDept] = useState<Department | null>(initialDept);
  const top = useRef<HTMLDivElement>(null);

  const open = (d: Department | null) => {
    setDept(d);
    top.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div style={{ "--accent": faculty.accent } as React.CSSProperties}>
      <div ref={top} />
      <AnimatePresence mode="wait" custom={dept ? 1 : -1} initial={false}>
        {dept ? (
          <motion.div key={dept.slug} custom={1} variants={slide} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
            <DepartmentDetail faculty={faculty} dept={dept} onBack={() => open(null)} />
          </motion.div>
        ) : (
          <motion.div key="list" custom={-1} variants={slide} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
            <DepartmentList faculty={faculty} onSelect={open} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DepartmentList({ faculty, onSelect }: { faculty: Faculty; onSelect: (d: Department) => void }) {
  const Icon = faculty.icon;
  return (
    <>
      <header className="relative overflow-hidden px-6 pt-16 pb-10 md:px-10" style={{ background: `${faculty.accent}2e` }}>
        <span className="absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-40" style={{ background: faculty.accent }} />
        <div className="relative">
          <span className="grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-ink text-ink" style={{ background: faculty.accent }}>
            <Icon size={30} strokeWidth={2} />
          </span>
          <p className="mt-6 inline-block rounded-full bg-white px-3 py-1 text-xs font-extrabold tracking-wider text-ink uppercase ring-2 ring-ink/10">
            {faculty.id}
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-ink md:text-4xl">{faculty.name}</h2>
          <p className="mt-2 font-medium text-ink-soft">{faculty.description}</p>
        </div>
      </header>

      <div className="px-4 py-8 md:px-8">
        <p className="mb-3 px-2 font-hand text-2xl font-bold text-ink-soft">
          {faculty.departments.length} departemen & prodi, pilih satu 👇
        </p>
        <ul className="space-y-3">
          {faculty.departments.map((d) => (
            <li key={d.slug}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                className="group flex w-full items-center gap-4 rounded-[1.4rem] bg-white p-2 pr-4 text-left ring-2 ring-ink/10 transition duration-200 ease-bounce hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgb(27_31_59/0.1)]"
              >
                <img src={d.image} alt="" loading="lazy" className="h-16 w-24 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-extrabold text-ink">{d.name}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-ink-soft">{accreditation(d.accreditation)}</span>
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition group-hover:translate-x-1" style={{ background: `${faculty.accent}40` }}>
                  <ChevronRight size={18} className="text-ink" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function DepartmentDetail({ faculty, dept, onBack }: { faculty: Faculty; dept: Department; onBack: () => void }) {
  const quotas = [
    { label: "SNBP", value: dept.stats.snbp, level: dept.competition.snbp },
    { label: "SNBT", value: dept.stats.snbt, level: dept.competition.snbt },
    { label: "Mandiri", value: dept.stats.mandiri, level: dept.competition.mandiri },
  ];
  const max = Math.max(...quotas.map((q) => q.value), 1);
  const handle = dept.contact.replace(/^@/, "");

  return (
    <article className="pb-12">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={dept.image} alt={dept.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/10 to-transparent" />
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-3 text-sm font-bold text-ink shadow-[0_3px_0_rgb(27_31_59/0.15)] ring-2 ring-ink/10 transition hover:-translate-x-0.5"
        >
          <ArrowLeft size={16} /> {faculty.id.toUpperCase()}
        </button>
      </div>

      <div className="relative -mt-12 px-6 md:px-10">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1.5 text-xs font-extrabold text-ink shadow-[0_3px_0_#e5a500]">
            <BadgeCheck size={14} /> {accreditation(dept.accreditation)}
          </span>
          {dept.asiin && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-its px-3 py-1.5 text-xs font-extrabold text-white shadow-[0_3px_0_#1d3fb5]">
              <Sparkles size={14} /> Terakreditasi ASIIN
            </span>
          )}
        </div>
        <h2 className="mt-4 font-display text-4xl leading-tight font-extrabold tracking-tight text-ink md:text-5xl">{dept.name}</h2>
        <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-soft">{dept.description}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoBlock icon={BookOpen} title="Bidang keahlian" tint="bg-its-light">
            <ul className="flex flex-wrap gap-2">
              {dept.competencies.map((c, i) => (
                <li key={i} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink ring-2 ring-ink/10">
                  {c}
                </li>
              ))}
            </ul>
          </InfoBlock>
          <InfoBlock icon={Briefcase} title="Prospek kerja" tint="bg-mint-light">
            <ul className="space-y-2">
              {dept.careers.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm font-semibold text-ink">
                  <span aria-hidden="true">⭐</span>
                  {c}
                </li>
              ))}
            </ul>
          </InfoBlock>
        </div>

        {dept.relatedSubjects.length > 0 && (
          <div className="mt-4 rounded-[1.5rem] bg-sun-light p-5 ring-2 ring-sun/60">
            <p className="font-display text-lg font-extrabold text-ink">📘 Mapel pendukung</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dept.relatedSubjects.map((s) => (
                <li key={s} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-ink">
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 rounded-[1.5rem] bg-white p-5 ring-2 ring-ink/10 md:p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl font-extrabold text-ink">🎟️ Kuota mahasiswa</p>
            <span className="rounded-full bg-ink px-2.5 py-1 text-[0.68rem] font-bold text-white">2026</span>
          </div>
          <div className="mt-5 space-y-4">
            {quotas.map((q) => (
              <div key={q.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-bold text-ink">{q.label}</span>
                  <span className="flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-[0.7rem] font-bold", LEVEL[q.level])}>Keketatan {q.level.toLowerCase()}</span>
                    <span className="w-10 text-right font-display text-lg font-extrabold text-ink tabular-nums">{q.value}</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink/[0.07]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: faculty.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(q.value / max) * 100}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href={`https://www.instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between rounded-[1.5rem] bg-gradient-to-r from-[#ffd36e] via-pink to-lilac p-[3px] transition hover:-translate-y-0.5"
        >
          <span className="flex w-full items-center justify-between rounded-[calc(1.5rem-3px)] bg-white p-4">
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-pink-light text-pink">
                <Instagram size={20} />
              </span>
              <span>
                <span className="block text-xs font-semibold text-ink-soft">Kepoin Instagram departemennya</span>
                <span className="font-bold text-ink">{dept.contact}</span>
              </span>
            </span>
            <ChevronRight size={18} className="text-ink-soft" />
          </span>
        </a>
      </div>
    </article>
  );
}

function InfoBlock({ icon: Icon, title, tint, children }: { icon: typeof BookOpen; title: string; tint: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-[1.5rem] p-5", tint)}>
      <p className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-ink">
        <Icon size={18} /> {title}
      </p>
      {children}
    </div>
  );
}
