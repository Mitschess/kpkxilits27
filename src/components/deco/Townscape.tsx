import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const INK = "#1b1f3b";
const S = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const };
const BASE = 192;
// width of the main scene (harbour to ITS); the sea and more city run on past both ends
const WIDTH = 1660;

const HOUSES = [
  { x: 838, w: 52, h: 44, wall: "#fff2c4", roof: "#ff8a3d" },
  { x: 960, w: 58, h: 50, wall: "#ffe1ef", roof: "#e8553a" },
  { x: 1128, w: 50, h: 42, wall: "#d3f7eb", roof: "#ff8a3d" },
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

// ---------- Gresik landmarks (between Masjid Jami' and the ITS campus) ----------

/** Tugu with a bundle of tall pointed silver blades fanning out of a golden bowl. */
function TuguBilah({ cx }: { cx: number }) {
  const blades = Array.from({ length: 7 }, (_, i) => {
    const off = i - 3;
    return { base: cx + off * 5, tip: cx + off * 10.5, top: 60 + Math.abs(off) * 10, light: i % 2 === 1 };
  });
  // outer blades first so the tall middle ones sit in front
  const order = [...blades].sort((a, b) => b.top - a.top);
  return (
    <g>
      {order.map((b) => (
        <g key={b.base}>
          <polygon points={`${b.base - 6},158 ${b.tip},${b.top} ${b.base + 6},158`} fill={b.light ? "#eef0f7" : "#d3d8e4"} {...S} strokeWidth="2" />
          <line x1={b.base} y1="156" x2={b.tip} y2={b.top + 8} stroke="#aab2c4" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ))}
      <path d={`M${cx - 25} 158 H${cx + 25} Q${cx + 23} 174 ${cx} 174 Q${cx - 23} 174 ${cx - 25} 158 Z`} fill="#ffc93c" {...S} />
      <ellipse cx={cx} cy="158" rx="25" ry="4.5" fill="#ffd75e" {...S} strokeWidth="2" />
      <rect x={cx - 17} y="174" width="34" height="7" rx="2" fill="#ffc93c" {...S} />
      <rect x={cx - 27} y="181" width="54" height="11" rx="3" fill="#fff2c4" {...S} />
    </g>
  );
}

/** The abstract stone elephant: a rounded body, trunk curling down to the ground. */
function PatungGajah({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y="179" width="48" height="13" rx="2" fill="#dfe3ef" {...S} />
      <path
        d={`M${x + 5} 179 V160 Q${x + 5} 140 ${x + 26} 140 Q${x + 46} 140 ${x + 46} 162 V179 H${x + 39} V165 Q${x + 39} 158 ${x + 33.5} 158 Q${x + 28} 158 ${x + 28} 165 V179 Z`}
        fill="#9aa3b5"
        {...S}
      />
      <ellipse cx={x + 14.5} cy="168" rx="3.5" ry="6" fill="#5c6478" />
      <path d={`M${x + 30} 146 Q${x + 25.5} 152 ${x + 30} 158`} stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx={x + 36} cy="150" r="1.7" fill={INK} />
    </g>
  );
}

/** Tugu Wilmar: two tall bronze leaves rising around a small lit shrine. */
function TuguWilmar({ cx }: { cx: number }) {
  const swirl = "#e8b04a";
  return (
    <g>
      <path d={`M${cx - 23} 182 Q${cx - 38} 118 ${cx - 6} 48 Q${cx - 2} 42 ${cx} 45 Q${cx - 12} 110 ${cx - 5} 182 Z`} fill="#a0632d" {...S} />
      <path d={`M${cx + 23} 182 Q${cx + 38} 118 ${cx + 6} 48 Q${cx + 2} 42 ${cx} 45 Q${cx + 12} 110 ${cx + 5} 182 Z`} fill="#a0632d" {...S} />
      {[96, 122, 148].map((y) => (
        <g key={y} stroke={swirl} strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d={`M${cx - 22} ${y} q4 -7 9 -2`} />
          <path d={`M${cx + 22} ${y} q-4 -7 -9 -2`} />
        </g>
      ))}
      <rect x={cx - 9} y="152" width="18" height="30" fill="#fff2c4" {...S} />
      <rect x={cx - 12} y="146" width="24" height="6" fill="#ffc93c" {...S} strokeWidth="2" />
      <rect x={cx - 8} y="139" width="16" height="7" fill="#ffc93c" {...S} strokeWidth="2" />
      <rect x={cx - 4} y="133" width="8" height="6" fill="#ffd75e" {...S} strokeWidth="2" />
      <rect x={cx - 4} y="165" width="8" height="17" rx="3" fill="#ffc93c" {...S} strokeWidth="2" />
      <rect x={cx - 29} y="182" width="58" height="10" rx="2" fill="#dfe3ef" {...S} />
    </g>
  );
}

/** The KOTA GRESIK sign: two tall nested arches and the letters beside them. */
function TuguKotaGresik({ x }: { x: number }) {
  // an arch drawn as a thick outlined tube
  const arch = (left: number, right: number, top: number) => {
    const mid = (left + right) / 2;
    const d = `M${left} 181 V${top + 18} Q${left} ${top} ${mid} ${top} Q${right} ${top} ${right} ${top + 18} V181`;
    return (
      <g key={`${left}-${top}`}>
        <path d={d} stroke={INK} strokeWidth="9.5" fill="none" strokeLinecap="round" />
        <path d={d} stroke="#f3dcb0" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g>
      <rect x={x} y="181" width="114" height="11" rx="2" fill="#dfe3ef" {...S} />
      <line x1={x + 20} y1="62" x2={x + 20} y2="50" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      {arch(x + 6, x + 34, 62)}
      {arch(x + 12, x + 27, 116)}
      <text
        x={x + 76}
        y="177"
        textAnchor="middle"
        fontFamily="Bricolage Grotesque Variable, sans-serif"
        fontWeight="800"
        fontSize="10.5"
        letterSpacing="1"
        fill="#fff"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        KOTA GRESIK
      </text>
    </g>
  );
}

/** One of the twin stepped stone towers of the gate on Jl. Raya Gresik. */
function GapuraTower({ cx }: { cx: number }) {
  // like a candi: each tier shorter and narrower than the one below
  const sizes = [
    { h: 22, w: 30 },
    { h: 18, w: 27 },
    { h: 16, w: 24 },
    { h: 14, w: 21 },
    { h: 12, w: 18 },
    { h: 10, w: 15 },
    { h: 8, w: 12 },
  ];
  let y = 174;
  const tiers = sizes.map((t) => ({ ...t, y: (y -= t.h) }));
  const top = y;
  return (
    <g>
      <rect x={cx - 20} y="174" width="40" height="18" rx="2" fill="#9aa3b5" {...S} />
      {tiers.map((t, k) => (
        <g key={k}>
          <rect x={cx - t.w / 2} y={t.y} width={t.w} height={t.h} fill="#b8bfcc" {...S} strokeWidth="2" />
          <rect x={cx - t.w / 2 - 4} y={t.y - 2} width={t.w + 8} height="4" rx="1" fill="#8a93a6" {...S} strokeWidth="1.5" />
        </g>
      ))}
      <rect x={cx - 4} y={top - 9} width="8" height="9" fill="#b8bfcc" {...S} strokeWidth="2" />
      <rect x={cx - 7} y={tiers[1].y + 4} width="14" height="10" rx="1" fill="#fff" {...S} strokeWidth="1.5" />
      {[tiers[2].y, tiers[4].y].map((ty, i) => (
        <circle key={ty} cx={cx + (i ? -9 : 11)} cy={ty - 4} r="3.2" fill="#38c172" {...S} strokeWidth="1.5" />
      ))}
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

// Beyond the main scene: the Java Sea with fishing boats on the left,
// more of the city on the right. Only visible when the strip is wider than WIDTH:200.
const BOATS = [
  { x: -140, sail: "#ff4fa3" },
  { x: -470, sail: "#ffc93c" },
  { x: -820, sail: "#1fbf9a" },
  { x: -1180, sail: "#9b7bff" },
];

const CITY = [
  { x: 1664, w: 64, h: 66, fill: "#dfe7ff" },
  { x: 1738, w: 48, h: 104, fill: "#6cc4ff" },
  { x: 1798, w: 78, h: 58, fill: "#fff2c4" },
  { x: 1928, w: 58, h: 122, fill: "#2f5bea" },
  { x: 1998, w: 86, h: 76, fill: "#ffe1ef" },
  { x: 2146, w: 68, h: 108, fill: "#d3f7eb" },
  { x: 2226, w: 58, h: 66, fill: "#ece6ff" },
  { x: 2334, w: 80, h: 132, fill: "#dfe7ff" },
  { x: 2426, w: 60, h: 86, fill: "#ffe4d1" },
  { x: 2542, w: 70, h: 112, fill: "#6cc4ff" },
  { x: 2624, w: 84, h: 62, fill: "#fff2c4" },
  { x: 2772, w: 60, h: 124, fill: "#2f5bea" },
  { x: 2844, w: 76, h: 80, fill: "#d3f7eb" },
  { x: 2992, w: 66, h: 100, fill: "#ffe1ef" },
  { x: 3070, w: 80, h: 70, fill: "#dfe7ff" },
];

function Boat({ x, sail }: { x: number; sail: string }) {
  const y = 176;
  return (
    <g>
      <path d={`M${x - 34} ${y} H${x + 34} L${x + 24} ${y + 12} H${x - 24} Z`} fill="#ff8a3d" {...S} />
      <line x1={x} y1={y} x2={x} y2={y - 46} stroke={INK} strokeWidth="2.5" />
      <path d={`M${x + 2} ${y - 44} L${x + 30} ${y - 6} H${x + 2} Z`} fill={sail} {...S} />
      <path d={`M${x - 2} ${y - 34} L${x - 22} ${y - 6} H${x - 2} Z`} fill="#fff" {...S} />
    </g>
  );
}

function Building({ x, w, h, fill }: (typeof CITY)[number]) {
  const top = BASE - h;
  const dark = fill === "#2f5bea" || fill === "#6cc4ff";
  const cols = Math.max(2, Math.floor((w - 12) / 18));
  const rows = Math.max(2, Math.floor((h - 18) / 20));
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx="4" fill={fill} {...S} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + 8 + c * ((w - 16) / cols)}
            y={top + 10 + r * 20}
            width={(w - 16) / cols - 6}
            height="10"
            rx="2"
            fill={(r + c) % 3 === 0 ? "#ffc93c" : dark ? "#dfe7ff" : "#ffffff"}
          />
        )),
      )}
    </g>
  );
}

