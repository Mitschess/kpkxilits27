import type { ArtVariant } from "@/components/lantern/LanternArt";

export const INSTAGRAM_URL = "https://www.instagram.com/kpk.2026";
export const INSTAGRAM_HANDLE = "@kpk.2026";

/** Sections of the home page, in order — drawn as stops on the route rail. */
export const ROUTE_STOPS = [
  { id: "tentang", label: "Tentang" },
  { id: "filosofi", label: "Filosofi" },
  { id: "acara", label: "Acara" },
  { id: "fakultas", label: "Fakultas" },
  { id: "kalkulator", label: "Ngekos/Laju" },
  { id: "mitos", label: "Mitos" },
  { id: "galeri", label: "Galeri" },
] as const;

export interface EventItem {
  title: string;
  date: string;
  image: string;
  desc: string;
}

export const EVENTS: EventItem[] = [
  {
    title: "School Visits",
    date: "5 – 23 Januari 2026",
    image: "/images/event/visits.webp",
    desc: "Kunjungan ke sekolahmu",
  },
  {
    title: "Try Out Sepuluh Nopember",
    date: "24 Januari 2026",
    image: "/images/event/tryout.webp",
    desc: "Siapkan dirimu untuk SNBT",
  },
  {
    title: "Department Expo",
    date: "24 Januari 2026",
    image: "/images/event/expo.webp",
    desc: "Rasakan jadi mahasiswa ITS sehari",
  },
  {
    title: "Talkshow",
    date: "24 Januari 2026",
    image: "/images/event/talk.webp",
    desc: "Cerita nyata buat melangkah lebih jauh",
  },
  {
    title: "Closing Party",
    date: "24 Januari 2026",
    image: "/images/event/closingpar.webp",
    desc: "Tutup cerita dengan penuh euforia",
  },
];

/** The four values behind the logo, each painted on one face of the lantern. */
export const VALUES: { name: string; art: ArtVariant; text: string; color: string }[] = [
  {
    name: "Eksplorasi",
    art: "eksplorasi",
    text: "Seperti menjelajahi budaya yang memperkaya cara kita melihat dunia.",
    color: "#ff8a3d",
  },
  {
    name: "Kebudayaan",
    art: "kebudayaan",
    text: "Memahami berbagai nilai dan pengalaman membantu kita menyiapkan langkah menuju masa depan.",
    color: "#ff4fa3",
  },
  {
    name: "Solidaritas",
    art: "solidaritas",
    text: "Dengan mengenal keberagaman, kita belajar bekerja sama, membangun solidaritas, dan menemukan arah yang ingin dituju.",
    color: "#1fbf9a",
  },
  {
    name: "Masa Depan",
    art: "masa-depan",
    text: "Dari eksplorasi itulah lahir masa depan yang lebih terbuka, terarah, dan penuh peluang.",
    color: "#2f5bea",
  },
];

export interface MythFact {
  myth: string;
  fact: string;
}

export const MYTHS: MythFact[] = [
  {
    myth: "Masuk ITS isinya cowok tok?",
    fact: "Salah! Ceweknya banyak banget, apalagi di Desain, Manajemen Bisnis, dan Fakultas Sains. Ratio makin seimbang kok, tenang aja!",
  },
  {
    myth: "Biaya kuliah ITS mahal buanget?",
    fact: "Tenang! UKT di ITS itu berjenjang sesuai gaji orang tua. Beasiswa KIP-K & ikatan alumni juga bejibun buat bantu kamu.",
  },
  {
    myth: "Anak ITS nggak bisa tidur?",
    fact: "Tergantung jurusan dan manajemen waktu! Banyak kok yang aktif organisasi, lomba, tapi tetep glowing & tidur cukup 8 jam.",
  },
  {
    myth: "ITS cuma soal Teknik?",
    fact: "Big NO! Ada Desain Produk, Interior, Manajemen Bisnis, Aktuaria, Vokasi, sampai Kedokteran ada LHO!!! ITS itu institut teknologi LENGKAP.",
  },
];

export interface GalleryPhoto {
  src: string;
  caption: string;
}

export const GALLERY: GalleryPhoto[] = [
  { src: "/images/gallery/keseruan-tahun-lalu.webp", caption: "Keseruan tahun lalu!" },
  { src: "/images/gallery/antusiasme-peserta.webp", caption: "Antusiasme peserta" },
  { src: "/images/gallery/kenangan-manis.webp", caption: "Kenangan manis" },
  { src: "/images/gallery/full-senyum.webp", caption: "Full senyum :)" },
  { src: "/images/gallery/seru-banget.webp", caption: "Seru banget!" },
];

/** Estimated average distance from each Gresik district to ITS (km, one way). */
export const GRESIK_DISTRICTS = [
  { name: "Balongpanggang", km: 41 },
  { name: "Benjeng", km: 35 },
  { name: "Bungah", km: 45 },
  { name: "Cerme", km: 30 },
  { name: "Driyorejo", km: 24 },
  { name: "Duduk Sampeyan", km: 40 },
  { name: "Dukun", km: 60 },
  { name: "Gresik Kota", km: 30 },
  { name: "Kebomas", km: 24 },
  { name: "Kedamean", km: 45 },
  { name: "Manyar", km: 34 },
  { name: "Menganti", km: 26 },
  { name: "Panceng", km: 66 },
  { name: "Sidayu", km: 50 },
  { name: "Ujung Pangkah", km: 60 },
  { name: "Wringinanom", km: 40 },
];
