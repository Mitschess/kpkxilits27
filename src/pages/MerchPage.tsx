import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { buttonClass } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useReveal } from "@/hooks/useReveal";
import { merchandises, type Merch } from "@/data/merch/merch-data";

type Category = "all" | "satuan" | "bundle";

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "satuan", label: "Satuan" },
  { id: "bundle", label: "Bundle" },
];

const TICKET_FRAME = "polygon(4% 0, 96% 0, 97.5% 0.3%, 99% 1%, 99.7% 2%, 100% 3.2%, 100% 54.5%, 99.7% 55.2%, 99% 55.8%, 98% 56.4%, 97.2% 57.2%, 96.7% 58.1%, 96.5% 58.8%, 96.7% 59.7%, 97.2% 60.6%, 98% 61.4%, 99% 62%, 99.7% 62.6%, 100% 63.3%, 100% 96.8%, 99.7% 98%, 99% 99%, 97.5% 99.7%, 96% 100%, 4% 100%, 2.5% 99.7%, 1% 99%, 0.3% 98%, 0 96.8%, 0 63.3%, 0.3% 62.6%, 1% 62%, 2% 61.4%, 2.8% 60.6%, 3.3% 59.7%, 3.5% 58.8%, 3.3% 58.1%, 2.8% 57.2%, 2% 56.4%, 1% 55.8%, 0.3% 55.2%, 0 54.5%, 0 3.2%, 0.3% 2%, 1% 1%, 2.5% 0.3%)";
const FRAME_ACCENTS = [
  "linear-gradient(135deg, #2f5bea, #6cc4ff 52%, #1d3fb5)",
  "linear-gradient(135deg, #ff4fa3, #ffb6d8 52%, #db2b81)",
  "linear-gradient(135deg, #ffc93c, #ffe9a0 52%, #e5a500)",
  "linear-gradient(135deg, #1fbf9a, #a9ead7 52%, #0f9a7a)",
];
const rupiah = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

