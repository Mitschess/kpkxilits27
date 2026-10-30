import { useEffect, useRef, useState, type CSSProperties } from "react";
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

// Each ticket is two halves (photo + stub) whose meeting corners are cut into
// semicircle notches with a mask, so the page background shows through.
const TICKET_BORDER = 3;
const TICKET_ACCENTS = [
  { edge: "#2f5bea", shadow: "#1d3fb5", tint: "#e2f3ff" },
  { edge: "#ff4fa3", shadow: "#db2b81", tint: "#ffe1ef" },
  { edge: "#ffc93c", shadow: "#e5a500", tint: "#fff2c4" },
  { edge: "#1fbf9a", shadow: "#0f9a7a", tint: "#d3f7eb" },
];
type TicketAccent = (typeof TICKET_ACCENTS)[number];
const BARCODE = "repeating-linear-gradient(90deg, #1b1f3b 0 2px, transparent 2px 4px, #1b1f3b 4px 5px, transparent 5px 7px, #1b1f3b 7px 10px, transparent 10px 12px, #1b1f3b 12px 13px, transparent 13px 16px)";
const rupiah = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

/** Mask that cuts notches (radius `--notch`) into both corners of one edge. `inset` keeps an inner layer's cut concentric with its frame. */
function notchMask(edge: "top" | "bottom" | "left" | "right", inset = 0) {
  const radius = `calc(var(--notch) + ${inset}px)`;
  const cut = (at: string) => `radial-gradient(circle at ${at}, #0000 ${radius}, #000 calc(${radius} + 0.5px))`;
  const side = edge === "top" || edge === "left" ? "0" : "100%";
  const near = `${-inset}px`;
  const far = `calc(100% + ${inset}px)`;
  if (edge === "top" || edge === "bottom") {
    return `${cut(`${near} ${side}`)} left / 51% 100% no-repeat, ${cut(`${far} ${side}`)} right / 51% 100% no-repeat`;
  }
  return `${cut(`${side} ${near}`)} top / 100% 51% no-repeat, ${cut(`${side} ${far}`)} bottom / 100% 51% no-repeat`;
}
const maskStyle = (mask: string) => ({ mask, WebkitMask: mask });

