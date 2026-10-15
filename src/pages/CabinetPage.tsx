import { useEffect, useRef, useState } from "react";
import PageHero from "@/components/ui/PageHero";
import MemberCard, { DIVISION_COLOR } from "@/components/cabinet/MemberCard";
import { CABINET_DATA, type CabinetDivision, type CabinetMember } from "@/data/cabinet";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";
import { scrollToElement } from "@/lib/motion";

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
    <div ref={root} className="bg-cream">
      <PageHero
        emoji="🙌"
        eyebrow="Struktur Kabinet KPK 2026"
        title={<>Kenalan sama <em>panitia</em> KPK!</>}
        description="Orang-orang hebat di balik layar yang siap menggebrak masa depan!"
      >
        <div data-reveal className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-2xl bg-white px-4 py-2.5 font-bold text-ink ring-2 ring-ink/10">
            <span className="font-display text-2xl font-extrabold text-its">{TOTAL}</span> panitia
          </span>
          <span className="rounded-2xl bg-white px-4 py-2.5 font-bold text-ink ring-2 ring-ink/10">
            <span className="font-display text-2xl font-extrabold text-pink">{CABINET_DATA.length}</span> divisi
          </span>
        </div>
      </PageHero>

      {/* division jump bar */}
      <nav aria-label="Divisi" className="sticky top-0 z-30 border-y-2 border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none]">
          {CABINET_DATA.map((d) => {
            const c = DIVISION_COLOR[d.color];
            const on = active === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  const el = document.getElementById(`divisi-${d.id}`);
                  if (el) scrollToElement(el);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap ring-2 transition duration-200 ease-bounce ${on ? "ring-transparent" : "ring-ink/10"}`}
                style={
                  on
                    ? { background: c.solid, color: d.color === "yellow" || d.color === "orange" ? "#1b1f3b" : "#fff", boxShadow: `0 3px 0 ${c.shadow}` }
                    : { background: "#fff" }
                }
              >
                <span className={on ? "" : "text-ink/75"}>{d.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16 md:py-24">
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
      <div data-reveal className="mb-8 flex flex-wrap items-center gap-4">
        <span
          className="grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-extrabold text-ink"
          style={{ background: color.solid, boxShadow: `0 4px 0 ${color.shadow}` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h2 className="font-display text-4xl leading-none font-extrabold tracking-tight text-ink md:text-5xl">{division.name}</h2>
          <p className="mt-1 text-sm font-semibold text-ink-soft">{division.members.length} orang</p>
        </div>
      </div>

      {core.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {core.map((m) => (
            <MemberCard key={m.id} member={m} color={color} featured={groups.size > 0} />
          ))}
        </div>
      )}

      {[...groups].map(([name, members]) => (
        <div key={name} className="mt-10">
          <p data-reveal className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-ink" style={{ background: color.light }}>
            {name}
            <span className="rounded-full bg-white px-2 py-0.5 text-xs">{members.length}</span>
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} color={color} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
