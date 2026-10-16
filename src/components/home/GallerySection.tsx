import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Camera, Expand, Flame, Heart, Music, PartyPopper, Smile, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { GALLERY } from "@/data/home";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";

// bento layout: first photo is the big one
const TILES = [
  { span: "col-span-2 row-span-2", tilt: "md:-rotate-1", icon: PartyPopper },
  { span: "", tilt: "md:rotate-2", icon: Flame },
  { span: "", tilt: "md:-rotate-2", icon: Heart },
  { span: "", tilt: "md:rotate-1", icon: Smile },
  { span: "", tilt: "md:-rotate-1", icon: Music },
];

const CaptionIcon = ({ icon: Icon }: { icon: LucideIcon }) => <Icon size={15} strokeWidth={2.5} aria-hidden="true" />;

export default function GallerySection() {
  const [index, setIndex] = useState(-1);
  useScrollLock(index >= 0);

  return (
    <section id="galeri" className="screen-section relative isolate bg-cream">
      <div className="mx-auto w-full max-w-7xl px-6">
        <SectionHeading
          icon={Camera}
          label="Galeri"
          title={<>Keseruan dari <em>tahun lalu</em>!</>}
          description="Intip keseruan KPK sebelumnya. Klik fotonya buat lihat lebih besar."
        />

        <div className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[230px] md:grid-cols-4 md:gap-6 lg:mt-[clamp(1.5rem,4vh,3rem)] lg:auto-rows-[clamp(140px,25vh,230px)]">
          {GALLERY.map((p, i) => (
            <button
              key={p.src}
              type="button"
              data-reveal
              onClick={() => setIndex(i)}
              className={cn(
                "group relative rounded-[1.75rem] bg-white p-2 shadow-[0_6px_0_rgb(27_31_59/0.1)] ring-2 ring-ink/10 transition duration-300 ease-bounce hover:z-10 hover:scale-[1.03] hover:rotate-0",
                TILES[i].span,
                TILES[i].tilt,
              )}
            >
              <span className="relative block h-full w-full overflow-hidden rounded-[1.35rem]">
                <img
                  src={p.src}
                  alt={p.caption}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out-expo group-hover:scale-110"
                />
                <span className="absolute top-3 right-3 grid h-9 w-9 scale-0 place-items-center rounded-full bg-white text-ink shadow-[0_3px_0_rgb(27_31_59/0.15)] transition duration-300 ease-bounce group-hover:scale-100">
                  <Expand size={15} />
                </span>
              </span>
              <span className="absolute -bottom-3 left-4 inline-flex -rotate-2 items-center gap-1.5 rounded-full bg-sun px-3.5 py-1.5 text-sm font-extrabold text-ink shadow-[0_3px_0_#e5a500]">
                <CaptionIcon icon={TILES[i].icon} /> {p.caption}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={GALLERY.map((p) => ({ src: p.src, alt: p.caption, title: p.caption }))}
        plugins={[Captions]}
        styles={{ container: { backgroundColor: "rgb(27 31 59 / 0.94)" } }}
      />
    </section>
  );
}
