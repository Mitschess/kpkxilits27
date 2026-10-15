import { useCallback, useEffect, useRef, useState } from "react";
import { Instagram, Medal, Search, Trophy } from "lucide-react";
import Bus from "@/components/deco/Bus";
import PageHero from "@/components/ui/PageHero";
import { buttonClass } from "@/components/ui/button";
import { INSTAGRAM_URL } from "@/data/home";
import { supabase, type Participant } from "@/lib/supabase";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";

/** Flip to true once the ranking is announced. */
const SHOW_RANKING = false;

const PODIUM = [
  { medal: "#e5a500", bg: "bg-sun-light", ring: "ring-sun" },
  { medal: "#8a97b0", bg: "bg-its-light", ring: "ring-sky" },
  { medal: "#c96a2b", bg: "bg-orange-light", ring: "ring-orange" },
];

export default function RankingPage() {
  usePageTitle("Pengumuman Ranking");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className="bg-cream">
      <PageHero
        icon={Trophy}
        eyebrow="Pengumuman Ranking"
        title={<>Ranking <em>TOSN</em> 2026</>}
        description="Selamat untuk para peserta TOSN terbaik! Berikut adalah daftar ranking peserta."
      />
      <div className="mx-auto max-w-5xl px-6 pb-24">{SHOW_RANKING ? <RankingBoard /> : <ComingSoon />}</div>
    </div>
  );
}

function ComingSoon() {
  return (
    <div data-reveal className="card relative overflow-hidden p-8 text-center md:p-14">
      <div className="dots absolute inset-0 opacity-60" />
      <div className="relative mx-auto h-24 w-full max-w-sm overflow-hidden rounded-2xl bg-sky-light">
        <div className="absolute inset-x-0 bottom-0 h-6 border-t-[3px] border-ink bg-[#4a5070]">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 animate-marquee bg-[repeating-linear-gradient(90deg,#fff_0_18px,transparent_18px_36px)] [width:200%]" />
        </div>
        <div className="absolute bottom-3 left-1/2 w-24 -translate-x-1/2">
          <Bus className="w-full" />
        </div>
      </div>
      <p className="relative mt-8 inline-block -rotate-2 rounded-full bg-sun px-4 py-1.5 font-hand text-xl font-bold text-ink shadow-[0_3px_0_#e5a500]">
        Segera hadir!
      </p>
      <h2 className="relative mt-4 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
        Rankingnya masih <span className="marker">otw</span>
      </h2>
      <p className="relative mx-auto mt-4 max-w-md text-ink-soft">Data ranking sedang dalam proses rekapitulasi. Pantengin Instagram KPK yaaa!</p>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={buttonClass("pink", "relative mt-8")}>
        <Instagram size={18} /> Pantau di Instagram
      </a>
    </div>
  );
}

function RankingBoard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!supabase) {
      setError("Konfigurasi database belum tersedia. Silakan hubungi administrator.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("participants").select("*").order("ranking", { ascending: true });
    if (error) {
      console.error("Error fetching participants:", error);
      setError("Gagal memuat data ranking. Silakan coba lagi nanti.");
    } else {
      setParticipants(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const q = search.trim().toLowerCase();
  const rows = participants.filter((p) => p.nama.toLowerCase().includes(q) || p.asal_sekolah.toLowerCase().includes(q));

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-its border-t-transparent" />
      </div>
    );

  if (error)
    return (
      <div className="card p-8 text-center">
        <p className="font-semibold text-pink-dark">{error}</p>
        <button type="button" onClick={() => void load()} className={buttonClass("white", "mt-6")}>
          Coba lagi
        </button>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau asal sekolah…"
          aria-label="Cari peserta"
          className="w-full rounded-full bg-white py-4 pr-5 pl-12 font-medium text-ink ring-2 ring-ink/10 outline-none placeholder:text-ink-soft/70 focus:ring-its"
        />
      </div>

      {!q && rows.length >= 3 && (
        <div className="grid gap-4 md:grid-cols-3">
          {rows.slice(0, 3).map((p, i) => (
            <div key={p.id} className={cn("rounded-[1.75rem] p-6 ring-2", PODIUM[i].bg, PODIUM[i].ring)}>
              <Medal size={40} strokeWidth={2.25} style={{ color: PODIUM[i].medal }} role="img" aria-label={`Juara ${i + 1}`} />
              <p className="mt-4 font-display text-xl font-extrabold text-ink">{p.nama}</p>
              <p className="mt-1 text-sm font-medium text-ink-soft">{p.asal_sekolah}</p>
              <p className="mt-4 font-display text-3xl font-extrabold text-its">{p.skor}</p>
            </div>
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <p className="card p-8 text-center text-ink-soft">{q ? `Tidak ada peserta ditemukan untuk “${search}”` : "Belum ada data ranking peserta"}</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-its text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Rank</th>
                <th className="px-5 py-4 font-bold">Nama</th>
                <th className="hidden px-5 py-4 font-bold sm:table-cell">Asal sekolah</th>
                <th className="px-5 py-4 text-right font-bold">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink/5">
              {rows.map((p) => (
                <tr key={p.id} className="transition hover:bg-cream">
                  <td className="px-5 py-4 font-display font-extrabold text-ink tabular-nums">
                    {p.ranking <= 3 ? (
                      <Medal size={22} strokeWidth={2.5} style={{ color: PODIUM[p.ranking - 1].medal }} role="img" aria-label={`Juara ${p.ranking}`} />
                    ) : (
                      `#${p.ranking}`
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-ink">
                    {p.nama}
                    <span className="block text-xs font-medium text-ink-soft sm:hidden">{p.asal_sekolah}</span>
                  </td>
                  <td className="hidden px-5 py-4 text-ink-soft sm:table-cell">{p.asal_sekolah}</td>
                  <td className="px-5 py-4 text-right font-display font-extrabold text-its tabular-nums">{p.skor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
