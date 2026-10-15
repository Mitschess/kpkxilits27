# KPK x Ini Lho ITS! — Website

Website Kampus Pulang Kampung (KPK) x Ini Lho ITS! 2026.

## Tema: "Damar Kurung"

Malam festival lampion **Damar Kurung**, lampion kotak khas Gresik, yang dinyalakan sepanjang **rute dari
kampung halaman (Gresik) menuju kampus (ITS)**. Rute ini diambil dari logo KPK x ILITS, yang berupa peta dengan
jalur putus-putus.

- **Lampion 3D** (`src/components/lantern/`): kotak CSS 3D dengan panel lukisan gaya Damar Kurung, yaitu siluet
  datar dalam baris-baris dan bingkai tumpal (segitiga). Lukisannya bertema kampung, pelabuhan, kampus, masjid,
  dan empat nilai logo.
- **Rute**: tiap section adalah "Pos" perjalanan. Di layar lebar ada rel rute di kiri yang terisi cahaya saat
  digulir.
- **Siluet Gresik** (`Skyline.tsx`): pelabuhan, pabrik semen, Masjid Jami', rumah kampung, dan pohon kelapa.
- **Palet**: biru malam ITS, cahaya lampion (amber/emas), magenta & teal dari logo.
- **Font**: Bricolage Grotesque (judul), Plus Jakarta Sans (teks), Instrument Serif italic (aksen). Semua
  self-hosted lewat `@fontsource`.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger (animasi scroll, pin) · Lenis (smooth
scroll) · Framer Motion (animasi komponen) · Radix UI (dialog, slider) · yet-another-react-lightbox · lucide-react.
Supabase opsional untuk ranking & buku tamu.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # hasil di dist/
npm run preview    # cek hasil build
```

### Supabase (opsional)

Halaman `/ranking` dan `/guestbook` membaca tabel `participants` dan `guestbook`. Salin `.env.example` jadi
`.env.local`, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. Tanpa env ini situs tetap jalan.
Untuk membuka hasil ranking, ubah `SHOW_RANKING` jadi `true` di `src/pages/RankingPage.tsx`.

## Struktur

```
src/
  index.css               token tema (warna, font, animasi) + CSS lampion 3D
  lib/motion.ts           setup GSAP/ScrollTrigger + Lenis, helper scroll
  pages/                  Home, Kabinet, Ranking, Buku Tamu, 404
  components/
    lantern/              Lantern (kotak 3D) + LanternArt (lukisan panel)
    layout/               Navbar, Footer, LoadingScreen, CursorGlow, RootLayout
    home/                 Hero, Ticker, Tentang, Filosofi (lampion berputar), Acara (scroll horizontal),
                          Kalkulator Ngekos/Laju, Kuis Mitos, Galeri, RouteRail
    faculty/              kartu fakultas + panel samping departemen
    cabinet/              kartu anggota kabinet
    ui/                   SectionHeading, PageHero, Sheet, Starfield, Skyline, dll.
  data/                   SEMUA konten: home.ts, cabinet.ts, faculties/*
public/images/            gambar (WebP)
```

Konten (event, nilai filosofi, mitos, galeri, kabinet, fakultas) cukup diubah di `src/data/`.

## Menambah gambar

```bash
npm run images -- <file-atau-folder-sumber> public/images/<folder> --width=480
```

Lebar yang dipakai: kabinet `480` (PNG transparan → WebP), departemen `900`, galeri `900`, event `1200`.

## Deploy

Sudah ada `vercel.json` (rewrite SPA). Untuk hosting statis lain, arahkan semua route ke `index.html`.
