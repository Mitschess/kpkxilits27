/**
 * Folk-art panels for the Damar Kurung lantern faces, in the spirit of
 * Gresik's lantern painters: flat silhouettes stacked in horizontal registers,
 * framed by tumpal (triangle) borders. Every panel is drawn on a 100×140 grid.
 */

const INK = "#3b1a10";
const RED = "#b3261e";
const TEAL = "#0f8f78";
const BLUE = "#1f45b5";
const MAGENTA = "#c2185b";
const GOLD = "#ffd76a";
const PAPER = "#ffe6b0";

export type ArtVariant =
  | "kampung"
  | "pelabuhan"
  | "kampus"
  | "masjid"
  | "eksplorasi"
  | "masa-depan"
  | "solidaritas"
  | "kebudayaan";

/* ---------- primitives (x, y = bottom-center) ---------- */

function Tumpal({ y, up = false }: { y: number; up?: boolean }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <rect width="100" height="12" fill={RED} />
      {Array.from({ length: 8 }, (_, i) => {
        const x = i * 12.5;
        const pts = up ? `${x},12 ${x + 12.5},12 ${x + 6.25},2.5` : `${x},0 ${x + 12.5},0 ${x + 6.25},9.5`;
        return <polygon key={i} points={pts} fill={GOLD} />;
      })}
    </g>
  );
}

function Divider({ y }: { y: number }) {
  return (
    <g>
      <rect x="6" y={y - 0.6} width="88" height="1.2" fill={INK} opacity="0.7" />
      {[20, 50, 80].map((x) => (
        <circle key={x} cx={x} cy={y} r="1.6" fill={INK} />
      ))}
    </g>
  );
}

function House({ x, y, door = GOLD }: { x: number; y: number; door?: string }) {
  return (
    <g>
      <polygon points={`${x - 13},${y - 12} ${x},${y - 23} ${x + 13},${y - 12}`} fill={INK} />
      <rect x={x - 10} y={y - 12} width="20" height="12" fill={INK} />
      <rect x={x - 2.5} y={y - 8} width="5" height="8" fill={door} />
      <rect x={x - 8} y={y - 9} width="3.5" height="3.5" fill={GOLD} />
    </g>
  );
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} Q${x - 3} ${y - 14} ${x + 1} ${y - 26}`} stroke={INK} strokeWidth="2.4" fill="none" />
      {[-60, -25, 10, 45, 80].map((r) => (
        <ellipse key={r} cx={x + 1} cy={y - 26} rx="9" ry="2.4" fill={TEAL} transform={`rotate(${r} ${x + 1} ${y - 26}) translate(6 0)`} />
      ))}
    </g>
  );
}

function Person({ x, y, color = INK, arms = false }: { x: number; y: number; color?: string; arms?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y - 17} r="3.2" fill={INK} />
      <polygon points={`${x - 5},${y} ${x + 5},${y} ${x + 3},${y - 13} ${x - 3},${y - 13}`} fill={color} />
      {arms && <rect x={x - 8} y={y - 11} width="16" height="1.8" fill={INK} />}
    </g>
  );
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <polygon points={`${x - 20},${y - 7} ${x + 20},${y - 7} ${x + 14},${y} ${x - 14},${y}`} fill={INK} />
      <rect x={x - 0.8} y={y - 32} width="1.6" height="25" fill={INK} />
      <polygon points={`${x + 1},${y - 31} ${x + 15},${y - 10} ${x + 1},${y - 10}`} fill={MAGENTA} />
      <polygon points={`${x - 1},${y - 26} ${x - 12},${y - 10} ${x - 1},${y - 10}`} fill={BLUE} />
    </g>
  );
}

function Waves({ y, color = TEAL }: { y: number; color?: string }) {
  const d = Array.from({ length: 6 }, () => "q 4.2 -4 8.4 0 q 4.2 4 8.4 0").join(" ");
  return <path d={`M -1 ${y} ${d}`} stroke={color} strokeWidth="2" fill="none" />;
}

function Fish({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="7" ry="3.4" fill={BLUE} />
      <polygon points={`${x + 6},${y} ${x + 11},${y - 3.5} ${x + 11},${y + 3.5}`} fill={BLUE} />
      <circle cx={x - 4} cy={y - 0.6} r="0.9" fill={PAPER} />
    </g>
  );
}

function Bird({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 5} ${y} q 2.5 -3.5 5 0 q 2.5 -3.5 5 0`} stroke={INK} strokeWidth="1.6" fill="none" />;
}