/**
 * Cartoon Gresik from the harbour to the ITS campus: cranes and a container
 * ship, the cement plant, the blade monument, Masjid Jami', then the kampung
 * with the stone elephant, Tugu Wilmar and the KOTA GRESIK sign between its
 * houses, and the twin gate towers on the way out to ITS.
 */
export default function Townscape({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  // Never crop the top of the scene: on strips wider than the drawing, scale to the
  // height and let the extra sea/city fill the sides; on narrow ones, crop the sides.
  const [fit, setFit] = useState<"meet" | "slice">("slice");
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setFit(height > 0 && width / height > WIDTH / 200 ? "meet" : "slice");
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${WIDTH} 200`}
      preserveAspectRatio={`xMidYMax ${fit}`}
      className={cn("pointer-events-none block w-full", className)}
      aria-hidden="true"
    >
      {/* hills */}
      <path d="M-1700 200 Q -1300 110 -900 150 T -100 130 T 40 150 V 200 Z" fill="#bfeeb8" />
      <path d="M1400 200 Q 1800 100 2200 150 T 3000 120 T 3200 140 V 200 Z" fill="#bfeeb8" />
      <path d="M-20 200 Q 220 70 520 150 T 1000 130 T 1460 120 V 200 Z" fill="#bfeeb8" />
      <path d="M-20 200 Q 300 120 640 170 T 1460 150 V 200 Z" fill="#9be38f" />
      <path d="M1400 200 Q 1900 140 2400 170 T 3200 160 V 200 Z" fill="#9be38f" />

      {/* sea with fishing boats (left of the harbour) */}
      <rect x="-1700" y="166" width="1740" height="26" fill="#6cc4ff" {...S} />
      <path
        d={`M-1690 178 ${Array.from({ length: 58 }, () => "q 7.5 -6 15 0 q 7.5 6 15 0").join(" ")}`}
        stroke="#fff"
        strokeWidth="2.5"
        fill="none"
        opacity="0.8"
      />
      {BOATS.map((b) => (
        <Boat key={b.x} {...b} />
      ))}

      {/* more of the city (right of the campus) */}
      <Tree x={1906} r={18} />
      <Palm x={2118} />
      <Tree x={2316} r={16} color="#2bb673" />
      <Tree x={2518} r={20} />
      <Palm x={2742} />
      <Tree x={2968} r={18} color="#2bb673" />
      {CITY.map((b) => (
        <Building key={b.x} {...b} />
      ))}

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

      <TuguBilah cx={558} />

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

      {/* the kampung, with Gresik's landmarks in between */}
      <House {...HOUSES[0]} />
      <PatungGajah x={900} />
      <House {...HOUSES[1]} />
      <TuguWilmar cx={1058} />
      <Tree x={1104} r={16} color="#2bb673" />
      <House {...HOUSES[2]} />
      <TuguKotaGresik x={1192} />
      <Tree x={1322} r={13} />
      {/* the twin gate towers: leaving Gresik on the way to ITS */}
      <GapuraTower cx={1364} />
      <GapuraTower cx={1426} />

      {/* ITS campus at the end of the road */}
      <rect x="1462" y="70" width="120" height="122" rx="6" fill="#2f5bea" {...S} />
      <rect x="1492" y="36" width="60" height="34" rx="4" fill="#1d3fb5" {...S} />
      <text x="1522" y="60" textAnchor="middle" fontFamily="Bricolage Grotesque Variable, sans-serif" fontWeight="800" fontSize="20" fill="#ffc93c">
        ITS
      </text>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect key={`${row}-${col}`} x={1474 + col * 26} y={84 + row * 22} width="16" height="12" rx="2" fill={(row + col) % 3 ? "#dfe7ff" : "#ffc93c"} />
        )),
      )}
      <Palm x={1612} />

      {/* ground */}
      <rect x="-1700" y={BASE} width="4900" height="20" fill="#7fd47a" {...S} />
    </svg>
  );
}
