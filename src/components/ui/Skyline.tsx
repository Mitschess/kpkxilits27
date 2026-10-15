import { cn } from "@/lib/utils";

/**
 * Silhouette of Gresik at night: harbour cranes and a ship, the cement & fertilizer
 * plants, Masjid Jami' with its minaret, kampung roofs and coconut palms.
 * Lit windows flicker softly.
 */
export default function Skyline({ className }: { className?: string }) {
  const windows: [number, number][] = [
    [338, 168], [352, 168], [338, 184], [366, 184], [418, 176], [432, 176], [446, 190],
    [700, 186], [716, 186], [756, 186], [772, 186], [902, 196], [956, 192], [1012, 198],
    [1066, 194], [1124, 200], [1182, 196], [1286, 202], [1340, 198], [96, 178], [118, 178],
  ];

  return (
    <svg
      viewBox="0 0 1440 260"
      preserveAspectRatio="xMidYMax slice"
      className={cn("pointer-events-none block w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyline-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2866" />
          <stop offset="1" stopColor="#0d1540" />
        </linearGradient>
      </defs>

      {/* distant layer */}
      <path
        fill="url(#skyline-back)"
        d="M0 200 L60 196 L60 150 L90 150 L90 178 L160 178 L160 160 L230 160 L230 186 L300 186 L300 140 L330 140 L330 170 L420 170 L420 128 L452 128 L452 176 L540 176 L560 150 L600 150 L620 176 L700 176 L700 158 L780 158 L780 180 L860 180 L880 160 L940 160 L960 182 L1040 182 L1040 152 L1090 152 L1090 184 L1180 184 L1200 162 L1260 162 L1280 186 L1360 186 L1360 160 L1440 160 L1440 260 L0 260 Z"
      />

      <g fill="#050920">
        {/* harbour: cranes */}
        <rect x="40" y="96" width="8" height="120" />
        <polygon points="20,96 150,96 150,104 20,104" />
        <line x1="44" y1="70" x2="150" y2="98" stroke="#050920" strokeWidth="3" />
        <rect x="40" y="66" width="8" height="32" />
        <line x1="128" y1="104" x2="128" y2="150" stroke="#050920" strokeWidth="2" />
        <rect x="168" y="120" width="7" height="96" />
        <polygon points="150,120 240,120 240,127 150,127" />
        <line x1="171" y1="100" x2="240" y2="122" stroke="#050920" strokeWidth="2.5" />
        <rect x="168" y="98" width="7" height="24" />
        {/* ship */}
        <polygon points="60,196 250,196 236,222 76,222" />
        <rect x="84" y="170" width="44" height="26" />
        <rect x="132" y="178" width="34" height="18" />
        <rect x="170" y="182" width="30" height="14" />
        <rect x="96" y="156" width="20" height="14" />

        {/* plants: chimneys and silos */}
        <rect x="300" y="150" width="90" height="70" />
        <rect x="318" y="70" width="12" height="82" />
        <rect x="350" y="92" width="10" height="60" />
        <rect x="400" y="160" width="70" height="60" />
        <ellipse cx="420" cy="160" rx="12" ry="4" />
        <rect x="408" y="118" width="24" height="44" />
        <ellipse cx="420" cy="118" rx="12" ry="5" />
        <rect x="440" y="130" width="22" height="34" />
        <ellipse cx="451" cy="130" rx="11" ry="4" />
        <path d="M470 220 L470 186 L530 168 L530 220 Z" />

        {/* masjid */}
        <rect x="660" y="170" width="160" height="50" />
        <path d="M690 170 Q690 112 740 106 Q790 112 790 170 Z" />
        <rect x="738" y="88" width="4" height="20" />
        <circle cx="740" cy="86" r="4" />
        <path d="M664 170 Q664 146 680 144 Q696 146 696 170 Z" />
        <path d="M784 170 Q784 146 800 144 Q816 146 816 170 Z" />
        <rect x="838" y="78" width="16" height="142" />
        <polygon points="834,78 846,52 858,78" />
        <rect x="832" y="118" width="28" height="6" />
        <rect x="620" y="186" width="40" height="34" />

        {/* kampung roofs */}
        <polygon points="880,220 880,196 905,178 930,196 930,220" />
        <polygon points="934,220 934,190 962,168 990,190 990,220" />
        <polygon points="994,220 994,200 1016,184 1038,200 1038,220" />
        <polygon points="1044,220 1044,192 1056,192 1070,174 1084,192 1096,192 1096,220" />
        <polygon points="1100,220 1100,198 1128,180 1156,198 1156,220" />
        <polygon points="1160,220 1160,194 1188,174 1216,194 1216,220" />
        <polygon points="1264,220 1264,200 1292,182 1320,200 1320,220" />
        <polygon points="1322,220 1322,196 1346,180 1370,196 1370,220" />

        {/* palms */}
        <path d="M1232 220 Q1226 170 1240 128" stroke="#050920" strokeWidth="6" fill="none" />
        <path d="M1240 128 q-30 -4 -44 14 q22 -16 44 -10 q-18 -22 -40 -20 q30 0 42 18 q4 -24 26 -34 q-16 18 -20 32 q26 -10 44 4 q-28 -6 -46 6 z" />
        <path d="M1400 220 Q1406 180 1394 146" stroke="#050920" strokeWidth="5" fill="none" />
        <path d="M1394 146 q26 -6 40 8 q-20 -10 -40 -4 q12 -20 32 -22 q-24 4 -34 18 q-6 -20 -26 -26 q16 14 20 28 q-24 -6 -38 6 q24 -4 40 4 z" />

        <rect x="0" y="216" width="1440" height="44" />
      </g>

      {/* smoke */}
      <g fill="#aab4dd" opacity="0.08">
        <circle cx="326" cy="56" r="12" />
        <circle cx="340" cy="40" r="16" />
        <circle cx="362" cy="22" r="20" />
      </g>

      {/* lit windows */}
      <g fill="#ffb23f">
        {windows.map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="6"
            height="8"
            rx="1"
            className={i % 4 === 0 ? "animate-flicker" : undefined}
            style={i % 4 === 0 ? { animationDelay: `${i * 0.37}s` } : undefined}
          />
        ))}
        <circle cx="740" cy="86" r="2" fill="#ffd76a" />
      </g>
    </svg>
  );
}