function Sun({ x, y, r = 8, half = false }: { x: number; y: number; r?: number; half?: boolean }) {
  const rays = half ? [-160, -130, -100, -80, -50, -20] : [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      {rays.map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={x + Math.cos(rad) * (r + 2.5)}
            y1={y + Math.sin(rad) * (r + 2.5)}
            x2={x + Math.cos(rad) * (r + 7)}
            y2={y + Math.sin(rad) * (r + 7)}
            stroke={RED}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      {half ? (
        <path d={`M${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`} fill={RED} />
      ) : (
        <circle cx={x} cy={y} r={r} fill={RED} />
      )}
    </g>
  );
}

function Moon({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 9} a 9 9 0 1 0 8 13 a 7 7 0 1 1 -8 -13 z`} fill={INK} />;
}

function Star({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <polygon
      points={`${x},${y - 4 * s} ${x + 1.2 * s},${y - 1.2 * s} ${x + 4 * s},${y} ${x + 1.2 * s},${y + 1.2 * s} ${x},${y + 4 * s} ${x - 1.2 * s},${y + 1.2 * s} ${x - 4 * s},${y} ${x - 1.2 * s},${y - 1.2 * s}`}
      fill={INK}
    />
  );
}

function Mosque({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 20} y={y - 15} width="40" height="15" fill={INK} />
      <path d={`M${x - 12} ${y - 15} Q ${x - 12} ${y - 33} ${x} ${y - 35} Q ${x + 12} ${y - 33} ${x + 12} ${y - 15} Z`} fill={TEAL} />
      <rect x={x - 0.7} y={y - 41} width="1.4" height="7" fill={INK} />
      <circle cx={x} cy={y - 42} r="1.6" fill={GOLD} />
      <path d={`M${x - 4} ${y} v -6 a 4 4 0 0 1 8 0 v 6 z`} fill={GOLD} />
      <rect x={x + 23} y={y - 40} width="6" height="40" fill={INK} />
      <polygon points={`${x + 22},${y - 40} ${x + 26},${y - 48} ${x + 30},${y - 40}`} fill={TEAL} />
      <rect x={x + 22} y={y - 28} width="8" height="2" fill={GOLD} />
    </g>
  );
}

function Gear({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  const teeth = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return (
      <rect
        key={i}
        x={x - 2.4}
        y={y - r - 4}
        width="4.8"
        height="6"
        fill={BLUE}
        transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
      />
    );
  });
  return (
    <g>
      {teeth}
      <circle cx={x} cy={y} r={r} fill={BLUE} />
      <circle cx={x} cy={y} r={r * 0.42} fill={PAPER} />
    </g>
  );
}

function Book({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} Q ${x - 9} ${y - 4} ${x - 18} ${y - 1} L ${x - 18} ${y - 19} Q ${x - 9} ${y - 22} ${x} ${y - 18} Z`} fill={INK} />
      <path d={`M${x} ${y} Q ${x + 9} ${y - 4} ${x + 18} ${y - 1} L ${x + 18} ${y - 19} Q ${x + 9} ${y - 22} ${x} ${y - 18} Z`} fill={MAGENTA} />
      {[-13, -9, -5].map((d) => (
        <line key={d} x1={x - 15} y1={y + d} x2={x - 4} y2={y + d - 1} stroke={PAPER} strokeWidth="0.9" />
      ))}
    </g>
  );
}

function Campus({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <polygon points={`${x - 24},${y - 22} ${x},${y - 32} ${x + 24},${y - 22}`} fill={BLUE} />
      <rect x={x - 22} y={y - 22} width="44" height="22" fill={INK} />
      {[-16, -8, 0, 8, 16].map((d) => (
        <rect key={d} x={x + d - 1.6} y={y - 19} width="3.2" height="16" fill={GOLD} opacity="0.9" />
      ))}
      <rect x={x - 0.6} y={y - 44} width="1.2" height="12" fill={INK} />
      <polygon points={`${x + 0.6},${y - 44} ${x + 9},${y - 41} ${x + 0.6},${y - 38}`} fill={RED} />
    </g>
  );
}

function Compass({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth="2.2" />
      <circle cx={x} cy={y} r={r - 4} fill="none" stroke={INK} strokeWidth="0.8" strokeDasharray="1.5 2" />
      <polygon points={`${x},${y - r + 2} ${x + 4},${y} ${x},${y + r - 2} ${x - 4},${y}`} fill={INK} />
      <polygon points={`${x},${y - r + 2} ${x + 4},${y} ${x - 4},${y}`} fill={RED} />
      <polygon points={`${x - r + 2},${y} ${x},${y - 3} ${x + r - 2},${y} ${x},${y + 3}`} fill={TEAL} opacity="0.85" />
      <circle cx={x} cy={y} r="2" fill={GOLD} stroke={INK} strokeWidth="0.8" />
    </g>
  );
}

function Cross({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={RED} strokeWidth="2.4" strokeLinecap="round">
      <line x1={x - 3.5} y1={y - 3.5} x2={x + 3.5} y2={y + 3.5} />
      <line x1={x + 3.5} y1={y - 3.5} x2={x - 3.5} y2={y + 3.5} />
    </g>
  );
}

