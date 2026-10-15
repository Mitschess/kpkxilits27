import type { Faculty } from "./types";
import { Beaker } from "lucide-react";

export const FSAD: Faculty = {
  id: "fsad",
  name: "Fakultas Sains dan Analitika Data",
  accent: "#34d399",
  icon: Beaker,
  description: "Matematika, Fisika, Kimia, Biologi, Statistika, Aktuaria",
  departments: [
    {
      name: "Fisika",
      slug: "fisika",
      description:
        "Departemen Fisika ITS mempelajari hukum dasar pengendali alam semesta dan penerapannya dalam teknologi untuk meningkatkan kesejahteraan umat manusia.",
      image:
        "/images/dept/fisika.webp",
      stats: { snbp: 77, snbt: 68, mandiri: 34 },
      competition: { snbp: "Rendah", snbt: "Rendah", mandiri: "Sedang" },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Fisika Material Maju",
        "Instrumentasi",
        "Fisika Teori dan Filsafat",
        "Optoelektronika",
        "Geofisika",
        "Fisika Medis",
      ],
      careers: ["Insinyur", "Ilmuwan", "Akademisi"],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "BIOLOGI", "KIMIA"],
      contact: "@fisika_its",
    },
    {
      name: "Matematika",
      slug: "matematika",
      description:
        "Departemen Matematika ITS berfokus pada matematika murni hingga penerapannya di berbagai bidang termasuk informatika.",
      image: "/images/dept/matematika.webp",
      stats: { snbp: 80, snbt: 80, mandiri: 40 },
      competition: { snbp: "Rendah", snbt: "Rendah", mandiri: "Sedang" },
      accreditation: "Unggul",
      asiin: false,
      competencies: [
        "Analisis Aljabar",
        "Pembelajaran Matematika",
        "Machine Learning dan Big Data",
        "Pemrograman Visual",
        "Pemodelan dan Simulasi",
        "Matematika Industri dan Keuangan",
      ],
      careers: [
        "Financial Banking",
        "Data Analyst",
        "Aktuaris",
        "Operation Research",
        "Industrial Engineer",
        "Programmer",
      ],
      relatedSubjects: ["MATEMATIKA"],
      contact: "@its_matematika",
    },
    {
      name: "Statistika",
      slug: "statistika",
      description:
        "Departemen Statistika ITS mengembangkan statistika dan penerapannya di bidang industri, bisnis, sosial, lingkungan, dan kesehatan.",
      image:
        "/images/dept/statistika.webp",
      stats: { snbp: 40, snbt: 60, mandiri: 100 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Sedang" },
      accreditation: "Unggul",
      asiin: false,
      competencies: [
        "Statistika Bisnis dan Industri",
        "Statistika Sosial dan Kependudukan",
        "Statistika Komputasi dan Sains Data",
        "Statistika Ekonomi dan Finansial",
        "Statistika Lingkungan dan Kesehatan",
        "Statistika Fisika Medis dan Biofisika",
      ],
      careers: [
        "Konsultan Riset",
        "Data Analyst",
        "Quality Assurance",
        "Perbankan",
        "Badan Pusat Statistik",
      ],
      relatedSubjects: ["MATEMATIKA"],
      contact: "@its_statistics",
    },
    {
      name: "Sains Data",
      slug: "sains-data",
      description:
        "Program studi Sains Data ITS berfokus pada machine learning berbasis statistika untuk kontribusi ilmu dan teknologi bertaraf internasional.",
      image:
        "/images/dept/sains-data.webp",
      stats: { snbp: 10, snbt: 15, mandiri: 22 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "Baik Sekali",
      asiin: false,
      competencies: ["Business Intelligence", "Data Analyst", "Data Scientist"],
      careers: [
        "Data Scientist",
        "Business Intelligence Analyst",
        "Data Analyst",
        "Data Engineer",
      ],
      relatedSubjects: ["MATEMATIKA", "FISIKA"],
      contact: "@its_statistics",
    },
    {
      name: "Kimia",
      slug: "kimia",
      description:
        "Departemen Kimia ITS mempelajari mekanisme molekuler organisme hidup melalui perkuliahan dan laboratorium.",
      image:
        "/images/dept/kimia.webp",
      stats: { snbp: 60, snbt: 80, mandiri: 60 },
      competition: { snbp: "Rendah", snbt: "Rendah", mandiri: "Sedang" },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Kimia Fisik",
        "Kimia Organik",
        "Kimia Anorganik",
        "Biokimia",
        "Kimia Analitik",
      ],
      careers: [
        "Lembaga Penelitian",
        "Lembaga Pendidikan",
        "Perminyakan",
        "Pertambangan",
      ],
      relatedSubjects: ["MATEMATIKA", "KIMIA"],
      contact: "@kimia_its",
    },
    {
      name: "Biologi",
      slug: "biologi",
      description:
        "Departemen Biologi ITS meneliti aspek fundamental makhluk hidup serta aplikasi biosains dan bioteknologi.",
      image:
        "/images/dept/biologi.webp",
      stats: { snbp: 36, snbt: 48, mandiri: 36 },
      competition: { snbp: "Rendah", snbt: "Rendah", mandiri: "Rendah" },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Struktur Hewan",
        "Struktur Tumbuhan",
        "Ekologi",
        "Botani",
      ],
      careers: [
        "Bidang Pangan",
        "Kehutanan",
        "Dosen",
        "Pengendalian Lingkungan",
      ],
      relatedSubjects: ["MATEMATIKA", "KIMIA", "BIOLOGI"],
      contact: "@biologi_its",
    },
    {
      name: "Sains Analitik dan Instrumentasi Kimia",
      slug: "sains-analitik-dan-instrumentasi-kimia",
      description:
        "Sains Analitik dan Instrumentasi Kimia merupakan hasil pengembangan dari salah satu bidang keahlian departemen kimia yaitu kimia analitik. Departemen ini mempelajari tentang analisis data dan instrumentasi kimia.",
      image:
        "/images/dept/sains-analitik-dan-instrumentasi-kimia.webp",
      stats: {
        snbp: 18,
        snbt: 24,
        mandiri: 30,
      },
      competition: {
        snbp: "Rendah",
        snbt: "Rendah",
        mandiri: "Rendah",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Analisis dan perancangan",
        "Pembuatan dan pengembangan instrumentasi kimia",
      ],
      careers: ["Scientist", "QC/QA", "RnD", "Entrepreneur"],
      relatedSubjects: ["MATEMATIKA", "KIMIA"],
      contact: "@kimia_its",
    },
    {
      name: "Bioteknologi",
      slug: "bioteknologi",
      description:
        "Departemen Bioteknologi ITS adalah departemen yang mempelajari ilmu tentang rekayasa molekuler bagi makhluk hidup untuk menghasilkan suatu produk berbasis gen di berbagai bidang.",
      image:
        "/images/dept/bioteknologi.webp",
      stats: {
        snbp: 18,
        snbt: 24,
        mandiri: 12,
      },
      competition: {
        snbp: "Rendah",
        snbt: "Rendah",
        mandiri: "Rendah",
      },
      accreditation: "Prodi Baru",
      asiin: true,
      competencies: [
        "Pengembangan berbasis molekuler",
        "Obat-obatan",
        "Perbaikan jaringan",
      ],
      careers: ["Dosen", "Research", "Quality Control"],
      relatedSubjects: ["BIOLOGI"],
      contact: "@bioteknologi_its",
    },
    {
      name: "Aktuaria",
      slug: "aktuaria",
      description:
        "Departemen Aktuaria ITS adalah departemen yang mempelajari ilmu tentang pengelolaan risiko keuangan di masa yang akan datang dengan mengaplikasikan metode matematika dan ilmu statistika.",
      image:
        "/images/dept/aktuaria.webp",
      stats: {
        snbp: 24,
        snbt: 36,
        mandiri: 60,
      },
      competition: {
        snbp: "Tinggi",
        snbt: "Tinggi",
        mandiri: "Sedang",
      },
      accreditation: "Prodi Baru",
      asiin: true,
      competencies: [
        "Aktuaria bencana",
        "Aktuaria kesehatan",
        "Aktuaria syariah",
      ],
      careers: ["Aktuaris", "Ekonom", "Auditor", "Financial Analyst"],
      relatedSubjects: ["MATEMATIKA"],
      contact: "@its_aktuaria",
    },
  ],
};
