import { cn } from "@/lib/utils";

export function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 100" className={className} style={style} aria-hidden="true">
      <path d="M40 90 H160 A30 30 0 0 0 160 30 A42 42 0 0 0 82 22 A30 30 0 0 0 40 90 Z" fill="#fff" />
      <path d="M40 90 H160 A30 30 0 0 0 186 76 H40 Z" fill="#e8f2ff" opacity="0.8" />
    </svg>
  );
}

// fixed layout so renders are stable
const CLOUDS = [
  { top: "8%", width: 170, duration: 95, delay: 0, opacity: 0.95 },
  { top: "22%", width: 110, duration: 120, delay: 40, opacity: 0.8 },
  { top: "4%", width: 90, duration: 140, delay: 85, opacity: 0.7 },
  { top: "34%", width: 140, duration: 105, delay: 65, opacity: 0.85 },
  { top: "15%", width: 220, duration: 130, delay: 18, opacity: 0.9 },
];

/** Clouds drifting slowly across the sky. */
export default function Clouds({ className, count = CLOUDS.length }: { className?: string; count?: number }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {CLOUDS.slice(0, count).map((c, i) => (
        <div
          key={i}
          className="absolute left-0 animate-drift"
          style={{ top: c.top, animationDuration: `${c.duration}s`, animationDelay: `-${c.delay}s`, opacity: c.opacity }}
        >
          <Cloud style={{ width: c.width }} className="drop-shadow-[0_8px_10px_rgb(47_91_234/0.08)]" />
        </div>
      ))}
    </div>
  );
}
