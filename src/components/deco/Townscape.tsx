import { cn } from "@/lib/utils";

const INK = "#1b1f3b";
const S = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const };
const BASE = 192;

const HOUSES = [
  { x: 845, w: 58, h: 44, wall: "#fff2c4", roof: "#ff8a3d" },
  { x: 912, w: 66, h: 54, wall: "#ffe1ef", roof: "#e8553a" },
  { x: 990, w: 54, h: 40, wall: "#e2f3ff", roof: "#ff8a3d" },
  { x: 1052, w: 70, h: 50, wall: "#d3f7eb", roof: "#e8553a" },
  { x: 1134, w: 56, h: 44, wall: "#ece6ff", roof: "#ff8a3d" },
];

function House({ x, w, h, wall, roof }: (typeof HOUSES)[number]) {
  const top = BASE - h;
  return (
    <g>
      <polygon points={`${x - 6},${top + 2} ${x + w / 2},${top - 26} ${x + w + 6},${top + 2}`} fill={roof} {...S} />
      <rect x={x} y={top} width={w} height={h} fill={wall} {...S} />
      <rect x={x + w / 2 - 7} y={BASE - 22} width="14" height="22" rx="3" fill="#2f5bea" {...S} />
      <rect x={x + 7} y={top + 10} width="12" height="12" rx="2" fill="#ffc93c" {...S} />
    </g>
  );
}

function Tree({ x, r = 18, color = "#38c172" }: { x: number; r?: number; color?: string }) {
  return (
    <g>
      <rect x={x - 3} y={BASE - 26} width="6" height="26" fill="#a0632d" {...S} />
      <circle cx={x} cy={BASE - 26 - r * 0.7} r={r} fill={color} {...S} />
    </g>
  );
}

function Palm({ x }: { x: number }) {
  const top = BASE - 78;
  return (
    <g>
      <path d={`M${x} ${BASE} Q${x - 8} ${BASE - 40} ${x + 4} ${top}`} stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d={`M${x} ${BASE} Q${x - 8} ${BASE - 40} ${x + 4} ${top}`} stroke="#c7863f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {[-150, -110, -60, -20, 25].map((a) => (
        <ellipse key={a} cx={x + 4} cy={top} rx="24" ry="6.5" fill="#2bb673" {...S} transform={`rotate(${a} ${x + 4} ${top}) translate(18 0)`} />
      ))}
    </g>
  );
}

/**
 * Cartoon Gresik from the harbour to the kampung, ending at the ITS campus:
 * cranes and a container ship, the cement plant, Masjid Jami', colourful houses.
 */
