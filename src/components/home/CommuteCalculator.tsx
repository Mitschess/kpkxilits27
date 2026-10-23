import { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  Bike,
  Bus as BusIcon,
  Calculator,
  CalendarDays,
  Car,
  ChevronDown,
  GraduationCap,
  Home,
  House,
  MapPin,
  Printer,
  ReceiptText,
  RotateCcw,
  Scale,
  type LucideIcon,
} from "lucide-react";
import SectionFade from "@/components/deco/SectionFade";
import Bus from "@/components/deco/Bus";
import DistrictPicker, { type District } from "./DistrictPicker";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/button";
import { GRESIK_DISTRICTS } from "@/data/home";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Transport = "motor" | "mobil" | "umum";

const TRANSPORTS: { id: Transport; label: string; icon: LucideIcon }[] = [
  { id: "motor", label: "Motor", icon: Bike },
  { id: "mobil", label: "Mobil", icon: Car },
  { id: "umum", label: "Umum", icon: BusIcon },
];

// Rough monthly-cost assumptions (listed in the fold under the result)
const FUEL_PRICE = 10_000; // Rp / liter (Pertalite)
const KM_PER_LITER = { motor: 40, mobil: 12 };
// Upkeep spread over the km it lasts: oil, periodic service, tyres, brakes (and the CVT belt on a scooter)
const UPKEEP_PER_KM = { motor: 100, mobil: 300 };
// Public transport: a fixed part (ojek/angkot to the bus line) plus a part that grows with distance
const PUBLIC_TRANSPORT_BASE = 15_000; // Rp / day
const PUBLIC_TRANSPORT_PER_KM = 250; // Rp / km travelled
const WEEKS_PER_MONTH = 4;
const KOS_AVG_COST = 850_000;
// closer than this and we don't pick a side
const TIE_MARGIN = 50_000;

const rupiah = (n: number) => `Rp${Math.round(n).toLocaleString("id-ID")}`;

// The result is printed on demand, so it shows the choices made when it was printed.
interface Receipt {
  district: District;
  transport: Transport;
  days: number;
}

function estimate(km: number, transport: Transport, daysPerWeek: number) {
  const trips = daysPerWeek * WEEKS_PER_MONTH;
  const monthlyKm = km * 2 * trips;
  const laju =
    transport === "umum"
      ? (PUBLIC_TRANSPORT_BASE + km * 2 * PUBLIC_TRANSPORT_PER_KM) * trips
      : (monthlyKm / KM_PER_LITER[transport]) * FUEL_PRICE + monthlyKm * UPKEEP_PER_KM[transport];
  const diff = Math.round(Math.abs(laju - KOS_AVG_COST));
  const verdict = diff < TIE_MARGIN ? "seimbang" : laju > KOS_AVG_COST ? "ngekos" : "laju";
  return { laju: Math.round(laju), monthlyKm, verdict, diff };
}

