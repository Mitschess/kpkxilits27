import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, BookOpen, Briefcase, ChevronRight, Instagram, Sparkles } from "lucide-react";
import type { Competition, Department, Faculty } from "@/data/faculties";
import { cn } from "@/lib/utils";

const LEVEL: Record<Competition, string> = {
  Rendah: "bg-teal/15 text-mint ring-teal/30",
  Sedang: "bg-lantern/15 text-gold ring-lantern/30",
  Tinggi: "bg-magenta/15 text-[#ff8cc0] ring-magenta/30",
};

const accreditation = (a: string) => (/prodi baru/i.test(a) ? "Prodi baru" : `Akreditasi ${a}`);

const slide = {
  initial: (dir: number) => ({ opacity: 0, x: 40 * dir }),
  animate: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -40 * dir }),
};

/** Contents of the faculty sheet: department list ⇄ department detail. */
export default function FacultyPanel({ faculty }: { faculty: Faculty }) {
  const [dept, setDept] = useState<Department | null>(null);
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
      <header className="relative overflow-hidden px-6 pt-16 pb-10 md:px-10">
        <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at 15% 0%, ${faculty.accent}55, transparent 60%)` }} />
        <div className="relative">
          <span
            className="grid h-14 w-14 place-items-center rounded-2xl"
            style={{ background: `${faculty.accent}22`, color: faculty.accent, boxShadow: `inset 0 0 0 1px ${faculty.accent}55` }}
          >
            <Icon size={26} strokeWidth={1.7} />
          </span>
          <p className="eyebrow mt-6" style={{ color: faculty.accent }}>
            {faculty.id}
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight text-balance text-paper md:text-4xl">
            {faculty.name}
          </h2>
          <p className="mt-3 text-mist">{faculty.description}</p>
        </div>
      </header>

      <div className="px-4 pb-10 md:px-8">
        <p className="eyebrow mb-3 px-2 text-paper/50">{faculty.departments.length} departemen & prodi</p>
        <ul className="space-y-2">
          {faculty.departments.map((d) => (
            <li key={d.slug}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                className="group flex w-full items-center gap-4 rounded-2xl p-2 pr-4 text-left transition hover:bg-paper/[0.05]"
              >
                <img src={d.image} alt="" loading="lazy" className="h-16 w-24 shrink-0 rounded-xl object-cover ring-1 ring-paper/10" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-semibold text-paper">{d.name}</span>
                  <span className="mt-0.5 block text-xs text-mist">{accreditation(d.accreditation)}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-mist transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/30 to-night-900/10" />
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-night-950/70 py-2 pr-4 pl-3 text-sm text-paper ring-1 ring-paper/15 backdrop-blur transition hover:bg-night-700"
        >
          <ArrowLeft size={16} /> {faculty.id.toUpperCase()}
        </button>
      </div>

      <div className="relative -mt-16 px-6 md:px-10">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lantern px-3 py-1 text-xs font-semibold text-night-950">
            <BadgeCheck size={14} /> {accreditation(dept.accreditation)}
          </span>
          {dept.asiin && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 text-xs font-semibold text-paper ring-1 ring-paper/20 backdrop-blur">
              <Sparkles size={14} className="text-gold" /> Terakreditasi ASIIN
            </span>
          )}
        </div>
        <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-paper md:text-5xl">{dept.name}</h2>
        <p className="mt-4 text-lg leading-relaxed text-pretty text-paper/85">{dept.description}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <InfoBlock icon={BookOpen} title="Bidang keahlian">
            <ul className="flex flex-wrap gap-2">
              {dept.competencies.map((c, i) => (
                <li key={i} className="rounded-full bg-paper/[0.06] px-3 py-1.5 text-sm text-paper/90 ring-1 ring-paper/10">
                  {c}
                </li>
              ))}
            </ul>
          </InfoBlock>
          <InfoBlock icon={Briefcase} title="Prospek kerja">
            <ul className="space-y-1.5">
              {dept.careers.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-paper/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: faculty.accent }} />
                  {c}
                </li>
              ))}
            </ul>
          </InfoBlock>
        </div>

        {dept.relatedSubjects.length > 0 && (
          <div className="mt-4 rounded-3xl bg-paper/[0.03] p-5 ring-1 ring-paper/10">
            <p className="eyebrow text-paper/50">Mapel pendukung</p>
            <p className="mt-2 text-sm text-paper/90">
              {dept.relatedSubjects.map((s) => s.charAt(0) + s.slice(1).toLowerCase()).join(" · ")}
            </p>
          </div>
        )}

        <div className="mt-4 rounded-3xl bg-paper/[0.03] p-5 ring-1 ring-paper/10 md:p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl font-semibold text-paper">Kuota mahasiswa</p>
            <span className="eyebrow text-[0.62rem] text-mist">Tahun 2026</span>
          </div>
          <div className="mt-5 space-y-4">
            {quotas.map((q) => (
              <div key={q.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-paper">{q.label}</span>
                  <span className="flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ring-1", LEVEL[q.level])}>
                      Keketatan {q.level.toLowerCase()}
                    </span>
                    <span className="w-10 text-right font-display text-lg font-semibold text-paper tabular-nums">{q.value}</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-paper/[0.07]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${faculty.accent}, #ffd76a)` }}
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
          className="mt-4 flex items-center justify-between rounded-3xl bg-paper/[0.03] p-5 ring-1 ring-paper/10 transition hover:bg-paper/[0.07]"
        >
          <span className="flex items-center gap-3">
            <Instagram size={20} className="text-lantern" />
            <span>
              <span className="block text-xs text-mist">Instagram departemen</span>
              <span className="font-medium text-paper">{dept.contact}</span>
            </span>
          </span>
          <ChevronRight size={18} className="text-mist" />
        </a>
      </div>
    </article>
  );
}

function InfoBlock({ icon: Icon, title, children }: { icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-paper/[0.03] p-5 ring-1 ring-paper/10">
      <p className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-paper">
        <Icon size={18} className="text-[var(--accent)]" /> {title}
      </p>
      {children}
    </div>
  );
}
