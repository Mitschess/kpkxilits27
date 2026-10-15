import type { Faculty } from "./types";
import { Map } from "lucide-react";

export const FTSPK: Faculty = {
  id: "ftspk",
  name: "Fakultas Teknik Sipil, Perencanaan, dan Kebumian",
  accent: "#c99372",
  icon: Map,
  description: "Sipil, Arsitektur, Lingkungan, Geomatika, Geofisika",
  departments: [
    {
      name: "Teknik Sipil",
      slug: "teknik-sipil",
      description:
        "Departemen yang menerapkan matematika, sains, dan prinsip rekayasa untuk membuat atau memodifikasi model rekayasa sipil pada bidang struktur, sumber daya air, geoteknik, dan transportasi.",
      image:
        "/images/dept/teknik-sipil.webp",
      stats: {
        snbp: 40,
        snbt: 60,
        mandiri: 90,
      },
      competition: {
        snbp: "Tinggi",
        snbt: "Tinggi",
        mandiri: "Tinggi",
      },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Mekanika Tanah dan Batuan",
        "Struktur",
        "Rekayasa Sumber Daya Air dan Pantai",
        "Manajemen Konstruksi",
      ],
      careers: [
        "Building Control Surveyor",
        "CAD Technician",
        "Consulting Civil Engineer",
        "Design Engineer",
        "Nuclear Engineer",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA"],
      contact: "@its_sipil",
    },
    {
      name: "Arsitektur",
      slug: "arsitektur",
      description:
        "Departemen yang mencetak mahasiswa untuk membangun infrastruktur terbaik melalui perancangan kota, sains arsitektur, teknologi, serta perumahan dan permukiman.",
      image:
        "/images/dept/arsitektur.webp",
      stats: {
        snbp: 24,
        snbt: 36,
        mandiri: 60,
      },
      competition: {
        snbp: "Tinggi",
        snbt: "Tinggi",
        mandiri: "Tinggi",
      },
      accreditation: "A",
      asiin: false,
      competencies: [
        "Architecture Theory, History & Criticism",
        "Architecture Design",
        "Architecture Technology/Engineering",
        "Professional and Social Practice",
      ],
      careers: [
        "Konsultan Arsitektur",
        "Arsitek dan Drafter",
        "Kontraktor",
        "Akademisi",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "SENI BUDAYA"],
      contact: "@its.arch.official",
    },
    {
      name: "Teknik Lingkungan",
      slug: "teknik-lingkungan",
      description:
        "Mempelajari dan mengeksplorasi bidang rekayasa dan manajemen lingkungan seperti teknologi air minum, pengelolaan limbah B3, sampah, dan AMDAL.",
      image:
        "/images/dept/teknik-lingkungan.webp",
      stats: {
        snbp: 26,
        snbt: 39,
        mandiri: 65,
      },
      competition: {
        snbp: "Tinggi",
        snbt: "Tinggi",
        mandiri: "Tinggi",
      },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Teknologi Pengolahan Air",
        "Pengelolaan Limbah Padat dan Limbah B3",
        "Remediasi Lingkungan",
        "Manajemen Kualitas Lingkungan",
      ],
      careers: [
        "Industri Manufaktur",
        "Jasa Konstruksi dan Konsultasi",
        "Lembaga Penelitian",
        "Lembaga Pemerintahan",
      ],
      relatedSubjects: ["FISIKA", "BIOLOGI", "KIMIA"],
      contact: "@enviroits",
    },
    {
      name: "Perencanaan Wilayah dan Kota",
      slug: "perencanaan-wilayah-dan-kota",
      description:
        "Mendidik mahasiswa untuk memperbaiki wilayah perkotaan melalui faktor kependudukan, lingkungan, kondisi politik, hingga sosial penduduk.",
      image:
        "/images/dept/perencanaan-wilayah-dan-kota.webp",
      stats: {
        snbp: 34,
        snbt: 51,
        mandiri: 85,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Tinggi",
        mandiri: "Sedang",
      },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Ekologi perkotaan",
        "Sosiologi perkotaan",
        "Perencanaan penggunaan lahan",
        "Ekonomi perkotaan",
        "Urban form",
        "Heritage planning",
      ],
      careers: [
        "Instansi pemerintahan",
        "Konsultan",
        "Pengembangan komunitas",
        "Perencana proyek",
        "Developer dan kontraktor",
        "Akademisi dan peneliti",
      ],
      relatedSubjects: ["MATEMATIKA", "DASAR IPA"],
      contact: "@its_urplan",
    },
    {
      name: "Teknik Geomatika",
      slug: "teknik-geomatika",
      description:
        "Memanfaatkan ilmu dan teknologi survei pemetaan untuk industri informasi geospasial dan pengelolaan sumber daya alam meliputi Geodesi, Geomatika, Pertanahan, dan Hidrografi.",
      image:
        "/images/dept/teknik-geomatika.webp",
      stats: {
        snbp: 26,
        snbt: 39,
        mandiri: 65,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Sedang",
      },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Land Surveyor",
        "Ahli GIS",
        "Surveyor Hidrografi",
        "Surveyor Pertambangan",
        "Insinyur LIDAR",
        "Ahli Fotogrametri",
      ],
      careers: [
        "Geodesi dan Geodinamika",
        "Geospasial",
        "Surveying dan Kadaster",
        "Geomarine",
        "Geoinformatika",
      ],
      relatedSubjects: ["MATEMATIKA", "FISIKA", "KIMIA"],
      contact: "@its_geomatics",
    },
    {
      name: "Teknik Geofisika",
      slug: "teknik-geofisika",
      description:
        "Menggunakan ilmu rekayasa dan teknologi untuk meneliti struktur perlapisan bumi dengan memanfaatkan sifat-sifat fisik batuan untuk eksplorasi migas dan mitigasi bencana.",
      image:
        "/images/dept/teknik-geofisika.webp",
      stats: {
        snbp: 20,
        snbt: 30,
        mandiri: 45,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Sedang",
      },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Seismologi",
        "Mitigasi bencana",
        "Eksplorasi minyak dan gas",
        "Bahan tambang",
        "Geothermal",
      ],
      careers: [
        "Bidang Perminyakan dan Gas Bumi",
        "Panas Bumi/Geothermal",
        "Bidang Pertambangan",
        "Mitigasi Bencana Alam dan Lingkungan",
        "Kesehatan Keselamatan Kerja",
      ],
      relatedSubjects: [
        "MATEMATIKA",
        "FISIKA",
        "KIMIA",
        "EKSPLORASI",
        "GEOTEKNIK",
      ],
      contact: "@its_teknikgeofisika",
    },
    {
      name: "Teknik Pertambangan",
      slug: "teknik-pertambangan",
      description:
        "Departemen yang menggunakan ilmu rekayasa untuk meneliti struktur perlapisan bumi dengan fokus eksplorasi Minyak, Gas Bumi, Geothermal, dan Bahan Tambang Ekonomis.",
      image:
        "/images/dept/teknik-pertambangan.webp",
      stats: {
        snbp: 10,
        snbt: 15,
        mandiri: 50,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Sedang",
      },
      accreditation: "Prodi Baru",
      asiin: false,
      competencies: [
        "Eksplorasi Minyak dan Gas Bumi",
        "Geothermal",
        "Bahan Tambang atau Mineral Ekonomis",
        "Mitigasi Bencana Alam",
      ],
      careers: [
        "Perusahaan Tambang",
        "Industri Pengolahan dan Permunian (Smelter)",
        "Konsultan dan Jasa Pertambangan",
      ],
      relatedSubjects: ["MATEMATIKA", "FISIKA"],
      contact: "@its_pertambangan",
    },
  ],
};
