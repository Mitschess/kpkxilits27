import type { Faculty } from "./types";
import { CircuitBoard } from "lucide-react";

export const FV: Faculty = {
  id: "fv",
  name: "Fakultas Vokasi",
  accent: "#fb8a3c",
  icon: CircuitBoard,
  description: "Mesin industri, Kimia industri, Logistik bisnis",
  departments: [
    {
      name: "Teknik Infrastruktur Sipil",
      slug: "teknik-infrastruktur-sipil",
      description:
        "Program D4 yang berfokus pada desain struktur gedung, pemilihan material, dan perancangan struktur bangunan dengan komposisi praktik dan teori hingga 70/30.",
      image:
        "/images/dept/teknik-infrastruktur-sipil.webp",
      stats: { snbp: 30, snbt: 48, mandiri: 31 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Pemeliharaan struktur bangunan",
        "Teknologi konstruksi",
        "Operasional bangunan industri dan sipil",
        "Perbaikan dan rehabilitasi bangunan",
      ],
      careers: ["Instansi Pemerintah", "Konsultan", "Kontraktor"],
      relatedSubjects: ["FISIKA", "MATEMATIKA"],
      contact: "@its_dtisvokasi",
    },
    {
      name: "Teknologi Rekayasa Konstruksi Bangunan Air",
      slug: "teknologi-rekayasa-konstruksi-bangunan-air",
      description:
        "Program D4 yang mempersiapkan mahasiswa di bidang infrastruktur sipil khususnya bangunan air seperti bendungan, drainase, dan irigasi.",
      image:
        "/images/dept/teknologi-rekayasa-konstruksi-bangunan-air.webp",
      stats: { snbp: 30, snbt: 48, mandiri: 31 },
      competition: { snbp: "Rendah", snbt: "Sedang", mandiri: "Sedang" },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Teknologi bangunan air",
        "Teknik irigasi",
        "Konstruksi dan perencanaan air",
        "Operasi dan pemeliharaan infrastruktur air",
      ],
      careers: ["Manajer Konstruksi", "Drafter Bangunan Air", "Surveyor"],
      relatedSubjects: ["FISIKA", "MATEMATIKA"],
      contact: "@its_dtisvokasi",
    },
    {
      name: "Teknologi Rekayasa Manufaktur",
      slug: "teknologi-rekayasa-manufaktur",
      description:
        "Program D4 yang mempersiapkan mahasiswa di bidang otomatisasi industri, robotika, dan pengelasan serta pengendalian sistem manufaktur modern.",
      image:
        "/images/dept/teknologi-rekayasa-manufaktur.webp",
      stats: { snbp: 30, snbt: 48, mandiri: 31 },
      competition: { snbp: "Sedang", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Sistem produksi dan kontrol kualitas",
        "Robotika dan otomasi pabrik",
        "Perawatan mesin industri",
      ],
      careers: [
        "Industri Otomotif",
        "Industri Bioteknologi",
        "Industri Kedirgantaraan",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA"],
      contact: "@its_dtmi",
    },
    {
      name: "Rekayasa Konversi Energi",
      slug: "rekayasa-konversi-energi",
      description:
        "Program D4 yang mempelajari energi terbarukan dari prinsip konversi energi, perancangan sistem, hingga pengembangan teknologi terbaru.",
      image:
        "/images/dept/rekayasa-konversi-energi.webp",
      stats: { snbp: 30, snbt: 48, mandiri: 31 },
      competition: { snbp: "Rendah", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Konversi dan efisiensi energi",
        "Teknologi energi terbarukan",
        "Perancangan mesin energi",
      ],
      careers: [
        "Industri Manufaktur dan Otomasi Konversi Energi",
        "Kontrol Lingkungan",
        "Perancang Sistem Energi Terbarukan",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "KIMIA"],
      contact: "@its_dtmi",
    },
    {
      name: "Teknik Elektro Otomasi",
      slug: "teknik-elektro-otomasi",
      description:
        "Program D4 yang menghasilkan lulusan di bidang teknologi otomasi untuk mendukung industri 4.0 dengan kemampuan leadership.",
      image:
        "/images/dept/teknik-elektro-otomasi.webp",
      stats: { snbp: 35, snbt: 56, mandiri: 45 },
      competition: { snbp: "Sedang", snbt: "Sedang", mandiri: "Sedang" },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Kendali otomasi",
        "Sistem robotika",
        "PLC dan sensor industri",
      ],
      careers: [
        "Automation Engineer",
        "Sales and Application Engineer",
        "Service/Maintenance Engineer",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA"],
      contact: "@its_dteovokasi",
    },
    {
      name: "Teknik Kimia Industri",
      slug: "teknik-kimia-industri",
      description:
        "Departemen yang berfokus pada teknologi rekayasa proses berkelanjutan untuk industri agro, daur ulang, dan maritim.",
      image:
        "/images/dept/teknik-kimia-industri.webp",
      stats: { snbp: 35, snbt: 56, mandiri: 45 },
      competition: { snbp: "Rendah", snbt: "Sedang", mandiri: "Tinggi" },
      accreditation: "Baik",
      asiin: false,
      competencies: ["Teknik proses", "Optimasi produksi", "K3 industri"],
      careers: [
        "Industri Kimia",
        "Industri Pengolahan Makanan dan Minuman",
        "Industri Farmasi",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "KIMIA"],
      contact: "@its_dtki",
    },
    {
      name: "Teknik Instrumentasi",
      slug: "teknik-instrumentasi",
      description:
        "Departemen yang mempelajari instrumentasi dan kontrol sebagai turunan dari teknik fisika untuk kebutuhan industri.",
      image:
        "/images/dept/teknik-instrumentasi.webp",
      stats: { snbp: 35, snbt: 56, mandiri: 45 },
      competition: { snbp: "Rendah", snbt: "Sedang", mandiri: "Sedang" },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Instrumentasi dan kontrol",
        "IoT industri",
        "Komisioning dan perawatan alat ukur",
      ],
      careers: [
        "Instrumentasi Proses",
        "Otomasi Industri",
        "Kontrol Proses",
        "IoT Industri",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA"],
      contact: "@its_teknikinstrumentasi",
    },
    {
      name: "Statistika Bisnis",
      slug: "statistika-bisnis",
      description:
        "Departemen yang fokus pada penerapan statistika di dunia bisnis dan industri seperti peramalan dan riset pasar.",
      image:
        "/images/dept/statistika-bisnis.webp",
      stats: { snbp: 35, snbt: 56, mandiri: 45 },
      competition: { snbp: "Sedang", snbt: "Sedang", mandiri: "Sedang" },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Analisis data dan statistik",
        "Pengambilan keputusan bisnis",
        "Quality control statistika",
      ],
      careers: [
        "Data Analyst",
        "Quality Control",
        "Business Intelligence Analyst",
      ],
      relatedSubjects: ["MATEMATIKA", "EKONOMI"],
      contact: "@dsb_its",
    },
    {
      name: "Analitika Logistik Terapan",
      slug: "analitika-logistik-terapan",
      description:
        "Program studi yang mempelajari analitika data dan pemrograman untuk mengolah big data logistik menjadi business insight.",
      image:
        "/images/dept/analitika-logistik-terapan.webp",
      stats: { snbp: 13, snbt: 20, mandiri: 14 },
      competition: { snbp: "Rendah", snbt: "Rendah", mandiri: "Rendah" },
      accreditation: "Prodi Baru",
      asiin: false,
      competencies: [
        "Manajemen rantai pasok dan logistik",
        "Sistem informasi logistik",
        "Pengolahan data dan pengambilan keputusan",
        "Komputasi data untuk logistik",
      ],
      careers: [
        "Analis Logistik",
        "Procurement Analyst",
        "Supply Chain Analyst",
      ],
      relatedSubjects: ["MATEMATIKA"],
      contact: "@dsb_its",
    },
  ],
};
