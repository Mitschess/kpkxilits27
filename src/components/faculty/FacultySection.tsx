import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Sheet from "@/components/ui/Sheet";
import { FACULTIES, type Faculty } from "@/data/faculties";
import FacultyPanel from "./FacultyPanel";

export default function FacultySection() {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [open, setOpen] = useState(false);

  const show = (f: Faculty) => {
    setFaculty(f);
    setOpen(true);
  };

  return (
    <section id="fakultas" className="relative overflow-hidden bg-night-900 py-28 md:py-36">
      <div className="weave absolute inset-0 opacity-50" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgb(70 114 255 / 0.16), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            stop="04"
            label="Fakultas"
            title={<>Delapan fakultas, <em>satu</em> kampus.</>}
            description="Pilih fakultas untuk melihat departemennya: bidang keahlian, prospek kerja, sampai kuota masuk."
          />
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACULTIES.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                data-reveal
                onClick={() => show(f)}
                className="group glass relative flex min-h-[270px] flex-col overflow-hidden rounded-[1.75rem] p-6 text-left transition-all duration-500 hover:-translate-y-1.5"
                style={{ "--accent": f.accent } as React.CSSProperties}
              >
                <span
                  className="absolute -top-20 -right-20 h-52 w-52 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: f.accent }}
                />
                <span className="absolute inset-0 rounded-[1.75rem] ring-1 ring-transparent transition duration-500 ring-inset group-hover:ring-[var(--accent)]/50" />

                <span className="relative flex items-start justify-between">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl"
                    style={{ background: `${f.accent}22`, color: f.accent, boxShadow: `inset 0 0 0 1px ${f.accent}55` }}
                  >
                    <Icon size={26} strokeWidth={1.7} />
                  </span>
                  <span className="eyebrow text-[0.65rem]" style={{ color: f.accent }}>
                    {f.id}
                  </span>
                </span>

                <span className="relative mt-auto pt-10">
                  <span className="block font-display text-xl leading-tight font-semibold tracking-tight text-balance text-paper">
                    {f.name.replace(/^Fakultas /, "")}
                  </span>
                  <span className="mt-2 line-clamp-2 block text-sm text-mist">{f.description}</span>
                  <span className="mt-5 flex items-center justify-between border-t border-paper/10 pt-4 text-sm text-paper/80">
                    {f.departments.length} departemen
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-paper/[0.07] transition duration-500 group-hover:rotate-45 group-hover:bg-[var(--accent)] group-hover:text-night-950">
                      <ArrowUpRight size={16} />
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen} title={faculty?.name ?? "Fakultas"}>
        {faculty && <FacultyPanel key={faculty.id} faculty={faculty} />}
      </Sheet>
    </section>
  );
}
