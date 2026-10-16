import type { ArtVariant } from "@/components/lantern/LanternArt";

export const INSTAGRAM_URL = "https://www.instagram.com/kpk.2026";
export const INSTAGRAM_HANDLE = "@kpk.2026";

/** Sections of the home page, in order — drawn as stops on the route rail. */
export const ROUTE_STOPS = [
  { id: "tentang", label: "Tentang" },
  { id: "filosofi", label: "Filosofi" },
  { id: "acara", label: "Acara" },
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
  /** What people say ("Katanya…") */
  claim: string;
  answer: "mitos" | "fakta";
  /** Shown after guessing */
  explanation: string;
}

/** The deck for the myth-or-fact game; each round draws a few cards at random. */
export const MYTHS: MythFact[] = [
  // --- mitos ---
  {
    claim: "Masuk ITS isinya cowok tok?",
    answer: "mitos",
    explanation: "Salah! Ceweknya banyak banget, apalagi di Desain, Manajemen Bisnis, dan Fakultas Sains. Ratio makin seimbang kok, tenang aja!",
  },
  {
    claim: "Biaya kuliah ITS mahal buanget?",
    answer: "mitos",
    explanation: "Tenang! UKT di ITS itu berjenjang sesuai gaji orang tua. Beasiswa KIP-K & ikatan alumni juga bejibun buat bantu kamu.",
  },
  {
    claim: "Anak ITS nggak bisa tidur?",
    answer: "mitos",
    explanation: "Tergantung jurusan dan manajemen waktu! Banyak kok yang aktif organisasi, lomba, tapi tetep glowing & tidur cukup 8 jam.",
  },
  {
    claim: "ITS cuma soal Teknik?",
    answer: "mitos",
    explanation: "Big NO! Ada Desain Produk, Interior, Manajemen Bisnis, Aktuaria, Vokasi, sampai Kedokteran ada LHO!!! ITS itu institut teknologi LENGKAP.",
  },
  {
    claim: "Anak IPS nggak bisa kuliah di ITS?",
    answer: "mitos",
    explanation: "Sekarang tes UTBK-SNBT udah nggak dipisah IPA–IPS lagi. Lagian ITS punya Manajemen Bisnis, Studi Pembangunan, Bisnis Digital, sampai Sains Komunikasi.",
  },
  {
    claim: "Mau masuk Informatika harus udah jago coding?",
    answer: "mitos",
    explanation: "Nggak harus! Ngoding diajarin dari dasar di semester awal. Yang penting logika jalan, rasa penasaran tinggi, dan mau rajin latihan.",
  },
  {
    claim: "Lulusan SMK nggak bisa masuk ITS?",
    answer: "mitos",
    explanation: "Bisa banget! Lulusan SMK bisa ikut jalur seleksi masuk ITS, termasuk ke Fakultas Vokasi yang prodinya dekat sama dunia industri.",
  },
  {
    claim: "Masuk ITS cuma bisa lewat ujian tulis?",
    answer: "mitos",
    explanation: "Ada tiga jalur: SNBP (nilai rapor & prestasi), SNBT (UTBK), dan Seleksi Mandiri ITS. Siapin dari sekarang, pilih yang paling cocok!",
  },
  {
    claim: "Kuliah di ITS isinya belajar doang, nggak ada kegiatan seru?",
    answer: "mitos",
    explanation: "ITS punya puluhan UKM: paduan suara, tari tradisional, band, olahraga, sampai tim robot dan mobil hemat energi. Dijamin nggak bosen!",
  },
  // --- fakta ---
  {
    claim: "ITS punya jurusan Kedokteran?",
    answer: "fakta",
    explanation: "Betul! Ada Fakultas Kedokteran dan Kesehatan dengan prodi Kedokteran dan Teknologi Kedokteran.",
  },
  {
    claim: "Di ITS bisa belajar bikin kapal?",
    answer: "fakta",
    explanation: "Bisa! Fakultas Teknologi Kelautan punya Teknik Perkapalan, Teknik Sistem Perkapalan, Teknik Kelautan, sampai Teknik Lepas Pantai.",
  },
  {
    claim: "Nama ‘Sepuluh Nopember’ diambil dari Hari Pahlawan?",
    answer: "fakta",
    explanation: "Iya! Namanya mengenang 10 November 1945, Pertempuran Surabaya yang sekarang diperingati sebagai Hari Pahlawan.",
  },
  {
    claim: "Mahasiswa ITS bikin mobil sendiri buat lomba internasional?",
    answer: "fakta",
    explanation: "Tim mobil hemat energi ITS seperti Sapuangin dan Nogogeni rutin turun di kompetisi tingkat Asia sampai dunia.",
  },
  {
    claim: "Di ITS ada jurusan khusus belajar AI?",
    answer: "fakta",
    explanation: "Ada! Namanya Rekayasa Kecerdasan Artifisial, di Fakultas Teknologi Elektro dan Informatika Cerdas.",
  },
  {
    claim: "Suka gambar & desain bisa kuliah di ITS?",
    answer: "fakta",
    explanation: "Bisa! Ada Desain Produk Industri, Desain Interior, dan Desain Komunikasi Visual di Fakultas Desain Kreatif dan Bisnis Digital.",
  },
  {
    claim: "ITS punya jurusan Aktuaria?",
    answer: "fakta",
    explanation: "Ada! Aktuaria di Fakultas Sains dan Analitika Data, belajar matematika risiko buat dunia asuransi dan keuangan.",
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

/**
 * Road distance from each Gresik district's main town to ITS Sukolilo (km, one way):
 * the shortest route on OpenStreetMap (OSRM), checked October 2026.
 */
export const GRESIK_DISTRICTS = [
  { name: "Balongpanggang", km: 42 },
  { name: "Benjeng", km: 39 },
  { name: "Bungah", km: 45 },
  { name: "Cerme", km: 33 },
  { name: "Driyorejo", km: 30 },
  { name: "Duduk Sampeyan", km: 42 },
  { name: "Dukun", km: 55 },
  { name: "Gresik Kota", km: 28 },
  { name: "Kebomas", km: 30 },
  { name: "Kedamean", km: 39 },
  { name: "Manyar", km: 35 },
  { name: "Menganti", km: 32 },
  { name: "Panceng", km: 70 },
  { name: "Sidayu", km: 53 },
  { name: "Ujung Pangkah", km: 63 },
  { name: "Wringinanom", km: 41 },
];
