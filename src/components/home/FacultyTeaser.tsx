import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionFade from "@/components/deco/SectionFade";
import { buttonClass } from "@/components/ui/button";
import { FACULTIES, type Faculty } from "@/data/faculties";
import { cn } from "@/lib/utils";

const DEPARTMENT_COUNT = FACULTIES.reduce((n, f) => n + f.departments.length, 0);

// longer abbreviations get a smaller size so they still fit on the key
const ABBR_SIZE: Record<number, string> = {
  2: "text-[1.6rem] md:text-[1.8rem]",
  3: "text-xl md:text-[1.4rem]",
  4: "text-lg md:text-xl",
  5: "text-[0.95rem] md:text-[1.05rem]",
};

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

          <FacultyKeys />
        </div>
      </div>
    </section>
  );
}

/**
 * The faculty icons as chunky keys. Point at one (or tab to it) and it flips
 * over like a card to show the faculty's abbreviation, while the line below
 * spells out the full name.
 */
function FacultyKeys() {
  const [active, setActive] = useState<Faculty | null>(null);

  return (
    <div className="inline-flex flex-col items-center">
      <ul
        className="grid grid-cols-4 gap-x-3 gap-y-4"
        aria-label="Daftar fakultas"
        onMouseLeave={() => setActive(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
        }}
      >
        {FACULTIES.map((f, i) => {
          const Icon = f.icon;
          const abbr = f.id.toUpperCase();
          return (
            <li key={f.id}>
              <Link
                to="/fakultas"
                aria-label={`${f.name} (${abbr})`}
                onMouseEnter={() => setActive(f)}
                onFocus={() => setActive(f)}
                className="group/key relative block h-16 w-16 [perspective:500px] transition duration-200 ease-bounce hover:-translate-y-1 focus-visible:-translate-y-1 active:translate-y-0.5 md:h-[4.5rem] md:w-[4.5rem]"
              >
                <span
                  className={cn(
                    "relative block h-full w-full transition-transform duration-500 ease-bounce [transform-style:preserve-3d]",
                    // neighbours flip opposite ways, like a row of cards being turned
                    i % 2
                      ? "group-hover/key:[transform:rotateY(-180deg)] group-focus-visible/key:[transform:rotateY(-180deg)]"
                      : "group-hover/key:[transform:rotateY(180deg)] group-focus-visible/key:[transform:rotateY(180deg)]",
                  )}
                >
                  {/* front: the icon */}
                  <span
                    className="absolute inset-0 grid place-items-center rounded-2xl border-[3px] border-ink text-ink shadow-[0_4px_0_#1b1f3b] [backface-visibility:hidden]"
                    style={{ background: f.accent }}
                  >
                    <Icon size={28} strokeWidth={2} />
                  </span>
                  {/* back: the abbreviation, in the faculty's colour */}
                  <span className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-[3px] border-ink bg-ink shadow-[0_4px_0_#1b1f3b] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <span className={cn("font-display leading-none font-extrabold tracking-tight", ABBR_SIZE[abbr.length] ?? ABBR_SIZE[5])} style={{ color: f.accent }}>
                      {abbr}
                    </span>
                    <span className="mt-1 text-[0.6rem] font-bold text-white/70">{f.departments.length} dept</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* full name of the key under the cursor (the links carry it for screen readers) */}
      <div className="relative mt-5 h-11 w-0 min-w-full overflow-hidden" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.p
            key={active?.id ?? "hint"}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 text-center text-sm leading-snug font-semibold text-balance text-ink"
          >
            {active ? (
              <>
                <span className="mr-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-extrabold" style={{ background: active.accent }}>
                  {active.id.toUpperCase()}
                </span>
                {active.name}
              </>
            ) : (
              <span className="font-hand text-lg font-bold text-ink-soft">Arahkan kursor ke ikonnya, ya!</span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
