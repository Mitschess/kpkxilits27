import { useEffect, useRef, useState } from "react";
import PageHero from "@/components/ui/PageHero";
import MemberCard, { DIVISION_COLOR } from "@/components/cabinet/MemberCard";
import { CABINET_DATA, type CabinetDivision, type CabinetMember } from "@/data/cabinet";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";
import { scrollToElement } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TOTAL = CABINET_DATA.reduce((n, d) => n + d.members.length, 0);

export default function CabinetPage() {
  usePageTitle("Struktur Kabinet");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const [active, setActive] = useState(CABINET_DATA[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("divisi-", ""))),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    CABINET_DATA.forEach((d) => {
      const el = document.getElementById(`divisi-${d.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="bg-night-950">
      <PageHero
        eyebrow="Struktur Kabinet KPK 2026"
        title={<>Orang-orang di balik <em>cahaya</em> KPK.</>}
        description="Orang-orang hebat di balik layar yang siap menggebrak masa depan!"
      >
        <p data-reveal className="mt-8 flex gap-6 text-sm text-paper/80">
          <span>
            <span className="font-display text-2xl font-semibold text-paper">{TOTAL}</span> panitia
          </span>
          <span>
            <span className="font-display text-2xl font-semibold text-paper">{CABINET_DATA.length}</span> divisi
          </span>
        </p>
      </PageHero>

      {/* division jump bar */}
      <nav aria-label="Divisi" className="sticky top-0 z-30 border-y border-paper/10 bg-night-950/85 backdrop-blur-xl">
        <div className="scrollbar-none mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none]">
          {CABINET_DATA.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                const el = document.getElementById(`divisi-${d.id}`);
                if (el) scrollToElement(el);
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ring-1 transition",
                active === d.id ? "text-night-950 ring-transparent" : "text-paper/75 ring-paper/15 hover:text-paper hover:ring-paper/30",
              )}
              style={active === d.id ? { background: DIVISION_COLOR[d.color] } : undefined}
            >
              {d.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-28 px-6 py-20 md:py-28">
        {CABINET_DATA.map((d, i) => (
          <Division key={d.id} division={d} index={i} />
        ))}
      </div>
    </div>
  );
}

function Division({ division, index }: { division: CabinetDivision; index: number }) {
  const color = DIVISION_COLOR[division.color];
  const core = division.members.filter((m) => !m.subDepartment);
  const groups = new Map<string, CabinetMember[]>();
  for (const m of division.members) {
    if (m.subDepartment) groups.set(m.subDepartment, [...(groups.get(m.subDepartment) ?? []), m]);
  }

  return (
    <section id={`divisi-${division.id}`} className="scroll-mt-40">
      <div data-reveal className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-paper/10 pb-6">
        <div>
          <p className="eyebrow" style={{ color }}>
            Divisi {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-paper md:text-5xl">{division.name}</h2>
        </div>
        <p className="text-sm text-mist">{division.members.length} orang</p>
      </div>

      {core.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {core.map((m) => (
            <MemberCard key={m.id} member={m} color={color} featured={groups.size > 0} />
          ))}
        </div>
      )}

      {[...groups].map(([name, members]) => (
        <div key={name} className="mt-12">
          <p data-reveal className="mb-5 flex items-center gap-3 text-sm font-medium text-paper/80">
            <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
            {name}
            <span className="text-mist">· {members.length}</span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} color={color} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
