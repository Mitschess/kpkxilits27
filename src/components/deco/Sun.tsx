import { cn } from "@/lib/utils";

/** Big friendly sun with slowly turning rays. */
export default function Sun({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none", className)} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x="96"
            y="2"
            width="8"
            height="34"
            rx="4"
            fill={i % 2 ? "#ffd75e" : "#ffc93c"}
            transform={`rotate(${i * 22.5} 100 100)`}
          />
        ))}
      </svg>
      <div className="absolute inset-[24%] rounded-full bg-gradient-to-br from-[#ffe17a] to-sun shadow-[0_0_80px_20px_rgb(255_201_60/0.45)]" />
    </div>
  );
}
