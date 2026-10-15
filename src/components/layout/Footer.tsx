import { Link } from "react-router";
import { ArrowUpRight, Heart, Instagram, MessageSquareHeart } from "lucide-react";
import Skyline from "@/components/ui/Skyline";
import SkyLanterns from "@/components/ui/SkyLanterns";
import Starfield from "@/components/ui/Starfield";
import { buttonClass } from "@/components/ui/button";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/data/home";
import { Logo } from "./Navbar";

const EXPLORE = [
  { label: "Tentang KPK", to: "/#tentang" },
  { label: "Filosofi Logo", to: "/#filosofi" },
  { label: "Rangkaian Acara", to: "/#acara" },
  { label: "Fakultas", to: "/#fakultas" },
  { label: "Ngekos vs Laju", to: "/#kalkulator" },
];

const PAGES = [
  { label: "Struktur Kabinet", to: "/kabinet" },
  { label: "Pengumuman Ranking", to: "/ranking" },
  { label: "Buku Tamu", to: "/guestbook" },
];

export default function Footer() {
  return (
    <footer id="kontak" className="relative overflow-hidden bg-night-950">
      {/* Closing call to action under a sky of rising lanterns */}
      <div className="relative isolate overflow-hidden border-t border-paper/10">
        <Starfield density={0.7} className="-z-10" />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgb(255 178 63 / 0.18), transparent 60%)" }}
        />
        <SkyLanterns className="-z-10" />

        <div className="mx-auto max-w-4xl px-6 py-28 text-center md:py-40">
          <p className="eyebrow text-lantern">Pemberhentian terakhir · ITS Surabaya</p>
          <h2 className="mt-6 font-display text-5xl leading-[0.95] font-semibold tracking-tight text-balance text-paper md:text-7xl">
            Sampai jumpa di <em className="font-serif font-normal text-gold italic text-glow">kampung halaman</em>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-mist">
            Semoga info di sini bermanfaat buat masa depanmu. Jangan lupa pulang kampung & bangun Gresik bareng-bareng ya!
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={buttonClass("lantern")}>
              <Instagram size={18} /> Ikuti {INSTAGRAM_HANDLE}
            </a>
            <Link to="/guestbook" className={buttonClass("ghost")}>
              <MessageSquareHeart size={18} /> Tulis di buku tamu
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-8 pb-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
            Kampus Pulang Kampung — event IMAGES ITS bersama Ini Lho ITS! untuk mengenalkan ITS kepada siswa-siswi
            SMA/K sederajat di Kabupaten Gresik.
          </p>
        </div>
        <FooterLinks title="Jelajahi" links={EXPLORE} className="md:col-span-3" />
        <FooterLinks title="Halaman" links={PAGES} className="md:col-span-2" />
        <div className="md:col-span-2">
          <p className="eyebrow mb-4 text-paper/50">Kontak</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm text-paper/80 transition hover:text-lantern"
          >
            Instagram <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* sky glow behind the silhouette so the dark buildings read */}
      <div className="relative bg-[linear-gradient(to_bottom,#050920_0%,#1b2866_100%)]">
        <Skyline className="h-[130px] md:h-[200px]" />
        <div className="absolute inset-x-0 bottom-0 bg-night-950/0 px-6 pb-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-mist/80 md:flex-row">
            <p>© 2026 KPK × Ini Lho ITS! 2026</p>
            <p className="flex items-center gap-1.5">
              Dibuat dengan <Heart size={12} className="fill-magenta text-magenta" /> dan banyak kopi oleh IT Dev Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; to: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow mb-4 text-paper/50">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-paper/80 transition hover:text-lantern">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
