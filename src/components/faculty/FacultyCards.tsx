import { ArrowUpRight } from "lucide-react";
import { FACULTIES, type Faculty } from "@/data/faculties";

const TILTS = ["md:-rotate-1", "md:rotate-1", "md:rotate-[-0.5deg]", "md:rotate-[1.5deg]"];

/** The eight faculty cards; clicking one opens its departments. */
export default function FacultyCards({ onSelect }: { onSelect: (faculty: Faculty) => void }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {FACULTIES.map((f, i) => {
        const Icon = f.icon;
        return (
          <div key={f.id} data-reveal>
            <button
              type="button"
              onClick={() => onSelect(f)}
              className={`group relative flex h-full min-h-[260px] w-full flex-col overflow-hidden rounded-[1.75rem] p-6 text-left ring-2 ring-ink/10 transition duration-300 ease-bounce hover:-translate-y-2 hover:rotate-0 hover:shadow-[0_10px_0_rgb(27_31_59/0.12)] ${TILTS[i % TILTS.length]}`}
              style={{ background: `${f.accent}24`, "--accent": f.accent } as React.CSSProperties}
            >
              <span className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full opacity-40 transition duration-500 group-hover:scale-125" style={{ background: f.accent }} />

              <span className="relative flex items-start justify-between">
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl border-[3px] border-ink text-ink transition duration-300 ease-bounce group-hover:-rotate-12"
                  style={{ background: f.accent }}
                >
                  <Icon size={26} strokeWidth={2} />
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[0.7rem] font-extrabold tracking-wider text-ink uppercase ring-2 ring-ink/10">
                  {f.id}
                </span>
              </span>

              <span className="relative mt-auto pt-10">
                <span className="block font-display text-xl leading-tight font-extrabold tracking-tight text-balance text-ink">
                  {f.name.replace(/^Fakultas /, "")}
                </span>
                <span className="mt-2 line-clamp-2 block text-sm font-medium text-ink-soft">{f.description}</span>
                <span className="mt-5 flex items-center justify-between text-sm font-bold text-ink">
                  {f.departments.length} departemen
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition duration-300 ease-bounce group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </span>
                </span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
