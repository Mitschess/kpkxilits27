import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import SectionFade from "@/components/deco/SectionFade";
import { buttonClass } from "@/components/ui/button";
import { FACULTIES } from "@/data/faculties";
import { cn } from "@/lib/utils";

const DEPARTMENT_COUNT = FACULTIES.reduce((n, f) => n + f.departments.length, 0);

/** Small banner on the home page pointing to the full /fakultas page. */
export default function FacultyTeaser() {
  return (
    <section aria-labelledby="faculty-teaser" className="relative isolate bg-white py-16 md:py-20">
      <SectionFade edge="top" color="var(--color-its)" className="lg:hidden" />
      <SectionFade edge="bottom" color="var(--color-mint-light)" />
      <div className="mx-auto max-w-7xl px-6">
        <div
          data-reveal
          className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] bg-sun-light p-8 ring-2 ring-sun/70 md:flex-row md:justify-between md:p-10"
        >
          <div className="max-w-xl text-center md:text-left">
            <p className="font-hand text-2xl font-bold text-pink">Masih bingung mau jurusan apa?</p>
            <h2 id="faculty-teaser" className="mt-2 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-ink md:text-4xl">
              Kenalan sama {FACULTIES.length} fakultas & {DEPARTMENT_COUNT} departemen di ITS.
            </h2>
            <Link to="/fakultas" className={buttonClass("blue", "mt-6")}>
              Jelajahi fakultas <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* faculty icons as chunky keys: a tidy grid that only moves when you touch it */}
          <ul className="grid grid-cols-4 gap-x-3 gap-y-4" aria-label="Daftar fakultas">
            {FACULTIES.map((f, i) => {
              const Icon = f.icon;
              return (
                <li key={f.id}>
                  <Link
                    to="/fakultas"
                    title={f.name}
                    aria-label={f.name}
                    className={cn(
                      "grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-ink text-ink shadow-[0_4px_0_#1b1f3b] transition duration-200 ease-bounce hover:-translate-y-1 hover:shadow-[0_6px_0_#1b1f3b] active:translate-y-[3px] active:shadow-[0_1px_0_#1b1f3b] md:h-[4.5rem] md:w-[4.5rem]",
                      i % 2 ? "hover:rotate-6" : "hover:-rotate-6",
                    )}
                    style={{ background: f.accent }}
                  >
                    <Icon size={28} strokeWidth={2} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
