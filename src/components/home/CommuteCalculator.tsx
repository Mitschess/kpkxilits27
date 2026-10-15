import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Bike, Bus, Car, ChevronDown, Home, MapPin, type LucideIcon } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import SectionHeading from "@/components/ui/SectionHeading";
import { GRESIK_DISTRICTS } from "@/data/home";
import { cn } from "@/lib/utils";

type Transport = "motor" | "mobil" | "umum";

const TRANSPORTS: { id: Transport; label: string; icon: LucideIcon }[] = [
  { id: "motor", label: "Motor", icon: Bike },
  { id: "mobil", label: "Mobil", icon: Car },
  { id: "umum", label: "Umum", icon: Bus },
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
  const TransportIcon = TRANSPORTS.find((t) => t.id === transport)!.icon;

  return (
    <section id="kalkulator" className="relative overflow-hidden bg-night-950 py-28 md:py-36">
      <div
        className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[700px]"
        style={{ background: "radial-gradient(circle at 80% 80%, rgb(34 184 154 / 0.14), transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          stop="05"
          label="Ngekos vs Laju"
          title={<>Ngekos atau <em>laju</em>?</>}
          description="Dilema abadi arek Gresik. Hitung kasarnya di sini sebelum boncos."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          {/* inputs */}
          <div data-reveal className="glass rounded-[2rem] p-6 md:p-8">
            <label htmlFor="district" className="eyebrow text-paper/60">
              Rumahmu di kecamatan
            </label>
            <div className="relative mt-3">
              <MapPin size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lantern" />
              <select
                id="district"
                value={district.name}
                onChange={(e) => setDistrict(GRESIK_DISTRICTS.find((d) => d.name === e.target.value) ?? GRESIK_DISTRICTS[0])}
                className="w-full cursor-pointer appearance-none rounded-2xl bg-night-950/60 py-4 pr-12 pl-11 font-medium text-paper ring-1 ring-paper/15 transition outline-none hover:ring-paper/30 focus:ring-2 focus:ring-lantern"
              >
                {GRESIK_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name} className="bg-night-900">
                    {d.name} — {d.km} km
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-mist" />
            </div>

            <fieldset className="mt-8">
              <legend className="eyebrow text-paper/60">Naik apa ke kampus?</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {TRANSPORTS.map((t) => (
                  <label
                    key={t.id}
                    className={cn(
                      "flex cursor-pointer flex-col items-center gap-2 rounded-2xl py-4 text-sm font-medium ring-1 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold",
                      transport === t.id
                        ? "bg-lantern/15 text-gold ring-lantern/60"
                        : "bg-night-950/40 text-paper/70 ring-paper/10 hover:text-paper hover:ring-paper/25",
                    )}
                  >
                    <input
                      type="radio"
                      name="transport"
                      value={t.id}
                      checked={transport === t.id}
                      onChange={() => setTransport(t.id)}
                      className="sr-only"
                    />
                    <t.icon size={22} />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <span id="days-label" className="eyebrow text-paper/60">
                  Ke kampus per minggu
                </span>
                <span className="font-display text-2xl font-semibold text-paper">
                  {days} <span className="text-base font-normal text-mist">hari</span>
                </span>
              </div>
              <Slider.Root
                className="slider-root mt-3"
                min={1}
                max={6}
                step={1}
                value={[days]}
                onValueChange={([v]) => setDays(v)}
                aria-labelledby="days-label"
              >
                <Slider.Track className="relative h-2 grow overflow-hidden rounded-full bg-paper/10">
                  <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-lantern to-gold" />
                </Slider.Track>
                <Slider.Thumb
                  aria-label="Hari per minggu"
                  className="block h-6 w-6 rounded-full border-2 border-night-950 bg-gold shadow-[0_0_0_4px_rgb(255_178_63/0.25),0_0_18px_rgb(255_178_63/0.7)] transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper"
                />
              </Slider.Root>
              <div className="mt-2 flex justify-between text-xs text-mist">
                <span>Santuy</span>
                <span>Sepuh</span>
              </div>
            </div>

            <p className="mt-8 border-t border-paper/10 pt-5 text-xs leading-relaxed text-mist/80">
              Asumsi: bensin {rupiah(FUEL_PRICE)}/L · motor {KM_PER_LITER.motor} km/L · mobil {KM_PER_LITER.mobil} km/L · servis{" "}
              {rupiah(SERVICE_COST_PER_KM)}/km · angkutan umum {rupiah(PUBLIC_TRANSPORT_PER_DAY)}/hari · 4 minggu/bulan.
            </p>
          </div>

          {/* result */}
          <div
            data-reveal
            aria-live="polite"
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-night-700 via-night-800 to-night-900 p-6 ring-1 ring-paper/10 md:p-8"
          >
            {/* route */}
            <div className="rounded-3xl bg-night-950/50 p-5 ring-1 ring-paper/10">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-paper">{district.name}</span>
                <span className="font-medium text-lantern">ITS</span>
              </div>
              <svg viewBox="0 0 300 60" className="mt-2 h-auto w-full" aria-hidden="true">
                <path id="commute-path" d="M10 44 C 80 4, 150 60, 220 22 S 280 20, 290 30" fill="none" stroke="rgb(255 243 220 / 0.25)" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="10" cy="44" r="5" fill="#ec3b92" />
                <circle cx="290" cy="30" r="6" fill="#ffb23f" />
                <circle cx="290" cy="30" r="12" fill="#ffb23f" opacity="0.25" />
                <circle r="4.5" fill="#ffd76a">
                  <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#commute-path" />
                  </animateMotion>
                </circle>
              </svg>
              <p className="mt-1 text-xs leading-relaxed text-mist">
                <TransportIcon size={14} className="mr-1.5 inline-block align-[-2px] text-gold" />
                {district.km * 2} km pulang-pergi · {days}× seminggu ·{" "}
                <AnimatedNumber value={r.monthlyKm} format={(n) => `${Math.round(n).toLocaleString("id-ID")} km/bulan`} />
              </p>
            </div>

            {/* costs */}
            <div className="mt-6 space-y-5">
              <CostRow
                icon={TransportIcon}
                label="Biaya laju / bulan"
                note={transport === "umum" ? "Ongkos angkutan umum" : "Bensin + servis"}
                value={r.laju}
                width={(r.laju / max) * 100}
                color="from-magenta to-ember"
              />
              <CostRow icon={Home} label="Rata-rata kos / bulan" note="Kamar + listrik + air" value={KOS_AVG_COST} width={(KOS_AVG_COST / max) * 100} color="from-teal to-mint" />
            </div>

            {/* verdict */}
            <div
              className={cn(
                "mt-8 rounded-3xl p-6 ring-1 transition-colors duration-500",
                r.ngekos ? "bg-magenta/10 ring-magenta/40" : "bg-teal/10 ring-teal/40",
              )}
            >
              <p className="eyebrow text-paper/60">Saran kami</p>
              <p className={cn("mt-2 font-display text-5xl font-semibold tracking-tight md:text-6xl", r.ngekos ? "text-[#ff8cc0]" : "text-mint")}>
                Tim {r.ngekos ? "Ngekos" : "Laju"}!
              </p>
              <p className="mt-3 text-paper/85">
                {r.ngekos ? (
                  <>
                    Laju lebih boros <AnimatedNumber value={r.diff} format={rupiah} className="font-semibold text-paper" /> per bulan.
                    Mending ngekos, hemat waktu & tenaga. 🏠✨
                  </>
                ) : (
                  <>
                    Hemat <AnimatedNumber value={r.diff} format={rupiah} className="font-semibold text-paper" /> per bulan dibanding ngekos.
                    🛵💨
                  </>
                )}
              </p>
            </div>
            <p className="mt-4 text-xs text-mist/70">*Estimasi kasar. Tidak termasuk jajan cilok di jalan.</p>
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
  color,
}: {
  icon: LucideIcon;
  label: string;
  note: string;
  value: number;
  width: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper/[0.07] text-paper">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-sm font-medium text-paper">{label}</p>
            <p className="text-xs text-mist">{note}</p>
          </div>
        </div>
        <AnimatedNumber value={value} format={rupiah} className="font-display text-2xl font-semibold text-paper tabular-nums md:text-3xl" />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper/[0.07]">
        <div className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out-expo", color)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
