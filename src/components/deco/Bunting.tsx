import { cn } from "@/lib/utils";

const COLORS = ["#ffc93c", "#ff4fa3", "#1fbf9a", "#2f5bea", "#ff8a3d", "#9b7bff"];

/**
 * A string of triangle flags (umbul-umbul / bendera segitiga), like every
 * kampung festival and 17-an. Each flag sways a little on its own.
 */
export default function Bunting({ className, flags = 18, sag = 46 }: { className?: string; flags?: number; sag?: number }) {
  const W = 1000;
  // quadratic curve from (0,6) through control (W/2, 6+2*sag) to (W,6)
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
    <svg viewBox={`0 0 ${W} ${sag + 60}`} className={cn("pointer-events-none block w-full", className)} aria-hidden="true">
      <path d={`M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`} stroke="#1b1f3b" strokeWidth="2.5" fill="none" />
      {Array.from({ length: flags }, (_, i) => {
        const t = (i + 0.5) / flags;
        const { x, y } = at(t);
        return (
          <g key={i} transform={`rotate(${slope(t)} ${x} ${y})`}>
            <polygon
              points={`${x - 19},${y} ${x + 19},${y} ${x},${y + 40}`}
              fill={COLORS[i % COLORS.length]}
              stroke="#1b1f3b"
              strokeWidth="2"
              strokeLinejoin="round"
              className="animate-sway"
              style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animationDelay: `-${(i * 0.37) % 3.2}s` }}
            />
          </g>
        );
      })}
    </svg>
  );
}
