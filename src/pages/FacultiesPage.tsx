import { useRef, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import FacultyCards from "@/components/faculty/FacultyCards";
import FacultyPanel from "@/components/faculty/FacultyPanel";
import PageHero from "@/components/ui/PageHero";
import Sheet from "@/components/ui/Sheet";
import { FACULTIES, type Department, type Faculty } from "@/data/faculties";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";

const DEPARTMENT_COUNT = FACULTIES.reduce((n, f) => n + f.departments.length, 0);
const SUGGESTIONS = ["Informatika", "Desain", "Kapal", "Dokter", "Data", "Arsitektur"];

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

interface Hit {
  faculty: Faculty;
  dept: Department;
  /** Why it matched when it wasn't the name, e.g. a career */
  reason?: string;
}

/** Departments whose name, expertise, careers or school subjects mention the query. */
function searchDepartments(query: string): Hit[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  const hits: Hit[] = [];
  for (const faculty of FACULTIES) {
    for (const dept of faculty.departments) {
      if (normalize(dept.name).includes(q)) {
        hits.push({ faculty, dept });
        continue;
      }
      const reason = [...dept.competencies, ...dept.careers, ...dept.relatedSubjects].find((t) => normalize(t).includes(q));
      if (reason) hits.push({ faculty, dept, reason: reason.charAt(0) + reason.slice(1).toLowerCase() });
    }
  }
  // exact name hits first
  return hits.sort((a, b) => Number(Boolean(a.reason)) - Number(Boolean(b.reason)));
}

export default function FacultiesPage() {
  usePageTitle("Fakultas & Departemen");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [dept, setDept] = useState<Department | null>(null);
  const hits = searchDepartments(query);
  const searching = normalize(query).length >= 2;

  const show = (f: Faculty, d: Department | null = null) => {
    setFaculty(f);
    setDept(d);
    setOpen(true);
  };

  return (
    <div ref={root} className="bg-cream">
      <PageHero
        emoji="🏛️"
        eyebrow="Fakultas & Departemen"
        title={<>Delapan fakultas, <em>satu</em> kampus.</>}
        description={`Ada ${FACULTIES.length} fakultas dan ${DEPARTMENT_COUNT} departemen & prodi di ITS. Pilih fakultasnya, atau langsung cari jurusan yang cocok sama minatmu.`}
      >
        <div data-reveal className="mt-8 max-w-xl">
          <label htmlFor="dept-search" className="sr-only">
            Cari jurusan
          </label>
          <div className="relative">
            <Search size={20} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-ink-soft" />
            <input
              id="dept-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari jurusan atau minat, mis. desain, kapal, data…"
              autoComplete="off"
              className="w-full rounded-full bg-white py-4 pr-12 pl-13 text-base font-semibold text-ink shadow-[0_5px_0_rgb(27_31_59/0.08)] ring-2 ring-ink/10 outline-none placeholder:font-medium placeholder:text-ink-soft/60 focus:ring-its [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                className="absolute top-1/2 right-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-cream text-ink-soft hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-hand text-lg font-bold text-ink-soft">Coba:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full bg-white/80 px-3 py-1 font-semibold text-ink ring-2 ring-ink/10 transition hover:-translate-y-0.5 hover:bg-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 pt-4 pb-24" aria-live="polite">
        {!searching ? (
          <FacultyCards onSelect={(f) => show(f)} />
        ) : hits.length === 0 ? (
          <div className="card mx-auto max-w-xl p-10 text-center">
            <p className="text-5xl">🔍</p>
            <p className="mt-4 font-display text-2xl font-extrabold text-ink">“{query}” belum ketemu</p>
            <p className="mt-2 text-ink-soft">Coba kata lain, atau jelajahi fakultasnya satu per satu.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-6 font-bold text-its underline-offset-4 hover:underline">
              Lihat semua fakultas
            </button>
          </div>
        ) : (
          <>
            <p className="mb-5 font-semibold text-ink-soft">
              {hits.length} jurusan cocok dengan “<span className="text-ink">{query}</span>”
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hits.map(({ faculty: f, dept: d, reason }) => (
                <li key={d.slug}>
                  <button
                    type="button"
                    onClick={() => show(f, d)}
                    className="group flex h-full w-full items-center gap-4 rounded-[1.5rem] bg-white p-3 pr-4 text-left ring-2 ring-ink/10 transition duration-200 ease-bounce hover:-translate-y-1 hover:shadow-[0_6px_0_rgb(27_31_59/0.1)]"
                  >
                    <img src={d.image} alt="" loading="lazy" className="h-20 w-24 shrink-0 rounded-2xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg leading-tight font-extrabold text-ink">{d.name}</span>
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="rounded-full px-2 py-0.5 text-[0.7rem] font-extrabold text-ink uppercase" style={{ background: `${f.accent}40` }}>
                          {f.id}
                        </span>
                        {reason && <span className="rounded-full bg-sun-light px-2 py-0.5 text-[0.7rem] font-bold text-ink">✨ {reason}</span>}
                      </span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-ink-soft transition group-hover:translate-x-1" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <Sheet open={open} onOpenChange={setOpen} title={dept?.name ?? faculty?.name ?? "Fakultas"}>
        {faculty && <FacultyPanel key={`${faculty.id}-${dept?.slug ?? ""}`} faculty={faculty} initialDept={dept} />}
      </Sheet>
    </div>
  );
}