export default function CommuteCalculator() {
  const [district, setDistrict] = useState(GRESIK_DISTRICTS[7]);
  const [transport, setTransport] = useState<Transport>("motor");
  const [days, setDays] = useState(5);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [printing, setPrinting] = useState(false);

  const printer = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const empty = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: printer });

  // Before the first print the (hidden) receipt follows the inputs, so it already takes up its space.
  const shown = receipt ?? { district, transport, days };
  const stale = receipt !== null && (receipt.district !== district || receipt.transport !== transport || receipt.days !== days);
  const r = estimate(shown.district.km, shown.transport, shown.days);
  const TransportIcon = TRANSPORTS.find((t) => t.id === shown.transport)?.icon ?? Bike;
  const max = Math.max(r.laju, KOS_AVG_COST);
  const verdictTitle = r.verdict === "seimbang" ? "Seimbang!" : `Tim ${r.verdict === "ngekos" ? "Ngekos" : "Laju"}!`;
  const status = printing ? "Mencetak…" : stale ? "Pilihan berubah" : receipt ? "Tercetak" : "Siap cetak";

  const print = contextSafe(() => {
    const next: Receipt = { district, transport, days };
    const el = paper.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setReceipt(next);
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    setPrinting(true);
    const t = gsap.timeline({ onComplete: () => setPrinting(false) });
    // an old receipt is torn off first; before the first one, the empty tray fades away
    if (receipt) t.to(el, { y: 48, rotation: -3, autoAlpha: 0, duration: 0.35, ease: "power2.in" });
    else t.to(empty.current, { autoAlpha: 0, duration: 0.2 });
    t.call(() => setReceipt(next));
    t.set(el, { yPercent: -100, y: 0, rotation: 0, autoAlpha: 1 });
    // a receipt printer feeds the paper out in short bursts, rattling as it goes
    t.addLabel("feed");
    t.to(el, { yPercent: -62, duration: 0.45, ease: "power1.inOut" });
    t.to(el, { yPercent: -28, duration: 0.45, ease: "power1.inOut" }, "+=0.12");
    t.to(el, { yPercent: 0, duration: 0.55, ease: "power2.out" }, "+=0.12");
    // and the loose paper sways a little once it's out
    t.to(el, { rotation: 0.6, duration: 0.2, repeat: 1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 0%" });
    t.to(head.current, { y: 1, duration: 0.05, repeat: 33, yoyo: true, ease: "none" }, "feed");
  });

  return (
    <section id="kalkulator" className="dots screen-section relative isolate overflow-hidden bg-mint-light">
      <SectionFade edge="top" color="var(--color-mint-light)" className="h-24" />
      <SectionFade edge="bottom" color="var(--color-pink-light)" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-5 px-6 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:gap-6">
        <div>
          <SectionHeading
            icon={Calculator}
            label="Ngekos vs Laju"
            highlight="#ffffff"
            title={<>Ngekos atau <em>laju</em>?</>}
            description="Dilema abadi arek Gresik. Hitung kasarnya di sini sebelum boncos!"
          />

          {/* inputs */}
          <div data-reveal className="card mt-12 p-6 md:p-8 lg:mt-[clamp(1rem,3vh,2rem)] lg:p-[clamp(1.25rem,3.4vh,2rem)]">
            <DistrictPicker value={district} onChange={setDistrict} />

            <fieldset className="mt-8 lg:mt-[clamp(1rem,3vh,2rem)]">
              <legend className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-mint-light text-mint-dark">
                  <Bike size={16} />
                </span>
                Naik apa ke kampus?
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {TRANSPORTS.map((t) => (
                  <label
                    key={t.id}
                    className={cn(
                      "flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl py-4 text-sm font-bold transition-all duration-200 ease-bounce has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-its lg:flex-row lg:justify-center lg:gap-2 lg:py-3",
                      transport === t.id
                        ? "-translate-y-1 bg-its text-white shadow-[0_5px_0_#1d3fb5]"
                        : "bg-cream text-ink-soft ring-2 ring-ink/10 hover:text-ink hover:ring-ink/25",
                    )}
                  >
                    <input type="radio" name="transport" value={t.id} checked={transport === t.id} onChange={() => setTransport(t.id)} className="sr-only" />
                    <t.icon size={24} />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 lg:mt-[clamp(1rem,3vh,2rem)]">
              <div className="flex items-baseline justify-between">
                <span id="days-label" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-sun-light text-sun-dark">
                    <CalendarDays size={16} />
                  </span>
                  Ke kampus per minggu
                </span>
                <span className="font-display text-3xl font-extrabold text-its">
                  {days}
                  <span className="text-base font-bold text-ink-soft"> hari</span>
                </span>
              </div>
              <Slider.Root className="slider-root mt-4 lg:mt-2" min={1} max={6} step={1} value={[days]} onValueChange={([v]) => setDays(v)} aria-labelledby="days-label">
                <Slider.Track className="relative h-3 grow overflow-hidden rounded-full bg-ink/10">
                  <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-sky to-its" />
                </Slider.Track>
                <Slider.Thumb
                  aria-label="Hari per minggu"
                  className="block h-8 w-8 rounded-full border-4 border-its bg-white shadow-[0_3px_0_#1d3fb5] transition hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-its/30"
                />
              </Slider.Root>
              <div className="mt-2 flex justify-between font-hand text-lg font-bold text-ink-soft lg:mt-0 lg:text-base">
                <span>Santuy</span>
                <span>Sepuh</span>
              </div>
            </div>

          </div>
        </div>

        {/* result: printed on demand by a little receipt printer */}
        <div ref={printer} data-reveal>
          {/* the printer is a little wider than the column, so the paper keeps the full width and the slot still shows either side of it */}
          <div
            ref={head}
            className="relative -mx-3 rounded-[1.75rem] bg-ink px-6 pt-3 pb-8 text-white shadow-[inset_0_2px_0_rgb(255_255_255/0.07),0_6px_0_#0f1226] md:px-7"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow flex items-center gap-2 text-[0.68rem] text-white/75">
                <Printer size={16} aria-hidden="true" /> Mesin struk
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-white/85">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    printing ? "animate-blink bg-mint" : stale ? "bg-pink" : receipt ? "bg-mint" : "bg-sun",
                  )}
                  aria-hidden="true"
                />
                {status}
              </span>
            </div>
            {/* the slot; the paper below starts at its middle line (17px up from the bottom) */}
            <div className="absolute inset-x-3 bottom-2.5 h-3.5 rounded-full bg-[#080a1c] shadow-[inset_0_3px_4px_rgb(0_0_0/0.75),0_1px_0_rgb(255_255_255/0.1)]" />
          </div>

          {/* only the top is clipped, so the paper appears out of the slot but keeps its shadow */}
          <div className="relative z-10 mx-2 -mt-[17px] [clip-path:inset(0_-3rem_-6rem_-3rem)]">
            {/* the serrated tear bar on the slot's lip, and the slot's shadow on the paper so it looks fed from inside */}
            <div className="receipt-edge pointer-events-none absolute -inset-x-1 top-0 z-20 h-[5px] bg-[#080a1c] [--tooth:8px]" />
            {receipt && <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-6 bg-gradient-to-b from-[#080a1c]/35 via-[#080a1c]/8 to-transparent" />}
            {!receipt && (
              <div
                ref={empty}
                className="absolute inset-x-0 top-[23px] bottom-0 z-10 flex flex-col items-center gap-3 rounded-b-[1.5rem] border-2 border-t-0 border-dashed border-ink/20 bg-white/50 p-6 pt-12 text-center lg:justify-center lg:pt-6"
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-its shadow-[0_4px_0_rgb(27_31_59/0.08)]">
                  <ReceiptText size={30} aria-hidden="true" />
                </span>
                <p className="mt-1 font-display text-2xl font-extrabold text-ink">Struknya belum keluar</p>
                <p className="max-w-xs text-sm font-medium text-ink-soft">Atur rumah, kendaraan, dan jadwal kuliahmu dulu, lalu cetak hasil hitungannya.</p>
                <button type="button" onClick={print} disabled={printing} className={buttonClass("blue", "mt-2")}>
                  <Printer size={18} aria-hidden="true" /> Cetak hasil
                </button>
              </div>
            )}

            <div ref={paper} className="invisible drop-shadow-[0_18px_22px_rgb(27_31_59/0.22)]">
              <div className="receipt-edge relative bg-white px-5 pt-6 pb-8 md:px-6 lg:pt-4 lg:pb-[clamp(1.25rem,3vh,1.75rem)]">
                {/* route */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-sky-light p-5 pb-0 lg:p-4 lg:pb-0">
                  {/* on laptops the distance sits between the two chips to save a line */}
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-3 text-sm font-bold text-ink">
                    <span className="col-start-1 row-start-1 inline-flex items-center gap-1 justify-self-start rounded-full bg-white px-3 py-1 ring-2 ring-ink/10">
                      <MapPin size={13} strokeWidth={2.5} aria-hidden="true" /> {shown.district.name}
                    </span>
                    <span className="col-start-3 row-start-1 inline-flex items-center gap-1 justify-self-end rounded-full bg-its px-3 py-1 text-white">
                      ITS <GraduationCap size={14} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <p className="col-span-3 row-start-2 text-center text-sm font-semibold text-ink-soft lg:col-span-1 lg:col-start-2 lg:row-start-1">
                      {shown.district.km * 2} km pulang-pergi · {shown.days}× seminggu ·{" "}
                      <AnimatedNumber value={r.monthlyKm} format={(n) => `${Math.round(n).toLocaleString("id-ID")} km/bulan`} className="text-ink" />
                    </p>
                  </div>
                  {/* the road bleeds out of the padding, edge to edge of the rounded box */}
                  <div className="relative -mx-5 mt-4 h-16 lg:-mx-4 lg:mt-2 lg:h-[clamp(2.75rem,7.5vh,4rem)]">
                    <div className="absolute inset-x-0 bottom-0 h-6 border-t-[3px] border-ink bg-[#4a5070]">
                      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff_0_18px,transparent_18px_36px)]" />
                    </div>
                    <div className="absolute bottom-3 w-20 animate-drive-across">
                      <Bus className="w-full" />
                    </div>
                  </div>
                </div>

                {/* costs */}
                <div className="mt-6 space-y-5 lg:mt-[clamp(1rem,3vh,1.5rem)] lg:space-y-[clamp(0.75rem,2.4vh,1.25rem)]">
                  <CostRow
                    icon={TransportIcon}
                    label="Biaya laju / bulan"
                    note={shown.transport === "umum" ? "Ongkos angkutan umum" : "Bensin + perawatan"}
                    value={r.laju}
                    width={(r.laju / max) * 100}
                    bar="bg-pink"
                    chip="bg-pink-light text-pink-dark"
                  />
                  <CostRow icon={Home} label="Rata-rata kos / bulan" note="Kamar + listrik + air" value={KOS_AVG_COST} width={(KOS_AVG_COST / max) * 100} bar="bg-mint" chip="bg-mint-light text-mint-dark" />
                </div>

                {/* verdict */}
                <div
                  className={cn(
                    "mt-7 flex items-center gap-4 rounded-[1.5rem] p-5 transition-colors duration-500 lg:mt-[clamp(1rem,3vh,1.75rem)] lg:p-4",
                    r.verdict === "ngekos" && "bg-pink text-white shadow-[0_5px_0_#db2b81]",
                    r.verdict === "laju" && "bg-mint text-white shadow-[0_5px_0_#0f9a7a]",
                    r.verdict === "seimbang" && "bg-sun text-ink shadow-[0_5px_0_#e5a500]",
                  )}
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/25 lg:h-14 lg:w-14" aria-hidden="true">
                    {r.verdict === "ngekos" ? (
                      <House size={32} strokeWidth={2.25} />
                    ) : r.verdict === "laju" ? (
                      <TransportIcon size={32} strokeWidth={2.25} />
                    ) : (
                      <Scale size={32} strokeWidth={2.25} />
                    )}
                  </span>
                  <div>
                    <p className="eyebrow text-[0.68rem] opacity-80">Saran kami</p>
                    <p className="font-display text-4xl leading-none font-extrabold tracking-tight">{verdictTitle}</p>
                    <p className="mt-1.5 text-sm font-medium opacity-95">
                      {r.verdict === "seimbang" ? (
                        <>
                          {r.diff === 0 ? (
                            "Biayanya sama persis."
                          ) : (
                            <>
                              Selisihnya cuma <AnimatedNumber value={r.diff} format={rupiah} className="font-extrabold" />/bulan.
                            </>
                          )}{" "}
                          Pilih yang paling nyaman buatmu!
                        </>
                      ) : r.verdict === "ngekos" ? (
                        <>
                          Laju lebih boros <AnimatedNumber value={r.diff} format={rupiah} className="font-extrabold" />/bulan. Mending ngekos, hemat waktu & tenaga!
                        </>
                      ) : (
                        <>
                          Hemat <AnimatedNumber value={r.diff} format={rupiah} className="font-extrabold" />/bulan dibanding ngekos. Gaspol!
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <details className="group mt-4 rounded-2xl bg-cream px-4 py-3 text-xs leading-relaxed text-ink-soft">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-ink [&::-webkit-details-marker]:hidden">
                    Estimasi kasar · lihat asumsinya
                    <ChevronDown size={16} className="transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-2">
                    Bensin {rupiah(FUEL_PRICE)}/L · motor {KM_PER_LITER.motor} km/L · mobil {KM_PER_LITER.mobil} km/L · perawatan (oli, servis, ban,
                    rem) motor {rupiah(UPKEEP_PER_KM.motor)}/km, mobil {rupiah(UPKEEP_PER_KM.mobil)}/km · angkutan umum {rupiah(PUBLIC_TRANSPORT_BASE)}/hari +{" "}
                    {rupiah(PUBLIC_TRANSPORT_PER_KM)}/km · {WEEKS_PER_MONTH} minggu/bulan · jarak = rute jalan terpendek dari pusat kecamatan ke ITS
                    (OpenStreetMap). Mobil belum termasuk tol & parkir.
                  </p>
                  <p className="mt-1 font-hand text-base font-bold">Belum termasuk jajan cilok di jalan.</p>
                </details>

                {stale && (
                  <div className="absolute inset-0 z-10 flex animate-fade-in flex-col items-center justify-center gap-3 bg-white/75 p-6 text-center backdrop-blur-[3px]">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-light text-pink-dark">
                      <RotateCcw size={26} aria-hidden="true" />
                    </span>
                    <p className="mt-1 font-display text-2xl font-extrabold text-ink">Pilihanmu berubah</p>
                    <p className="max-w-xs text-sm font-medium text-ink-soft">Struk ini masih pakai pilihan yang lama. Cetak lagi biar hasilnya pas.</p>
                    <button type="button" onClick={print} disabled={printing} className={buttonClass("blue", "mt-2")}>
                      <Printer size={18} aria-hidden="true" /> Cetak ulang
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {receipt && !printing && !stale
              ? `${verdictTitle} Biaya laju ${rupiah(r.laju)} per bulan, rata-rata kos ${rupiah(KOS_AVG_COST)} per bulan.`
              : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

function CostRow({
  icon: Icon,
  label,
  note,
  value,
  width,
  bar,
  chip,
}: {
  icon: LucideIcon;
  label: string;
  note: string;
  value: number;
  width: number;
  bar: string;
  chip: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-3">
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", chip)}>
            <Icon size={20} />
          </span>
          <div>
            <p className="text-sm font-bold whitespace-nowrap text-ink">{label}</p>
            <p className="text-xs font-medium whitespace-nowrap text-ink-soft">{note}</p>
          </div>
        </div>
        <AnimatedNumber value={value} format={rupiah} className="ml-auto font-display text-2xl font-extrabold text-ink tabular-nums md:text-3xl" />
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/[0.07]">
        <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out-expo", bar)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