// Dialog halves sit stacked on phones and side by side from `md`, so the notched edge swaps there.
const SWAP_MASK = "[mask:var(--mask)] [-webkit-mask:var(--mask)] md:[mask:var(--mask-md)] md:[-webkit-mask:var(--mask-md)]";
const swapMaskVars = (mobile: string, desktop: string) => ({ "--mask": mobile, "--mask-md": desktop }) as CSSProperties;

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

  const accent = TICKET_ACCENTS[index % TICKET_ACCENTS.length];

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ "--pop": accent.shadow } as CSSProperties}
      className="group flex w-full max-w-[20rem] flex-col rounded-[1.25rem] text-left transition duration-300 ease-bounce [--notch:10px] [filter:drop-shadow(0_4px_0_var(--pop))_drop-shadow(0_12px_14px_rgb(27_31_59/0.12))] hover:-translate-y-1.5 hover:[filter:drop-shadow(0_8px_0_var(--pop))_drop-shadow(0_18px_18px_rgb(27_31_59/0.16))] focus-visible:outline-3 focus-visible:outline-offset-6 focus-visible:outline-its sm:[--notch:13px]"
    >
      <span className="block w-full shrink-0 rounded-t-[1.25rem] px-[3px] pt-[3px]" style={{ background: accent.edge, ...maskStyle(notchMask("bottom")) }}>
        <span
          className="relative block overflow-hidden rounded-t-[calc(1.25rem-3px)]"
          style={{ background: `linear-gradient(160deg, #fff8ec, #fff 45%, ${accent.tint})`, ...maskStyle(notchMask("bottom", TICKET_BORDER)) }}
        >
          <span className="relative block aspect-[5/4] w-full overflow-hidden">
            <motion.span
              className="absolute inset-3 bottom-5 block sm:inset-4 sm:bottom-6"
              animate={{ y: [0, -6, 0, 6, 0], rotate: [0, 0.7, 0, -0.7, 0] }}
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
              <span className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 shadow-sm backdrop-blur-sm" aria-hidden="true">
                {item.images.map((image, dotIndex) => (
                  <span key={image} className={`h-1.5 rounded-full transition-all duration-300 ${imageIndex === dotIndex ? "w-4 bg-pink" : "w-1.5 bg-ink/25"}`} />
                ))}
              </span>
            )}
          </span>
        </span>
      </span>
      <span className="flex w-full flex-1 flex-col rounded-b-[1.25rem] px-[3px] pb-[3px]" style={{ background: accent.edge, ...maskStyle(notchMask("top")) }}>
        <span className="relative flex flex-1 flex-col rounded-b-[calc(1.25rem-3px)] bg-white px-3 pt-3.5 pb-3 sm:px-4 sm:pt-4" style={maskStyle(notchMask("top", TICKET_BORDER))}>
          <span
            className="pointer-events-none absolute top-0 right-[calc(var(--notch)+4px)] left-[calc(var(--notch)+4px)] h-0.5"
            style={{ background: `repeating-linear-gradient(90deg, ${accent.shadow} 0 6px, transparent 6px 11px)` }}
            aria-hidden="true"
          />
          <span className="flex items-center justify-between gap-2">
            <span className="rounded-full px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase leading-tight tracking-[0.12em] text-ink sm:text-[0.7rem]" style={{ background: accent.tint }}>
              {item.category}
            </span>
            <span className="shrink-0 font-display text-[0.65rem] font-bold tracking-[0.08em] text-ink-soft tabular-nums sm:text-xs">No.{String(item.id).padStart(3, "0")}</span>
          </span>
          <span className="mt-2.5 line-clamp-2 font-display text-[0.95rem] font-extrabold leading-tight text-ink sm:text-base">{item.name}</span>
          <span className="mt-1.5 pb-3 font-display text-lg font-extrabold leading-none text-pink-dark sm:text-xl">{rupiah(item.price)}</span>
          <span className="mt-auto flex items-center justify-between gap-2 border-t border-ink/10 pt-2.5 text-sm font-bold leading-none text-its-dark">
            Lihat detail
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-white transition duration-300 ease-bounce group-hover:rotate-45 sm:h-9 sm:w-9">
              <ArrowUpRight size={17} aria-hidden="true" />
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
        accent={TICKET_ACCENTS[Math.max(0, products.findIndex((item) => item.id === selectedMerch?.id)) % TICKET_ACCENTS.length]}
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
  accent,
  currentImage,
  onClose,
  onPrevious,
  onNext,
  onSelectImage,
}: {
  merchandise: Merch | null;
  accent: TicketAccent;
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
            className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto overscroll-contain"
          >
            <button type="button" onClick={onClose} aria-label="Tutup detail" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-ink/10 transition hover:rotate-90 hover:bg-pink-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-its">
              <X size={20} aria-hidden="true" />
            </button>

            <div className="grid [--notch:16px] md:grid-cols-2 md:[--notch:20px]">
              <div
                className={`rounded-t-[1.75rem] px-[3px] pt-[3px] md:rounded-tr-none md:rounded-bl-[1.75rem] md:pr-0 md:pb-[3px] ${SWAP_MASK}`}
                style={{ background: accent.edge, ...swapMaskVars(notchMask("bottom"), notchMask("right")) }}
              >
                <div
                  className={`flex h-full flex-col justify-center rounded-t-[calc(1.75rem-3px)] p-4 sm:p-6 md:rounded-tr-none md:rounded-bl-[calc(1.75rem-3px)] ${SWAP_MASK}`}
                  style={{ background: `linear-gradient(160deg, #fff8ec, #fff 45%, ${accent.tint})`, ...swapMaskVars(notchMask("bottom", TICKET_BORDER), notchMask("right", TICKET_BORDER)) }}
                >
                  <div className="relative mx-auto flex aspect-[4/3] max-h-[50svh] w-full items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/90 p-5 ring-2 ring-white md:aspect-square md:max-h-none">
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
              </div>

              <div
                className={`rounded-b-[1.75rem] px-[3px] pb-[3px] md:rounded-bl-none md:rounded-tr-[1.75rem] md:pt-[3px] md:pl-0 ${SWAP_MASK}`}
                style={{ background: accent.edge, ...swapMaskVars(notchMask("top"), notchMask("left")) }}
              >
                <div
                  className={`relative flex h-full flex-col justify-center rounded-b-[calc(1.75rem-3px)] bg-white p-5 sm:p-8 md:rounded-bl-none md:rounded-tr-[calc(1.75rem-3px)] ${SWAP_MASK}`}
                  style={swapMaskVars(notchMask("top", TICKET_BORDER), notchMask("left", TICKET_BORDER))}
                >
                  <span className="pointer-events-none absolute top-0 right-[calc(var(--notch)+6px)] left-[calc(var(--notch)+6px)] h-0.5 md:hidden" style={{ background: `repeating-linear-gradient(90deg, ${accent.shadow} 0 8px, transparent 8px 14px)` }} aria-hidden="true" />
                  <span className="pointer-events-none absolute top-[calc(var(--notch)+6px)] bottom-[calc(var(--notch)+6px)] left-0 hidden w-0.5 md:block" style={{ background: `repeating-linear-gradient(180deg, ${accent.shadow} 0 8px, transparent 8px 14px)` }} aria-hidden="true" />

                  <div className="flex items-center justify-between gap-3 md:pr-12">
                    <span className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-ink" style={{ background: accent.tint }}>{merchandise.category}</span>
                    <span className="font-display text-sm font-bold tracking-[0.08em] text-ink-soft tabular-nums">No.{String(merchandise.id).padStart(3, "0")}</span>
                  </div>
                  <h2 id="merch-detail-title" className="mt-4 font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{merchandise.name}</h2>
                  {merchandise.description && <p className="mt-3 leading-relaxed text-ink-soft">{merchandise.description}</p>}
                  <p className="mt-4 font-display text-2xl font-extrabold text-pink-dark">{rupiah(merchandise.price)}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <a href={merchandise.gformUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("pink", "w-full sm:w-auto")}>
                      <ExternalLink size={16} aria-hidden="true" /> Beli via Form
                    </a>
                    <a href={merchandise.shopeeUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("blue", "w-full sm:w-auto")}>
                      <ExternalLink size={16} aria-hidden="true" /> Beli di Shopee
                    </a>
                  </div>
                  <div className="mt-6 flex items-center gap-4 border-t-2 border-dashed border-ink/10 pt-4">
                    <span className="h-10 w-24 shrink-0 opacity-80" style={{ background: BARCODE }} aria-hidden="true" />
                    <p className="text-xs leading-relaxed text-ink-soft">Detail dan harga mengikuti informasi pada kanal pembelian.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
