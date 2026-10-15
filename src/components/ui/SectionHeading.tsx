import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Stop number on the route, e.g. "02" */
  stop?: string;
  label: string;
  /** Wrap a word in <em> to set it in the glowing serif */
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Route-stop eyebrow + big display title used by every section. */
export default function SectionHeading({ stop, label, title, description, align = "left", className }: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <div data-reveal className={cn("mb-5 flex items-center gap-3 text-lantern", center && "justify-center")}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-lantern/60" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-lantern shadow-[0_0_12px_2px_rgb(255_178_63/0.7)]" />
        </span>
        {stop && <span className="eyebrow text-lantern/70">Pos {stop}</span>}
        <span className="h-px w-10 bg-lantern/40" />
        <span className="eyebrow">{label}</span>
      </div>
      <h2
        data-reveal
        className="font-display text-4xl leading-[1.02] font-semibold tracking-tight text-balance text-paper md:text-6xl [&_em]:font-serif [&_em]:font-normal [&_em]:text-gold [&_em]:italic [&_em]:text-glow"
      >
        {title}
      </h2>
      {description && (
        <p data-reveal className={cn("mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-mist", center && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
