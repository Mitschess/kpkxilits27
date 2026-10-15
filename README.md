# KPK x Ini Lho ITS! — Website

Website Kampus Pulang Kampung (KPK) x Ini Lho ITS! 2026.

## Tema: "Festival Pulang Kampung"

Suasana festival kampung yang ceria di siang hari. Tujuannya mempromosikan ITS dan Ini Lho ITS! ke siswa SMA/K
se-Kabupaten Gresik. Sepanjang halaman ada **bus KPK yang melaju dari Gresik ke ITS**. Ide rute ini diambil dari
logo KPK x ILITS, yang berupa peta dengan jalur putus-putus.

- **Dekorasi** (`src/components/deco/`): matahari, awan berjalan, bendera segitiga ala 17-an, bus KPK, jalan
  raya, dan kota Gresik kartun (`Townscape.tsx`): pelabuhan, pabrik semen, Masjid Jami', rumah kampung, sampai
  gedung ITS.
- **Lampion Damar Kurung 3D** (`src/components/lantern/`): lampion kotak khas Gresik sebagai hiasan festival.
  Panelnya dilukis gaya Damar Kurung. Di section Filosofi, empat sisinya adalah empat nilai logo dan lampionnya
  berputar saat digulir.
- **Rute**: tiap section adalah "Pos" perjalanan. Di layar lebar ada rel rute Gresik → ITS di kiri.
- **Palet**: kuning, pink, hijau mint, oranye (dari logo) + biru ITS, di atas latar krem.
- **Tombol "pop"**: tombol tebal dengan bayangan bawah yang tertekan saat diklik (`components/ui/button.ts`).
- **Font**: Bricolage Grotesque (judul), Plus Jakarta Sans (teks), Caveat (tulisan tangan). Semua self-hosted
  lewat `@fontsource`.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger (animasi scroll, pin) · Lenis (smooth
scroll) · Framer Motion (animasi komponen) · Radix UI (dialog, slider) · yet-another-react-lightbox ·
canvas-confetti · lucide-react. Supabase opsional untuk ranking & buku tamu.

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
    layout/               Navbar, Footer, LoadingScreen (bus Gresik → ITS), RootLayout
    home/                 Hero, Ticker, Tentang, Filosofi (lampion berputar), Acara (scroll horizontal),
                          Kalkulator Ngekos/Laju, Kuis Mitos, Galeri, RouteRail
    faculty/              kartu fakultas + panel samping departemen
    cabinet/              kartu anggota kabinet
    deco/                 Sun, Clouds, Bunting, Bus, Road, Townscape
    ui/                   SectionHeading, PageHero, Sheet, tombol, angka animasi
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