export default function Townscape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice" className={cn("pointer-events-none block w-full", className)} aria-hidden="true">
      {/* hills */}
      <path d="M-20 200 Q 220 70 520 150 T 1000 130 T 1460 120 V 200 Z" fill="#bfeeb8" />
      <path d="M-20 200 Q 300 120 640 170 T 1460 150 V 200 Z" fill="#9be38f" />

      {/* harbour crane */}
      <rect x="62" y="52" width="12" height="140" fill="#ff8a3d" {...S} />
      {[70, 95, 120, 145, 170].map((y) => (
        <line key={y} x1="62" y1={y} x2="74" y2={y + 18} stroke={INK} strokeWidth="2" />
      ))}
      <rect x="36" y="44" width="200" height="12" rx="3" fill="#ff8a3d" {...S} />
      <line x1="68" y1="20" x2="230" y2="46" stroke={INK} strokeWidth="2.5" />
      <rect x="62" y="16" width="12" height="30" fill="#ff8a3d" {...S} />
      <line x1="196" y1="56" x2="196" y2="104" stroke={INK} strokeWidth="2" />
      <rect x="186" y="104" width="20" height="10" rx="2" fill="#ff4fa3" {...S} />

      {/* container ship */}
      <path d="M86 160 H286 L270 190 H100 Z" fill="#2f5bea" {...S} />
      <rect x="100" y="138" width="34" height="22" fill="#ff4fa3" {...S} />
      <rect x="138" y="138" width="34" height="22" fill="#ffc93c" {...S} />
      <rect x="176" y="138" width="34" height="22" fill="#1fbf9a" {...S} />
      <rect x="119" y="116" width="34" height="22" fill="#9b7bff" {...S} />
      <rect x="157" y="116" width="34" height="22" fill="#ff8a3d" {...S} />
      <rect x="226" y="122" width="40" height="38" rx="4" fill="#fff" {...S} />
      <rect x="234" y="130" width="10" height="9" fill="#6cc4ff" {...S} />
      <rect x="250" y="130" width="10" height="9" fill="#6cc4ff" {...S} />

      {/* cement plant */}
      <rect x="330" y="128" width="120" height="64" fill="#eef0f7" {...S} />
      <rect x="350" y="62" width="18" height="66" fill="#fff" {...S} />
      {[72, 96].map((y) => (
        <rect key={y} x="350" y={y} width="18" height="10" fill="#e8553a" {...S} />
      ))}
      <rect x="392" y="82" width="16" height="46" fill="#fff" {...S} />
      <rect x="392" y="92" width="16" height="9" fill="#e8553a" {...S} />
      <circle cx="362" cy="48" r="11" fill="#fff" {...S} />
      <circle cx="378" cy="34" r="14" fill="#fff" {...S} />
      <circle cx="400" cy="70" r="9" fill="#fff" {...S} />
      {[346, 376, 406].map((x) => (
        <rect key={x} x={x} y="150" width="18" height="14" rx="2" fill="#6cc4ff" {...S} />
      ))}
      <rect x="456" y="104" width="44" height="88" rx="20" fill="#dfe3ef" {...S} />

      <Tree x={540} />
      <Palm x={580} />

      {/* Masjid Jami' */}
      <rect x="616" y="128" width="170" height="64" fill="#fff6dc" {...S} />
      <path d="M646 128 Q646 66 701 60 Q756 66 756 128 Z" fill="#1fbf9a" {...S} />
      <line x1="701" y1="60" x2="701" y2="40" stroke={INK} strokeWidth="2.5" />
      <circle cx="701" cy="37" r="5" fill="#ffc93c" {...S} />
      <path d="M616 128 Q616 104 632 102 Q648 104 648 128 Z" fill="#1fbf9a" {...S} />
      <path d="M754 128 Q754 104 770 102 Q786 104 786 128 Z" fill="#1fbf9a" {...S} />
      <path d="M690 192 V164 A11 11 0 0 1 712 164 V192 Z" fill="#2f5bea" {...S} />
      {[636, 662, 740, 766].map((x) => (
        <path key={x} d={`M${x - 7} 172 V156 A7 7 0 0 1 ${x + 7} 156 V172 Z`} fill="#ffc93c" {...S} />
      ))}
      <rect x="800" y="62" width="20" height="130" fill="#fff6dc" {...S} />
      <rect x="796" y="104" width="28" height="8" fill="#1fbf9a" {...S} />
      <polygon points="796,62 810,30 824,62" fill="#1fbf9a" {...S} />

      {/* kampung */}
      {HOUSES.map((h) => (
        <House key={h.x} {...h} />
      ))}
      <Tree x={1210} r={20} color="#2bb673" />

      {/* ITS campus at the end of the road */}
      <rect x="1250" y="70" width="120" height="122" rx="6" fill="#2f5bea" {...S} />
      <rect x="1280" y="36" width="60" height="34" rx="4" fill="#1d3fb5" {...S} />
      <text x="1310" y="60" textAnchor="middle" fontFamily="Bricolage Grotesque Variable, sans-serif" fontWeight="800" fontSize="20" fill="#ffc93c">
        ITS
      </text>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect key={`${row}-${col}`} x={1262 + col * 26} y={84 + row * 22} width="16" height="12" rx="2" fill={(row + col) % 3 ? "#dfe7ff" : "#ffc93c"} />
        )),
      )}
      <Palm x={1400} />

      {/* ground */}
      <rect x="-10" y={BASE} width="1460" height="20" fill="#7fd47a" {...S} />
    </svg>
  );
}
