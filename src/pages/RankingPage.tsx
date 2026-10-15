import { useCallback, useEffect, useRef, useState } from "react";
import { Award, Instagram, Medal, Search, Trophy } from "lucide-react";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
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
  { icon: Trophy, color: "#ffd76a", label: "Juara 1" },
  { icon: Medal, color: "#cfd6f5", label: "Juara 2" },
  { icon: Award, color: "#f0a36b", label: "Juara 3" },
];

export default function RankingPage() {
  usePageTitle("Pengumuman Ranking");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className="bg-night-950">
      <PageHero
        eyebrow="Pengumuman Ranking"
        title={<>Ranking <em>TOSN</em> 2026.</>}
        description="Selamat untuk para peserta TOSN terbaik! Berikut adalah daftar ranking peserta."
      />
      <div className="mx-auto max-w-5xl px-6 pb-28">{SHOW_RANKING ? <RankingBoard /> : <ComingSoon />}</div>
    </div>
  );
}

function ComingSoon() {
  return (
    <div data-reveal className="glass relative overflow-hidden rounded-[2rem] p-8 text-center md:p-14">
      <div className="mx-auto mt-10 w-fit">
        <Lantern size={84} faces={SCENE_SETS[0]} lit={false} spinDuration={30} />
      </div>
      <p className="eyebrow mt-20 text-lantern">Segera hadir</p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-paper md:text-5xl">
        Lampionnya belum <em className="font-serif font-normal text-gold italic">dinyalakan</em>.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-mist">
        Data ranking sedang dalam proses rekapitulasi. Pantengin Instagram KPK yaaa! 🔥
      </p>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={buttonClass("lantern", "mt-8")}>
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
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-lantern border-t-transparent" />
      </div>
    );

  if (error)
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <p className="text-[#ff8cc0]">{error}</p>
        <button type="button" onClick={() => void load()} className={buttonClass("ghost", "mt-6")}>
          Coba lagi
        </button>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-mist" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau asal sekolah…"
          aria-label="Cari peserta"
          className="w-full rounded-full bg-night-800/70 py-4 pr-5 pl-12 text-paper ring-1 ring-paper/15 outline-none placeholder:text-mist/70 focus:ring-2 focus:ring-lantern"
        />
      </div>

      {!q && rows.length >= 3 && (
        <div className="grid gap-3 md:grid-cols-3">
          {rows.slice(0, 3).map((p, i) => {
            const { icon: Icon, color, label } = PODIUM[i];
            return (
              <div key={p.id} className="relative overflow-hidden rounded-3xl bg-night-800 p-6 ring-1 ring-paper/10">
                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-3xl" style={{ background: color }} />
                <Icon size={28} style={{ color }} aria-label={label} />
                <p className="mt-6 font-display text-xl font-semibold text-paper">{p.nama}</p>
                <p className="mt-1 text-sm text-mist">{p.asal_sekolah}</p>
                <p className="mt-4 font-display text-3xl font-semibold" style={{ color }}>
                  {p.skor}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {rows.length === 0 ? (
        <p className="glass rounded-3xl p-8 text-center text-mist">
          {q ? `Tidak ada peserta ditemukan untuk “${search}”` : "Belum ada data ranking peserta"}
        </p>
      ) : (
        <div className="glass overflow-hidden rounded-3xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-paper/10 text-mist">
              <tr>
                <th className="px-5 py-4 font-medium">Rank</th>
                <th className="px-5 py-4 font-medium">Nama</th>
                <th className="hidden px-5 py-4 font-medium sm:table-cell">Asal sekolah</th>
                <th className="px-5 py-4 text-right font-medium">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper/5">
              {rows.map((p) => (
                <tr key={p.id} className="transition hover:bg-paper/[0.03]">
                  <td className={cn("px-5 py-4 font-display font-semibold tabular-nums", p.ranking <= 3 ? "text-gold" : "text-paper/70")}>
                    #{p.ranking}
                  </td>
                  <td className="px-5 py-4 text-paper">
                    {p.nama}
                    <span className="block text-xs text-mist sm:hidden">{p.asal_sekolah}</span>
                  </td>
                  <td className="hidden px-5 py-4 text-mist sm:table-cell">{p.asal_sekolah}</td>
                  <td className="px-5 py-4 text-right font-display font-semibold text-paper tabular-nums">{p.skor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
