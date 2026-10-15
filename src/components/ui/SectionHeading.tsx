import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Stop number on the route, e.g. "02" */
  stop?: string;
  label: string;
  /** Emoji shown in the label pill */
  emoji?: string;
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

/** Route-stop pill + big chunky title used by every section. */
export default function SectionHeading({
  stop,
  label,
  emoji,
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
      <div data-reveal className={cn("mb-5 flex", center && "justify-center")}>
        <span className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-ink shadow-[0_3px_0_rgb(27_31_59/0.12)] ring-2 ring-ink/10">
          {stop && <span className="rounded-full bg-ink px-2.5 py-1 text-[0.7rem] font-extrabold text-white">Pos {stop}</span>}
          {emoji && <span aria-hidden="true">{emoji}</span>}
          <span className="eyebrow text-[0.7rem]">{label}</span>
        </span>
      </div>
      <h2
        data-reveal
        style={highlight ? ({ "--hl": highlight } as React.CSSProperties) : undefined}
        className={cn(
          "font-display text-[2.6rem] leading-[1.02] font-extrabold tracking-tight text-balance md:text-6xl [&_em]:marker [&_em]:not-italic",
          inverted ? "text-white [&_em]:text-ink" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          data-reveal
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed text-pretty",
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
