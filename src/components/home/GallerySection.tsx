import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Expand } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { GALLERY } from "@/data/home";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";

// bento layout: first photo is the big one
const SPANS = ["col-span-2 row-span-2", "", "", "", ""];

export default function GallerySection() {
  const [index, setIndex] = useState(-1);
  useScrollLock(index >= 0);

  return (
    <section id="galeri" className="relative bg-night-950 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          stop="07"
          label="Galeri"
          title={<>Kenangan dari <em>tahun lalu</em>.</>}
          description="Intip keseruan KPK sebelumnya. Klik foto untuk memperbesar."
        />

        <div className="mt-14 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
          {GALLERY.map((p, i) => (
            <button
              key={p.src}
              type="button"
              data-reveal
              onClick={() => setIndex(i)}
              className={cn(
                "group relative overflow-hidden rounded-[1.5rem] ring-1 ring-paper/10 transition duration-500 hover:ring-lantern/60 hover:shadow-[0_0_60px_-12px_rgb(255_178_63/0.5)]",
                SPANS[i],
              )}
            >
              <img
                src={p.src}
                alt={p.caption}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out-expo group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-night-950/85 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
              <span className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-2 text-left">
                <span className="font-serif text-xl text-paper italic md:text-2xl">{p.caption}</span>
                <span className="grid h-9 w-9 shrink-0 translate-y-2 place-items-center rounded-full bg-paper/15 text-paper opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
                  <Expand size={15} />
                </span>
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
        styles={{ container: { backgroundColor: "rgb(5 9 32 / 0.96)" } }}
      />
    </section>
  );
}