function Mountain({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <polygon points={`${x - 18},${y} ${x},${y - 24} ${x + 18},${y}`} fill={TEAL} />
      <polygon points={`${x - 5.5},${y - 16.5} ${x},${y - 24} ${x + 5.5},${y - 16.5} ${x + 2},${y - 14} ${x - 2},${y - 17}`} fill={PAPER} />
    </g>
  );
}

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse key={r} cx={x} cy={y - 5} rx="2.6" ry="5" fill={MAGENTA} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r="2.6" fill={GOLD} stroke={INK} strokeWidth="0.8" />
    </g>
  );
}

function Label({ text }: { text: string }) {
  return (
    <g>
      <rect x="9" y="62" width="82" height="16" rx="3" fill={PAPER} stroke={INK} strokeWidth="1.6" />
      <text
        x="50"
        y="73.2"
        textAnchor="middle"
        fontFamily="Bricolage Grotesque Variable, sans-serif"
        fontWeight="800"
        fontSize="8.4"
        letterSpacing="0.6"
        fill={INK}
      >
        {text}
      </text>
    </g>
  );
}

/* ---------- scenes ---------- */

const SCENES: Record<ArtVariant, React.ReactNode> = {
  kampung: (
    <>
      <Sun x={24} y={38} r={7} />
      <Bird x={56} y={30} />
      <Bird x={68} y={38} />
      <Palm x={84} y={66} />
      <Divider y={70} />
      <House x={22} y={124} />
      <House x={50} y={124} door={TEAL} />
      <Person x={73} y={124} color={MAGENTA} />
      <Person x={87} y={124} color={TEAL} />
    </>
  ),
  pelabuhan: (
    <>
      <Moon x={26} y={40} />
      <Star x={58} y={28} />
      <Star x={78} y={44} s={0.8} />
      <Bird x={50} y={52} />
      <Divider y={70} />
      <Boat x={48} y={112} />
      <Waves y={115} />
      <Fish x={22} y={124} />
      <Fish x={74} y={123} />
    </>
  ),
  kampus: (
    <>
      <Gear x={30} y={42} />
      <Book x={70} y={52} />
      <Star x={52} y={24} s={0.8} />
      <Divider y={70} />
      <Campus x={50} y={124} />
      <Person x={13} y={124} color={BLUE} />
      <Person x={87} y={124} color={MAGENTA} />
    </>
  ),
  masjid: (
    <>
      <Moon x={74} y={40} />
      <Star x={28} y={30} />
      <Star x={44} y={46} s={0.8} />
      <Star x={16} y={52} s={0.7} />
      <Divider y={70} />
      <Mosque x={40} y={124} />
      <Palm x={88} y={124} />
    </>
  ),
  eksplorasi: (
    <>
      <Compass x={50} y={38} />
      <Label text="EKSPLORASI" />
      <path d="M12 122 C 26 100, 40 128, 54 108 S 80 98, 88 112" stroke={INK} strokeWidth="1.6" strokeDasharray="3 2.5" fill="none" />
      <Cross x={88} y={112} />
      <Cross x={12} y={122} />
      <Mountain x={30} y={104} />
    </>
  ),
  "masa-depan": (
    <>
      <Sun x={50} y={56} r={11} half />
      <Bird x={22} y={28} />
      <Bird x={78} y={24} />
      <Label text="MASA DEPAN" />
      <polygon points="38,126 62,126 53,86 47,86" fill={INK} />
      <line x1="50" y1="122" x2="50" y2="90" stroke={GOLD} strokeWidth="1.4" strokeDasharray="4 3" />
      <Person x={24} y={124} color={TEAL} />
      <Person x={78} y={124} color={MAGENTA} />
    </>
  ),
  solidaritas: (
    <>
      <Bird x={34} y={30} />
      <Bird x={50} y={22} />
      <Bird x={66} y={30} />
      <Flower x={20} y={48} />
      <Flower x={80} y={48} />
      <Label text="SOLIDARITAS" />
      <rect x="12" y="111" width="76" height="2" fill={INK} />
      <Person x={18} y={124} color={MAGENTA} arms />
      <Person x={38} y={124} color={TEAL} arms />
      <Person x={60} y={124} color={BLUE} arms />
      <Person x={81} y={124} color={RED} arms />
    </>
  ),
  kebudayaan: (
    <>
      <Flower x={22} y={36} />
      <Flower x={50} y={28} />
      <Flower x={78} y={36} />
      <Label text="KEBUDAYAAN" />
      <Mosque x={36} y={124} />
      <House x={82} y={124} door={MAGENTA} />
    </>
  ),
};

export default function LanternArt({ variant }: { variant: ArtVariant }) {
  return (
    <svg viewBox="0 0 100 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <Tumpal y={0} />
      <Tumpal y={128} up />
      {SCENES[variant]}
    </svg>
  );
}
