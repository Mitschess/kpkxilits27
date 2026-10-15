import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label: string;
  /** Icon shown in the label pill */
  icon?: LucideIcon;
  /** Wrap a word in <em> to swipe a highlighter over it */
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** White text for coloured sections */
  inverted?: boolean;
  /** Highlighter colour for <em> */
  highlight?: string;
  className?: string;
}

/** Label pill + big chunky title used by every section. */
export default function SectionHeading({
  label,
  icon: Icon,
  title,
  description,
  align = "left",
  inverted = false,
  highlight,
  className,
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <div data-reveal className={cn("mb-5 flex lg:mb-[clamp(0.75rem,2.2vh,1.25rem)]", center && "justify-center")}>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-ink shadow-[0_3px_0_rgb(27_31_59/0.12)] ring-2 ring-ink/10">
          {Icon && <Icon size={15} strokeWidth={2.5} className="text-its" aria-hidden="true" />}
          <span className="eyebrow text-[0.7rem]">{label}</span>
        </span>
      </div>
      <h2
        data-reveal
        style={highlight ? ({ "--hl": highlight } as React.CSSProperties) : undefined}
        className={cn(
          "font-display text-[2.6rem] leading-[1.02] font-extrabold tracking-tight text-balance md:text-6xl lg:text-[clamp(2.5rem,6.6vh,3.75rem)] [&_em]:marker [&_em]:not-italic",
          inverted ? "text-white [&_em]:text-sun" : "text-ink",
          inverted && !highlight && "[&_em]:[--hl:var(--color-its-dark)]",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          data-reveal
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed text-pretty lg:mt-[clamp(0.75rem,2.2vh,1.25rem)] lg:text-[clamp(1rem,2.5vh,1.125rem)]",
            inverted ? "text-white/85" : "text-ink-soft",
            center && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
