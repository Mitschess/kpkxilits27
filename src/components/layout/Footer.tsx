import { Link } from "react-router";
import { ArrowUpRight, Flag, Heart, Instagram, MessageSquareHeart } from "lucide-react";
import Bunting from "@/components/deco/Bunting";
import Clouds from "@/components/deco/Clouds";
import SectionFade from "@/components/deco/SectionFade";
import Road from "@/components/deco/Road";
import Townscape from "@/components/deco/Townscape";
import { buttonClass } from "@/components/ui/button";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/data/home";
import { Logo } from "./Navbar";

const EXPLORE = [
  { label: "Tentang KPK", to: "/#tentang" },
  { label: "Filosofi Logo", to: "/#filosofi" },
  { label: "Rangkaian Acara", to: "/#acara" },
  { label: "Ngekos vs Laju", to: "/#kalkulator" },
];

const PAGES = [
  { label: "Fakultas & Departemen", to: "/fakultas" },
  { label: "Struktur Kabinet", to: "/kabinet" },
  { label: "Pengumuman Ranking", to: "/ranking" },
  { label: "Buku Tamu", to: "/guestbook" },
];

export default function Footer() {
  return (
    <footer id="kontak" className="relative overflow-hidden">
      {/* closing call to action: the bus has arrived */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-sun-light via-[#ffe9a8] to-[#bfe6ff]">
        {/* every page ends on cream, so the footer melts in from cream (behind the clouds and flags) */}
        <SectionFade edge="top" color="var(--color-cream)" className="-z-20" />
        {/* clouds first: same layer, so the bunting is drawn in front of the sky */}
        <Clouds className="-z-10" count={3} />
        <Bunting className="absolute inset-x-0 top-0 -z-10" flags={20} sag={36} />

        <div className="mx-auto max-w-4xl px-6 pt-36 pb-16 text-center md:pt-44">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-ink shadow-[0_3px_0_rgb(27_31_59/0.12)] ring-2 ring-ink/10">
            <Flag size={15} strokeWidth={2.5} aria-hidden="true" />
            <span className="eyebrow text-[0.7rem]">Pemberhentian terakhir · ITS</span>
          </p>
          <h2 className="mt-6 font-display text-5xl leading-[0.98] font-extrabold tracking-tight text-balance text-ink md:text-7xl">
            Sampai jumpa di <span className="marker [--hl:var(--color-pink-light)]">kampung halaman</span>!
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-ink-soft">
            Semoga info di sini bermanfaat buat masa depanmu. Jangan lupa pulang kampung & bangun Gresik bareng-bareng ya!
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={buttonClass("blue")}>
              <Instagram size={18} /> Ikuti {INSTAGRAM_HANDLE}
            </a>
            <Link to="/guestbook" className={buttonClass("white")}>
              <MessageSquareHeart size={18} /> Tulis di buku tamu
            </Link>
          </div>
        </div>

        <Townscape className="h-[120px] md:h-[190px]" />
        <Road />
      </div>

      <div className="bg-its-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-16 pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="inline-block rounded-full bg-white py-1.5 pr-5 pl-1.5">
              <Logo />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/80">
              Kampus Pulang Kampung, event IMAGES ITS bersama Ini Lho ITS! untuk mengenalkan ITS kepada siswa-siswi SMA/K
              sederajat di Kabupaten Gresik.
            </p>
          </div>
          <FooterLinks title="Jelajahi" links={EXPLORE} className="md:col-span-3" />
          <FooterLinks title="Halaman" links={PAGES} className="md:col-span-2" />
          <div className="md:col-span-2">
            <p className="eyebrow mb-4 text-sun">Kontak</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition hover:text-sun"
            >
              Instagram <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/70 md:flex-row">
            <p>© 2026 KPK × Ini Lho ITS! 2026</p>
            <p className="flex items-center gap-1.5">
              Dibuat dengan <Heart size={12} className="fill-pink text-pink" /> dan banyak kopi oleh IT Dev Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links, className }: { title: string; links: { label: string; to: string }[]; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow mb-4 text-sun">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm font-medium text-white/85 transition hover:text-sun">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
