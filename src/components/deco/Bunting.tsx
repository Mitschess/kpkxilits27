import Lantern from "@/components/lantern/Lantern";
import type { ArtVariant } from "@/components/lantern/LanternArt";
import { cn } from "@/lib/utils";

const COLORS = ["#ffc93c", "#ff4fa3", "#1fbf9a", "#2f5bea", "#ff8a3d", "#9b7bff"];

export interface HangingLantern {
  /** Where along the rope, 0 (left) – 1 (right) */
  at: number;
  size: number;
  faces: ArtVariant[];
  /** Cord length below the rope (px or CSS length); defaults to just below the flags */
  drop?: number | string;
  /** Lit from inside (default) or still dark */
  lit?: boolean;
  className?: string;
}

interface BuntingProps {
  className?: string;
  flags?: number;
  /** How far the rope sags in the middle (viewBox units, width = 1000) */
  sag?: number;
  /** Damar kurung hung from the rope between the flags */
  lanterns?: HangingLantern[];
  /** How many flags are up, from the left; the rest pop in as this grows (default: all) */
  shown?: number;
}

/**
 * A string of triangle flags (umbul-umbul / bendera segitiga), like every
 * kampung festival and 17-an. Each flag sways a little on its own; damar
 * kurung can hang from the same rope.
 */
export default function Bunting({ className, flags = 18, sag = 46, lanterns = [], shown = flags }: BuntingProps) {
  const W = 1000;
  // flags shrink as more of them share the rope
  const half = Math.min(19, (W / flags) * 0.42);
  const tall = half * 2.1;
  const H = sag + tall + 20;
  // quadratic rope from (0,6) to (W,6), sagging by `sag` in the middle
  const p0 = { x: 0, y: 6 };
  const p1 = { x: W / 2, y: 6 + sag * 2 };
  const p2 = { x: W, y: 6 };
  const at = (t: number) => ({
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
  });
  const slope = (t: number) => {
    const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden="true">
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
          <path d={`M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`} stroke="#1b1f3b" strokeWidth="2.5" fill="none" />
          {Array.from({ length: flags }, (_, i) => {
            const t = (i + 0.5) / flags;
            const { x, y } = at(t);
            return (
              <g key={i} transform={`rotate(${slope(t)} ${x} ${y})`}>
                {/* outer group pops the flag in; the polygon keeps its own sway */}
                <g
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "50% 0%",
                    transform: i < shown ? "scale(1)" : "scale(0)",
                    transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <polygon
                    points={`${x - half},${y} ${x + half},${y} ${x},${y + tall}`}
                    fill={COLORS[i % COLORS.length]}
                    stroke="#1b1f3b"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="animate-sway"
                    style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animationDelay: `-${(i * 0.37) % 3.2}s` }}
                  />
                </g>
              </g>
            );
          })}
        </svg>

        {lanterns.map((l, i) => {
          // in vw so it scales with the flags (the svg is full-width): clear of the flag tips
          const drop = l.drop ?? `${((tall + 8) / W) * 100}vw`;
          // anchor exactly on the rope; the svg scales uniformly, so % of its height works
          const rope = at(l.at);
          return (
            <div
              key={i}
              className={cn("absolute", l.className)}
              style={{ left: `${(rope.x / W) * 100}%`, top: `${(rope.y / H) * 100}%` }}
            >
              <div
                data-hanging-lantern
                className="-translate-x-1/2 animate-swing [transform-origin:50%_0%]"
                style={{ paddingTop: drop, animationDelay: `-${i * 1.3}s` }}
              >
                <Lantern size={l.size} faces={l.faces} cord={drop} spinDuration={16 + i * 4} lit={l.lit} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
