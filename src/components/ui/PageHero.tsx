import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
import Bunting from "@/components/deco/Bunting";
import Clouds from "@/components/deco/Clouds";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  emoji?: string;
  eyebrow: string;
  /** Wrap a word in <em> for the highlighter */
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** Shared sunny header for the sub-pages. */
export default function PageHero({ emoji, eyebrow, title, description, children, className }: PageHeroProps) {
  return (
    <header className={cn("relative isolate overflow-hidden bg-gradient-to-b from-[#bfe6ff] via-[#e6f5ff] to-cream pt-28 pb-16 md:pt-32 md:pb-24", className)}>
      <Clouds className="-z-10" count={3} />
      <Bunting className="absolute inset-x-0 top-[72px] -z-10 opacity-90 md:top-[78px]" flags={22} sag={30} />

      <div className="pointer-events-none absolute top-0 right-[7%] hidden lg:block" aria-hidden="true">
        <div className="mt-36 animate-bob">
          <Lantern size={86} faces={SCENE_SETS[1]} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 right-[22%] hidden lg:block" aria-hidden="true">
        <div className="mt-28 animate-bob" style={{ animationDelay: "-2s" }}>
          <Lantern size={54} faces={SCENE_SETS[2]} spinDuration={16} />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-10">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-ink ring-2 ring-ink/10 transition hover:bg-white"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> Kembali ke beranda
        </Link>
        <p data-reveal className="mt-8 flex w-fit items-center gap-2 rounded-full bg-sun px-3.5 py-1.5 text-ink shadow-[0_3px_0_#e5a500]">
          {emoji && <span aria-hidden="true">{emoji}</span>}
          <span className="eyebrow text-[0.7rem]">{eyebrow}</span>
        </p>
        <h1
          data-reveal
          className="mt-5 max-w-4xl font-display text-5xl leading-[0.98] font-extrabold tracking-tight text-balance text-ink md:text-7xl [&_em]:marker [&_em]:not-italic"
        >
          {title}
        </h1>
        {description && (
          <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-soft">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
