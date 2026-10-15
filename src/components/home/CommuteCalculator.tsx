import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Bike, Bus as BusIcon, Car, ChevronDown, Home, MapPin, type LucideIcon } from "lucide-react";
import Bus from "@/components/deco/Bus";
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

// Rough monthly-cost assumptions (shown to the visitor below the form)
const FUEL_PRICE = 10_000; // Rp / liter
const KM_PER_LITER = { motor: 40, mobil: 12 };
const SERVICE_COST_PER_KM = 200;
const PUBLIC_TRANSPORT_PER_DAY = 30_000;
const KOS_AVG_COST = 850_000;

const rupiah = (n: number) => `Rp${Math.round(n).toLocaleString("id-ID")}`;

function estimate(km: number, transport: Transport, daysPerWeek: number) {
  const monthlyKm = km * 2 * daysPerWeek * 4;
  const laju =
    transport === "umum"
      ? PUBLIC_TRANSPORT_PER_DAY * daysPerWeek * 4
      : (monthlyKm / KM_PER_LITER[transport]) * FUEL_PRICE + monthlyKm * SERVICE_COST_PER_KM;
  return { laju: Math.round(laju), monthlyKm, ngekos: laju > KOS_AVG_COST, diff: Math.round(Math.abs(laju - KOS_AVG_COST)) };
}

export default function CommuteCalculator() {
  const [district, setDistrict] = useState(GRESIK_DISTRICTS[7]);
  const [transport, setTransport] = useState<Transport>("motor");
  const [days, setDays] = useState(5);

  const r = estimate(district.km, transport, days);
  const max = Math.max(r.laju, KOS_AVG_COST);

  return (
    <section id="kalkulator" className="dots relative overflow-hidden bg-mint-light py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          stop="05"
          emoji="🧮"
          label="Ngekos vs Laju"
          highlight="#ffffff"
          title={<>Ngekos atau <em>laju</em>?</>}
          description="Dilema abadi arek Gresik. Hitung kasarnya di sini sebelum boncos!"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          {/* inputs */}
          <div data-reveal className="card p-6 md:p-8">
            <label htmlFor="district" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-pink-light text-pink">
                <MapPin size={16} />
              </span>
              Rumahmu di kecamatan mana?
            </label>
            <div className="relative mt-3">
              <select
                id="district"
                value={district.name}
                onChange={(e) => setDistrict(GRESIK_DISTRICTS.find((d) => d.name === e.target.value) ?? GRESIK_DISTRICTS[0])}
                className="w-full cursor-pointer appearance-none rounded-2xl bg-cream py-4 pr-12 pl-5 font-semibold text-ink ring-2 ring-ink/10 transition outline-none hover:ring-ink/25 focus:ring-its"
              >
                {GRESIK_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.km} km)
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft" />
            </div>

            <fieldset className="mt-8">
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
                      "flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl py-4 text-sm font-bold transition-all duration-200 ease-bounce has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-its",
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

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <span id="days-label" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-sun-light text-sun-dark">📅</span>
                  Ke kampus per minggu
                </span>
                <span className="font-display text-3xl font-extrabold text-its">
                  {days}
                  <span className="text-base font-bold text-ink-soft"> hari</span>
                </span>
              </div>
              <Slider.Root className="slider-root mt-4" min={1} max={6} step={1} value={[days]} onValueChange={([v]) => setDays(v)} aria-labelledby="days-label">
                <Slider.Track className="relative h-3 grow overflow-hidden rounded-full bg-ink/10">
                  <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-sky to-its" />
                </Slider.Track>
                <Slider.Thumb
                  aria-label="Hari per minggu"
                  className="block h-8 w-8 rounded-full border-4 border-its bg-white shadow-[0_3px_0_#1d3fb5] transition hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-its/30"
                />
              </Slider.Root>
              <div className="mt-2 flex justify-between font-hand text-lg font-bold text-ink-soft">
                <span>Santuy 😎</span>
                <span>Sepuh 🔥</span>
              </div>
            </div>

            <p className="mt-6 rounded-2xl bg-cream p-4 text-xs leading-relaxed text-ink-soft">
              <strong className="text-ink">Asumsi:</strong> bensin {rupiah(FUEL_PRICE)}/L · motor {KM_PER_LITER.motor} km/L · mobil{" "}
              {KM_PER_LITER.mobil} km/L · servis {rupiah(SERVICE_COST_PER_KM)}/km · angkutan umum {rupiah(PUBLIC_TRANSPORT_PER_DAY)}/hari · 4 minggu/bulan.
            </p>
          </div>

          {/* result */}
          <div data-reveal aria-live="polite" className="card flex flex-col p-6 md:p-8">
            {/* route */}
            <div className="relative overflow-hidden rounded-[1.5rem] bg-sky-light p-5 pb-0">
              <div className="flex items-center justify-between text-sm font-bold text-ink">
                <span className="rounded-full bg-white px-3 py-1 ring-2 ring-ink/10">📍 {district.name}</span>
                <span className="rounded-full bg-its px-3 py-1 text-white">ITS 🎓</span>
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-ink-soft">
                {district.km * 2} km pulang-pergi · {days}× seminggu ·{" "}
                <AnimatedNumber value={r.monthlyKm} format={(n) => `${Math.round(n).toLocaleString("id-ID")} km/bulan`} className="text-ink" />
              </p>
              <div className="relative mt-4 h-16">
                <div className="absolute inset-x-0 bottom-0 h-6 border-t-[3px] border-ink bg-[#4a5070]">
                  <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff_0_18px,transparent_18px_36px)]" />
                </div>
                <div className="absolute bottom-3 left-0 w-20 animate-drive [animation-duration:7s]">
                  <Bus className="w-full" />
                </div>
              </div>
            </div>

            {/* costs */}
            <div className="mt-6 space-y-5">
              <CostRow
                icon={TRANSPORTS.find((t) => t.id === transport)!.icon}
                label="Biaya laju / bulan"
                note={transport === "umum" ? "Ongkos angkutan umum" : "Bensin + servis"}
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
                "mt-7 flex items-center gap-4 rounded-[1.5rem] p-5 transition-colors duration-500",
                r.ngekos ? "bg-pink text-white shadow-[0_5px_0_#db2b81]" : "bg-mint text-white shadow-[0_5px_0_#0f9a7a]",
              )}
            >
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/25 text-4xl" aria-hidden="true">
                {r.ngekos ? "🏠" : "🛵"}
              </span>
              <div>
                <p className="eyebrow text-[0.68rem] text-white/80">Saran kami</p>
                <p className="font-display text-4xl leading-none font-extrabold tracking-tight">Tim {r.ngekos ? "Ngekos" : "Laju"}!</p>
                <p className="mt-1.5 text-sm font-medium text-white/95">
                  {r.ngekos ? (
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
            <p className="mt-4 font-hand text-lg font-bold text-ink-soft">*Estimasi kasar. Belum termasuk jajan cilok di jalan 😋</p>
          </div>
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
