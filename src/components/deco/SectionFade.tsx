import { cn } from "@/lib/utils";

interface SectionFadeProps {
  /** Which edge of the parent section to soften */
  edge: "top" | "bottom";
  /** Colour right at that edge: the neighbouring section's background */
  color: string;
  className?: string;
}

/**
 * A soft gradient along a section's edge so neighbouring sections melt into
 * each other instead of meeting at a hard line. It sits above the section's
 * background (and its dot/ray patterns) but below the content, so the parent
 * needs `relative isolate`.
 */
export default function SectionFade({ edge, color, className }: SectionFadeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 -z-[1] h-[clamp(6rem,14vw,12rem)]",
        edge === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={{ background: `linear-gradient(to ${edge}, transparent, ${color})` }}
    />
  );
}

interface SectionBlendProps {
  from: string;
  to: string;
  /** Optional colour halfway, to steer the blend away from a muddy middle */
  via?: string;
  className?: string;
}

/** A band between two sections that can't fade inside themselves (both are pinned while scrolling). */
export function SectionBlend({ from, via, to, className }: SectionBlendProps) {
  const stops = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`;
  return (
    <div
      aria-hidden="true"
      className={cn("h-[clamp(8rem,24vh,15rem)]", className)}
      style={{ background: `linear-gradient(in oklab to bottom, ${stops})` }}
    />
  );
}
