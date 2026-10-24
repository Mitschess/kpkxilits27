import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
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

const TICKET_FRAME = "polygon(4% 0, 96% 0, 97.5% 0.3%, 99% 1%, 99.7% 2%, 100% 3.2%, 100% 57.7%, 99.7% 58.4%, 99% 59%, 98% 59.6%, 97.2% 60.4%, 96.7% 61.3%, 96.5% 62%, 96.7% 62.9%, 97.2% 63.8%, 98% 64.6%, 99% 65.2%, 99.7% 65.8%, 100% 66.5%, 100% 96.8%, 99.7% 98%, 99% 99%, 97.5% 99.7%, 96% 100%, 4% 100%, 2.5% 99.7%, 1% 99%, 0.3% 98%, 0 96.8%, 0 66.5%, 0.3% 65.8%, 1% 65.2%, 2% 64.6%, 2.8% 63.8%, 3.3% 62.9%, 3.5% 62%, 3.3% 61.3%, 2.8% 60.4%, 2% 59.6%, 1% 59%, 0.3% 58.4%, 0 57.7%, 0 3.2%, 0.3% 2%, 1% 1%, 2.5% 0.3%)";
const FRAME_ACCENTS = [
  "linear-gradient(135deg, #2f5bea, #6cc4ff 52%, #1d3fb5)",
  "linear-gradient(135deg, #ff4fa3, #ffb6d8 52%, #db2b81)",
  "linear-gradient(135deg, #ffc93c, #ffe9a0 52%, #e5a500)",
  "linear-gradient(135deg, #1fbf9a, #a9ead7 52%, #0f9a7a)",
];
const FRAME_TINTS = ["#6cc4ff", "#ffb6d8", "#ffe9a0", "#a9ead7"];
const FRAME_LINE_COLORS = ["#1d3fb5", "#db2b81", "#b97700", "#0f9a7a"];
const CARD_TILTS = ["md:-rotate-1", "md:rotate-1", "md:rotate-[-0.5deg]", "md:rotate-[1.5deg]"];
const rupiah = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

function MerchCard({ item, index, onOpen }: { item: Merch; index: number; onOpen: () => void }) {
  const [imageIndex, setImageIndex] = useState(0);
  const imageCount = item.images.length;

  useEffect(() => {
    if (imageCount < 2) return;
    const interval = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % imageCount);
    }, 2800 + (index % 4) * 220);
    return () => window.clearInterval(interval);
  }, [imageCount, index]);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ clipPath: TICKET_FRAME, background: FRAME_ACCENTS[index % FRAME_ACCENTS.length] }}
      className={`group flex min-h-[21rem] w-full max-w-[18rem] flex-col p-[3px] text-left drop-shadow-[0_12px_10px_rgb(27_31_59/0.16)] transition duration-300 ease-bounce hover:-translate-y-2 hover:rotate-0 hover:saturate-125 hover:drop-shadow-[0_18px_14px_rgb(27_31_59/0.2)] focus-visible:outline-none focus-visible:drop-shadow-[0_0_7px_#2f5bea] sm:min-h-[22rem] ${CARD_TILTS[index % CARD_TILTS.length]}`}
    >
      <span className="relative flex w-full flex-1 flex-col overflow-hidden bg-white" style={{ clipPath: TICKET_FRAME }}>
        <span className="pointer-events-none absolute inset-x-0 top-0 bottom-[38%] z-0 bg-gradient-to-br from-[#fff8ec] via-white to-[#e2f3ff]" aria-hidden="true" />
        <span
          className="pointer-events-none absolute left-[5%] right-[5%] top-[62%] z-20 h-3 -translate-y-1/2"
          style={{
            backgroundImage: `radial-gradient(circle, ${FRAME_LINE_COLORS[index % FRAME_LINE_COLORS.length]} 1px, transparent 1.2px)`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat-x",
            backgroundSize: "9px 3px",
          }}
          aria-hidden="true"
        />
        <span className="relative z-10 block w-full shrink-0 overflow-hidden">
          <span className="relative block aspect-[5/4] w-full overflow-hidden p-3 sm:p-4">
            <motion.span
              className="absolute inset-3 block sm:inset-4"
              animate={{ y: [0, -11, 0, 11, 0], rotate: [0, 0.7, 0, -0.7, 0] }}
              transition={{ duration: 3.8 + (index % 4) * 0.35, delay: (index % 4) * 0.18, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={item.images[imageIndex]}
                  src={item.images[imageIndex]}
                  alt={`${item.name}, foto ${imageIndex + 1} dari ${imageCount}`}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ opacity: { duration: 0.22 }, scale: { duration: 0.22 } }}
                  whileHover={{ scale: 1.06 }}
                  className="relative h-full w-full object-contain"
                />
              </AnimatePresence>
            </motion.span>
            {imageCount > 1 && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 shadow-sm backdrop-blur-sm" aria-hidden="true">
                {item.images.map((image, dotIndex) => (
                  <span key={image} className={`h-1.5 rounded-full transition-all duration-300 ${imageIndex === dotIndex ? "w-4 bg-pink" : "w-1.5 bg-ink/25"}`} />
                ))}
              </span>
            )}
          </span>
        </span>
        <span className="relative flex min-h-36 w-full flex-1 flex-col overflow-hidden px-4 pt-4 pb-2">
          <span className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full opacity-25 transition duration-500 group-hover:scale-125" style={{ background: FRAME_TINTS[index % FRAME_TINTS.length] }} aria-hidden="true" />
          <span className="relative z-10 flex w-full flex-1 flex-col">
            <span className="w-fit rounded-full bg-its-light px-3 py-0.5 text-[0.7rem] font-extrabold uppercase leading-tight tracking-[0.1em] text-its-dark">{item.category}</span>
            <span className="mt-2 line-clamp-2 font-display text-[0.95rem] font-extrabold leading-tight text-ink sm:text-base">{item.name}</span>
            <span className="mt-4 font-display text-lg font-extrabold leading-none text-pink-dark sm:text-xl">{rupiah(item.price)}</span>
            <span className="mt-auto flex items-center justify-between gap-2 pt-1 text-sm font-bold leading-none text-its-dark">
              Lihat detail
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition duration-300 ease-bounce group-hover:rotate-45">
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

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
        description="Koleksi resmi KPK × ILITS 2026—tersedia satuan maupun bundle. Pilih koleksimu dan lihat detail produknya."
      />

      <section id="katalog-merch" className="relative isolate overflow-hidden bg-gradient-to-b from-cream via-[#fff4df] to-[#ebf5f9] px-5 py-16 sm:px-8 sm:py-20 md:px-10 md:py-24">
        <div className="dots-light pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div data-reveal className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="eyebrow text-its">KPK × ILITS 2026</p>
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
                <MerchCard key={item.id} item={item} index={index} onOpen={() => openDetails(item)} />
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
