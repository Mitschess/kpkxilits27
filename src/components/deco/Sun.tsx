import { cn } from "@/lib/utils";

interface SunProps {
  className?: string;
  /** Rays run from this radius… (viewBox 200, centre at 100) */
  rayInner?: number;
  /** …to this one */
  rayOuter?: number;
  rays?: number;
}

/** Big friendly sun with slowly turning rays. */
export default function Sun({ className, rayInner = 64, rayOuter = 98, rays = 16 }: SunProps) {
  const width = rays > 16 ? 5 : 8;
  return (
    <div className={cn("pointer-events-none", className)} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
        {Array.from({ length: rays }, (_, i) => (
          <rect
            key={i}
            x={100 - width / 2}
            y={100 - rayOuter}
            width={width}
            height={rayOuter - rayInner}
            rx={width / 2}
            fill={i % 2 ? "#ffd75e" : "#ffc93c"}
            transform={`rotate(${(i * 360) / rays} 100 100)`}
          />
        ))}
      </svg>
      <div className="absolute inset-[24%] rounded-full bg-gradient-to-br from-[#ffe17a] to-sun shadow-[0_0_80px_20px_rgb(255_201_60/0.45)]" />
    </div>
  );
}
