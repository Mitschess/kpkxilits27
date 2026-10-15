import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import LanternArt, { type ArtVariant } from "./LanternArt";

export const SCENE_SETS: ArtVariant[][] = [
  ["kampung", "pelabuhan", "kampus", "masjid"],
  ["pelabuhan", "masjid", "kampung", "kampus"],
  ["kampus", "kampung", "masjid", "pelabuhan"],
  ["masjid", "kampus", "pelabuhan", "kampung"],
];

interface LanternProps {
  /** Width of a face in px; height follows the classic 5:7 Damar Kurung ratio. */
  size?: number;
  /** Art for the four faces (front, right, back, left). */
  faces?: ArtVariant[];
  /** Slowly turn on its own. Off when the rotation is driven from outside via `cubeRef`. */
  spin?: boolean;
  /** Seconds per full turn when spinning */
  spinDuration?: number;
  lit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Damar Kurung — Gresik's box-shaped paper lantern — as a real 3D CSS box
 * with painted panels, a hanging cord and a tassel. The ref points at the
 * rotating cube so callers can drive it (e.g. with GSAP on scroll).
 */
const Lantern = forwardRef<HTMLDivElement, LanternProps>(function Lantern(
  { size = 120, faces = SCENE_SETS[0], spin = true, spinDuration = 22, lit = true, className, style },
  cubeRef,
) {
  const w = size;
  const h = Math.round(size * 1.4);

  return (
    <div
      className={cn("lantern isolate", !lit && "unlit", className)}
      style={{ "--w": `${w}px`, "--h": `${h}px`, ...style } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* light spilling around the lantern */}
      {lit && (
        <div
          className="pointer-events-none absolute -inset-[80%] -z-10 animate-flicker rounded-full"
          style={{ background: "radial-gradient(circle, rgb(255 178 63 / 0.38) 0%, rgb(255 140 40 / 0.12) 38%, transparent 66%)" }}
        />
      )}

      {/* cord */}
      <div className="absolute bottom-full left-1/2 h-[60vh] w-px -translate-x-1/2 bg-gradient-to-t from-[#5a2c14] to-transparent" />
      {/* roof */}
      <div
        className="absolute left-1/2 z-10 -translate-x-1/2 bg-wood"
        style={{ width: w * 0.62, height: h * 0.07, top: -h * 0.09, clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }}
      />

      <div
        ref={cubeRef}
        className={cn("lantern-cube", spin && "animate-spin-y")}
        style={spin ? { animationDuration: `${spinDuration}s` } : undefined}
      >
        {faces.map((variant, i) => (
          <div key={i} className="lantern-face">
            <LanternArt variant={variant} />
          </div>
        ))}
        <div className="lantern-cap top" />
        <div className="lantern-cap bottom" />
      </div>

      {/* tassel */}
      <div className="absolute top-full left-1/2 flex -translate-x-1/2 flex-col items-center" style={{ marginTop: h * 0.06 }}>
        <div className="h-3 w-px bg-wood" />
        <div className="h-2 w-2 rounded-full bg-orange" />
        <div
          className="bg-gradient-to-b from-orange to-pink"
          style={{ width: w * 0.16, height: h * 0.2, clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }}
        />
      </div>
    </div>
  );
});

export default Lantern;
