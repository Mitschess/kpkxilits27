import { cn } from "@/lib/utils";

const WORDS = ["Eksplorasi", "Kebudayaan", "Solidaritas", "Masa Depan", "Gresik → ITS", "#SemangatPulangKampung"];

function Band({ className, reverse = false }: { className?: string; reverse?: boolean }) {
  const items = [...WORDS, ...WORDS];
  return (
    <div className={cn("overflow-hidden py-3.5", className)}>
      <div
        className="flex w-max animate-marquee"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((w, i) => (
              <span key={i} className="flex items-center font-display text-xl font-semibold tracking-tight whitespace-nowrap md:text-2xl">
                <span className="px-6">{w}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0 L9.8 6.2 L16 8 L9.8 9.8 L8 16 L6.2 9.8 L0 8 L6.2 6.2 Z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two crossing festival banners between the hero and the first section. */
export default function Ticker() {
  return (
    <div className="relative z-10 -my-4 overflow-hidden bg-night-950 py-10">
      <Band className="relative z-10 -rotate-[2.5deg] scale-x-105 bg-lantern text-night-950 shadow-[0_0_60px_-10px_rgb(255_178_63/0.6)]" />
      <Band reverse className="-mt-3 rotate-[1.5deg] scale-x-105 bg-magenta text-paper" />
    </div>
  );
}
