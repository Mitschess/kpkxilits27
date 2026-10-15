import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
import Starfield from "./Starfield";

interface PageHeroProps {
  eyebrow: string;
  /** Wrap a word in <em> for the glowing serif */
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

/** Shared night-sky header for the sub-pages. */
export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <header className="relative isolate overflow-hidden bg-night-950 pt-36 pb-20 md:pt-44 md:pb-28">
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 0%, #1b2866 0%, transparent 60%), linear-gradient(180deg, #050920, #0a1033)",
        }}
      />
      <Starfield className="-z-10" density={0.8} />

      <div className="pointer-events-none absolute top-0 right-[8%] hidden lg:block" aria-hidden="true">
        <div className="mt-28 animate-bob">
          <Lantern size={92} faces={SCENE_SETS[1]} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 right-[24%] hidden lg:block" aria-hidden="true">
        <div className="mt-12 animate-bob" style={{ animationDelay: "-2s" }}>
          <Lantern size={56} faces={SCENE_SETS[2]} spinDuration={16} />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Link to="/" className="group inline-flex items-center gap-2 text-sm text-mist transition hover:text-lantern">
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> Kembali ke beranda
        </Link>
        <p data-reveal className="eyebrow mt-10 text-lantern">
          {eyebrow}
        </p>
        <h1
          data-reveal
          className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] font-semibold tracking-tight text-balance text-paper md:text-7xl [&_em]:font-serif [&_em]:font-normal [&_em]:text-gold [&_em]:italic [&_em]:text-glow"
        >
          {title}
        </h1>
        {description && (
          <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-mist">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