export default function MerchPage() {
  usePageTitle("Merchandise");
  const root = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<Category>("all");
  const [selectedMerch, setSelectedMerch] = useState<Merch | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  useReveal(root);

  useEffect(() => {
    if (!selectedMerch) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMerch(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedMerch]);

  const products = category === "all" ? merchandises : merchandises.filter((item) => item.category === category);

  function openDetails(item: Merch) {
    setCurrentImage(0);
    setSelectedMerch(item);
  }

  function stepImage(direction: -1 | 1) {
    if (!selectedMerch) return;
    setCurrentImage((image) => (image + direction + selectedMerch.images.length) % selectedMerch.images.length);
  }

  return (
    <div ref={root} className="bg-cream">
      <PageHero
        eyebrow="Merchandise"
        title={<>Bawa pulang <em>kenangannya</em></>}
        description="Koleksi resmi GERIGI × UKM Expo ITS 2026—tersedia satuan maupun bundle. Pilih koleksimu dan lihat detail produknya."
      />

      <section id="katalog-merch" className="relative isolate overflow-hidden bg-gradient-to-b from-cream via-[#fff4df] to-sky-light/70 px-5 py-16 sm:px-8 sm:py-20 md:px-10 md:py-24">
        <div className="dots-light pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div data-reveal className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="eyebrow text-its">GERIGI × UKM EXPO ITS 2026</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Katalog <span className="marker">merchandise</span></h2>
            <p className="mt-3 text-ink-soft">Pilih kategori, lalu tekan produk untuk melihat galeri dan pilihan pembelian.</p>
          </div>

          <div data-reveal className="mb-8 flex flex-wrap justify-center gap-2.5 sm:mb-10">
            {FILTERS.map((filter) => {
              const active = category === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(filter.id)}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-extrabold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-its ${active ? "border-its bg-its text-white shadow-[0_4px_0_#1d3fb5]" : "border-ink/10 bg-white/80 text-ink hover:border-its/40 hover:bg-white"}`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="grid grid-cols-2 justify-items-center gap-4 sm:gap-5 md:grid-cols-3 md:gap-7 lg:grid-cols-4 lg:gap-8"
            >
              {products.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openDetails(item)}
                  style={{ clipPath: TICKET_FRAME, background: FRAME_ACCENTS[index % FRAME_ACCENTS.length] }}
                  className="group flex min-h-[21rem] w-full max-w-[18rem] flex-col p-[3px] text-left drop-shadow-[0_12px_10px_rgb(27_31_59/0.16)] transition duration-300 hover:-translate-y-1.5 hover:saturate-125 hover:drop-shadow-[0_18px_14px_rgb(27_31_59/0.2)] focus-visible:outline-none focus-visible:drop-shadow-[0_0_7px_#2f5bea] sm:min-h-[22rem]"
                >
                  <span className="relative flex w-full flex-1 flex-col overflow-hidden bg-white" style={{ clipPath: TICKET_FRAME }}>
                    <span className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#fff8ec] via-white to-[#e2f3ff] p-3 sm:p-4">
                      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sun/25 blur-2xl transition group-hover:bg-pink/20" aria-hidden="true" />
                      <motion.img
                        src={item.images[0]}
                        alt={item.name}
                        loading="lazy"
                        animate={{ y: [0, -5, 0, 5, 0] }}
                        transition={{ duration: 4 + (index % 4) * 0.35, delay: (index % 4) * 0.18, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.06 }}
                        className="relative h-full w-full object-contain"
                      />
                    </span>
                    <span
                      className="h-3 w-full shrink-0"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(27, 31, 59, 0.42) 1px, transparent 1.2px)",
                        backgroundPosition: "center",
                        backgroundRepeat: "repeat-x",
                        backgroundSize: "9px 3px",
                      }}
                      aria-hidden="true"
                    />
                    <span className="flex min-h-40 w-full flex-1 flex-col p-4 sm:p-4">
                      <span className="w-fit rounded-full bg-its-light px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-its-dark">{item.category}</span>
                      <span className="mt-2 line-clamp-2 min-h-11 font-display text-[0.95rem] font-extrabold leading-snug text-ink sm:text-base">{item.name}</span>
                      <span className="mt-2 font-display text-lg font-extrabold text-pink-dark sm:text-xl">{rupiah(item.price)}</span>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-its-dark transition group-hover:gap-2.5">Lihat detail <ExternalLink size={14} aria-hidden="true" /></span>
                    </span>
                  </span>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <MerchDetailDialog
        merchandise={selectedMerch}
        currentImage={currentImage}
        onClose={() => setSelectedMerch(null)}
        onPrevious={() => stepImage(-1)}
        onNext={() => stepImage(1)}
        onSelectImage={setCurrentImage}
      />
    </div>
  );
}

function MerchDetailDialog({
  merchandise,
  currentImage,
  onClose,
  onPrevious,
  onNext,
  onSelectImage,
}: {
  merchandise: Merch | null;
  currentImage: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelectImage: (index: number) => void;
}) {
  return (
    <AnimatePresence>
      {merchandise && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-ink/75 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="merch-detail-title"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] bg-white shadow-2xl ring-4 ring-white/40 md:grid-cols-2 md:overflow-hidden"
          >
            <button type="button" onClick={onClose} aria-label="Tutup detail" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-ink/10 transition hover:rotate-90 hover:bg-pink-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-its">
              <X size={20} aria-hidden="true" />
            </button>

            <div className="bg-gradient-to-br from-sky-light via-white to-pink-light p-4 sm:p-6">
              <div className="relative mx-auto flex aspect-[4/3] max-h-[50svh] items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/90 p-5 shadow-inner ring-2 ring-white md:aspect-square md:max-h-none">
                <motion.img key={merchandise.images[currentImage]} src={merchandise.images[currentImage]} alt={`${merchandise.name}, foto ${currentImage + 1}`} className="h-full w-full object-contain" initial={{ opacity: 0.5, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} />
                {merchandise.images.length > 1 && (
                  <>
                    <button type="button" onClick={onPrevious} aria-label="Foto sebelumnya" className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-its text-white shadow-[0_3px_0_#1d3fb5] transition hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-its-dark"><ChevronLeft size={22} aria-hidden="true" /></button>
                    <button type="button" onClick={onNext} aria-label="Foto berikutnya" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-its text-white shadow-[0_3px_0_#1d3fb5] transition hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-its-dark"><ChevronRight size={22} aria-hidden="true" /></button>
                  </>
                )}
              </div>
              {merchandise.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {merchandise.images.map((image, index) => (
                    <button key={image} type="button" onClick={() => onSelectImage(index)} aria-label={`Pilih foto ${index + 1}`} aria-pressed={currentImage === index} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1 ring-2 transition ${currentImage === index ? "ring-pink" : "ring-ink/10 hover:ring-its/50"}`}>
                      <img src={image} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-8">
              <span className="w-fit rounded-full bg-mint-light px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-mint-dark ring-1 ring-mint/30">{merchandise.category}</span>
              <h2 id="merch-detail-title" className="mt-3 pr-9 font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{merchandise.name}</h2>
              {merchandise.description && <p className="mt-3 leading-relaxed text-ink-soft">{merchandise.description}</p>}
              <p className="mt-5 font-display text-2xl font-extrabold text-pink-dark">{rupiah(merchandise.price)}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={merchandise.gformUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("pink", "w-full sm:w-auto")}>
                  <ExternalLink size={16} aria-hidden="true" /> Beli via Form
                </a>
                <a href={merchandise.shopeeUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("blue", "w-full sm:w-auto")}>
                  <ExternalLink size={16} aria-hidden="true" /> Beli di Shopee
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-soft">Detail dan harga mengikuti informasi pada kanal pembelian.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
