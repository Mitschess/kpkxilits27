import type { CabinetDivision, CabinetMember } from "@/data/cabinet";
import { cn } from "@/lib/utils";

export const DIVISION_COLOR: Record<CabinetDivision["color"], string> = {
  yellow: "#ffd76a",
  blue: "#6f8fff",
  green: "#22b89a",
  pink: "#ec3b92",
  orange: "#ffb23f",
};

interface MemberCardProps {
  member: CabinetMember;
  color: string;
  /** Head of the division: gets a ribbon */
  featured?: boolean;
}

/** Portrait cut-out standing in the glow of its division's lantern colour. */
export default function MemberCard({ member, color, featured }: MemberCardProps) {
  return (
    <figure data-reveal className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-night-800 ring-1 ring-paper/10">
      <div
        className="absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 50% 62%, ${color}70 0%, ${color}26 38%, transparent 68%)` }}
      />
      <div className="weave absolute inset-0 opacity-60" />
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full origin-bottom object-cover object-bottom transition duration-700 ease-out-expo group-hover:scale-[1.04]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night-950 via-night-950/80 to-transparent p-4 pt-14">
        <p className="font-display text-base leading-tight font-semibold text-balance text-paper">{member.name.trim()}</p>
        <p className={cn("mt-1 text-xs", featured ? "font-semibold" : "text-mist")} style={featured ? { color } : undefined}>
          {member.role.trim()}
        </p>
      </figcaption>
      {featured && (
        <span className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-night-950 uppercase" style={{ background: color }}>
          Kepala
        </span>
      )}
    </figure>
  );
}
