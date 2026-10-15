import { cn } from "@/lib/utils";

// Fixed "random" layout so renders are stable
const LANTERNS = [
  { left: 6, size: 18, duration: 24, delay: 0 },
  { left: 16, size: 12, duration: 30, delay: 6 },
  { left: 27, size: 22, duration: 21, delay: 12 },
  { left: 39, size: 14, duration: 27, delay: 3 },
  { left: 52, size: 26, duration: 19, delay: 9 },
  { left: 63, size: 12, duration: 29, delay: 15 },
  { left: 72, size: 20, duration: 23, delay: 1 },
  { left: 84, size: 15, duration: 26, delay: 8 },
  { left: 93, size: 22, duration: 20, delay: 13 },
];

/** Little glowing paper lanterns drifting up the sky. */
export default function SkyLanterns({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {LANTERNS.map((l, i) => (
        <div
          key={i}
          className="absolute -bottom-12 animate-rise"
          style={{
            left: `${l.left}%`,
            animationDuration: `${l.duration}s`,
            animationDelay: `-${l.delay}s`,
            // on the wrapper: a clip-path would cut the glow off
            filter: "drop-shadow(0 0 10px rgb(255 178 63 / 0.75))",
          }}
        >
          <div
            className="rounded-[3px]"
            style={{
              width: l.size,
              height: l.size * 1.35,
              background: "linear-gradient(180deg, #ffe29a 0%, #ffb23f 55%, #f0592a 100%)",
              clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
