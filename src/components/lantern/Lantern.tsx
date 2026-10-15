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
  /** Length of the hanging cord (px or any CSS length); by default it runs up off-screen. */
  cord?: number | string;
  lit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Damar Kurung — Gresik's box-shaped paper lantern — as a real 3D CSS box:
 * four painted panels in a wooden frame, open at the top with a cross brace
 * where the cord is tied. The ref points at the rotating cube so callers can
 * drive it (e.g. with GSAP on scroll).
 */
const Lantern = forwardRef<HTMLDivElement, LanternProps>(function Lantern(
  { size = 120, faces = SCENE_SETS[0], spin = true, spinDuration = 22, cord, lit = true, className, style },
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

      {/* The tilt lives on its own wrapper so the cube only ever turns around its
          vertical axis — otherwise the tilt axis spins with it and the box wobbles. */}
      <div className="lantern-tilt">
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
      </div>

      {/* Cord, drawn over the box so it meets the cross brace at the centre of the
          open top (which, seen from slightly above, sits on the box's top edge). */}
      <div
        className={cn(
          "absolute bottom-full left-1/2 z-20 w-[2px] -translate-x-1/2",
          cord ? "bg-wood" : "h-[60vh] bg-gradient-to-t from-wood to-transparent",
        )}
        style={cord ? { height: cord } : undefined}
      />
    </div>
  );
});

export default Lantern;
