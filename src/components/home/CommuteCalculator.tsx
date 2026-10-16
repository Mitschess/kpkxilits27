import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Bike, Bus as BusIcon, Calculator, CalendarDays, Car, ChevronDown, GraduationCap, Home, House, MapPin, Scale, type LucideIcon } from "lucide-react";
import SectionFade from "@/components/deco/SectionFade";
import Bus from "@/components/deco/Bus";
import DistrictPicker from "./DistrictPicker";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import SectionHeading from "@/components/ui/SectionHeading";
import { GRESIK_DISTRICTS } from "@/data/home";
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

  const r = estimate(district.km, transport, days);
  const TransportIcon = TRANSPORTS.find((t) => t.id === transport)?.icon ?? Bike;
  const max = Math.max(r.laju, KOS_AVG_COST);

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

        {/* result */}
        <div data-reveal aria-live="polite" className="card flex flex-col p-6 md:p-8">
          {/* route */}
          <div className="relative overflow-hidden rounded-[1.5rem] bg-sky-light p-5 pb-0 lg:p-4 lg:pb-0">
            {/* on laptops the distance sits between the two chips to save a line */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-3 text-sm font-bold text-ink">
              <span className="col-start-1 row-start-1 inline-flex items-center gap-1 justify-self-start rounded-full bg-white px-3 py-1 ring-2 ring-ink/10">
                <MapPin size={13} strokeWidth={2.5} aria-hidden="true" /> {district.name}
              </span>
              <span className="col-start-3 row-start-1 inline-flex items-center gap-1 justify-self-end rounded-full bg-its px-3 py-1 text-white">
                ITS <GraduationCap size={14} strokeWidth={2.5} aria-hidden="true" />
              </span>
              <p className="col-span-3 row-start-2 text-center text-sm font-semibold text-ink-soft lg:col-span-1 lg:col-start-2 lg:row-start-1">
                {district.km * 2} km pulang-pergi · {days}× seminggu ·{" "}
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
              icon={TRANSPORTS.find((t) => t.id === transport)!.icon}
              label="Biaya laju / bulan"
              note={transport === "umum" ? "Ongkos angkutan umum" : "Bensin + perawatan"}
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
              <p className="font-display text-4xl leading-none font-extrabold tracking-tight">
                {r.verdict === "seimbang" ? "Seimbang!" : `Tim ${r.verdict === "ngekos" ? "Ngekos" : "Laju"}!`}
              </p>
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
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", chip)}>
            <Icon size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">{label}</p>
            <p className="text-xs font-medium text-ink-soft">{note}</p>
          </div>
        </div>
        <AnimatedNumber value={value} format={rupiah} className="font-display text-2xl font-extrabold text-ink tabular-nums md:text-3xl" />
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/[0.07]">
        <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out-expo", bar)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
