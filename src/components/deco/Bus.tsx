import { cn } from "@/lib/utils";

/** The KPK bus that carries everyone from Gresik to ITS. */
export default function Bus({ className, moving = true }: { className?: string; moving?: boolean }) {
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy="58" r="9" fill="#1b1f3b" />
      <g className={moving ? "animate-spin" : undefined} style={{ transformBox: "fill-box", transformOrigin: "center", animationDuration: "0.6s" }}>
        <circle cx={cx} cy="58" r="4" fill="#d9deec" />
        <rect x={cx - 0.9} y="53" width="1.8" height="10" fill="#1b1f3b" />
      </g>
    </g>
  );

  return (
    <svg viewBox="0 0 132 70" className={cn("overflow-visible", className)} aria-hidden="true">
      <g className={moving ? "animate-bump" : undefined}>
        {/* body */}
        <rect x="4" y="8" width="118" height="48" rx="12" fill="#ffc93c" stroke="#1b1f3b" strokeWidth="3" />
        <rect x="4" y="40" width="118" height="7" fill="#ff4fa3" />
        {/* windows */}
        {[14, 38, 62].map((x) => (
          <rect key={x} x={x} y="16" width="19" height="17" rx="4" fill="#dfe7ff" stroke="#1b1f3b" strokeWidth="2.5" />
        ))}
        {/* windscreen + door */}
        <path d="M88 16 h20 a8 8 0 0 1 8 8 v9 h-28 z" fill="#dfe7ff" stroke="#1b1f3b" strokeWidth="2.5" />
        <text x="44" y="53.5" textAnchor="middle" fontFamily="Bricolage Grotesque Variable, sans-serif" fontWeight="800" fontSize="9" fill="#1b1f3b">
          KPK × ILITS
        </text>
        {/* lights */}
        <circle cx="117" cy="44" r="3.2" fill="#fff6c8" stroke="#1b1f3b" strokeWidth="1.5" />
        <rect x="2" y="42" width="5" height="7" rx="2" fill="#ff8a3d" />
        {/* roof rack with a little bag */}
        <rect x="26" y="3" width="44" height="6" rx="3" fill="#1fbf9a" stroke="#1b1f3b" strokeWidth="2.5" />
      </g>
      {wheel(30)}
      {wheel(96)}
    </svg>
  );
}
