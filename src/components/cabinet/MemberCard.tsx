import { Star } from "lucide-react";
import type { CabinetDivision, CabinetMember } from "@/data/cabinet";

export const DIVISION_COLOR: Record<CabinetDivision["color"], { solid: string; light: string; shadow: string }> = {
  yellow: { solid: "#ffc93c", light: "#fff2c4", shadow: "#e5a500" },
  blue: { solid: "#2f5bea", light: "#dfe7ff", shadow: "#1d3fb5" },
  green: { solid: "#1fbf9a", light: "#d3f7eb", shadow: "#0f9a7a" },
  pink: { solid: "#ff4fa3", light: "#ffe1ef", shadow: "#db2b81" },
  orange: { solid: "#ff8a3d", light: "#ffe4d1", shadow: "#e2691c" },
};

interface MemberCardProps {
  member: CabinetMember;
  color: (typeof DIVISION_COLOR)[CabinetDivision["color"]];
  /** Head of the division: gets a "Kepala" badge in the bottom-left corner of the photo */
  featured?: boolean;
}

/** Trading-card style portrait: cut-out photo standing in front of a big coloured circle. */
export default function MemberCard({ member, color, featured }: MemberCardProps) {
  return (
    <figure
      data-reveal
      className="group relative rounded-[1.75rem] bg-white p-2 ring-2 ring-ink/10 transition duration-300 ease-bounce hover:-translate-y-1.5 hover:shadow-[0_8px_0_rgb(27_31_59/0.1)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]" style={{ background: color.light }}>
        <div
          className="absolute top-[18%] left-1/2 aspect-square w-[78%] -translate-x-1/2 rounded-full transition duration-500 ease-bounce group-hover:scale-110"
          style={{ background: color.solid }}
        />
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full origin-bottom object-cover object-bottom transition duration-500 ease-out-expo group-hover:scale-[1.05]"
        />
        {/* bottom-left: the top corner would land on the head on narrow cards */}
        {featured && (
          <span
            className="absolute bottom-2.5 left-2.5 inline-flex -rotate-3 items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold text-ink uppercase"
            style={{ background: "#ffc93c", boxShadow: "0 3px 0 #e5a500" }}
          >
            <Star size={11} strokeWidth={3} className="fill-ink" aria-hidden="true" /> Kepala
          </span>
        )}
      </div>
      <figcaption className="px-2 pt-3 pb-2">
        <p className="font-display text-[0.95rem] leading-tight font-extrabold text-balance text-ink">{member.name.trim()}</p>
        <p className="mt-1 text-xs font-bold" style={{ color: featured ? color.shadow : "#545b7e" }}>
          {member.role.trim()}
        </p>
      </figcaption>
    </figure>
  );
}
