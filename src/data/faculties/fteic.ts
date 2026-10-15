import type { Faculty } from "./types";
import { Cpu } from "lucide-react";

export const FTEIC: Faculty = {
  id: "fteic",
  name: "Fakultas Teknologi Elektro dan Informatika Cerdas",
  accent: "#faca47",
  icon: Cpu,
  description:
    "Elektro, Informatika, Sistem Informasi, Biomedik, Komputer, Jaringan",
  departments: [
    {
      name: "Teknik Elektro",
      slug: "teknik-elektro",
      description:
        "Bidang ilmu yang mempelajari aplikasi kelistrikan, elektronika, dan elektromagnet untuk inovasi di bidang energi, lingkungan, dan kedokteran.",
      image:
        "/images/dept/teknik-elektro.webp",
      stats: { snbp: 48, snbt: 72, mandiri: 120 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "Unggul",
      asiin: true,
      competencies: ["Teknik Sistem Tenaga", "Elektronika", "Sistem Kontrol"],
      careers: [
        "BUMN/BUMD",
        "Instansi Pemerintah",
        "Perusahaan Swasta Nasional/Internasional",
        "Wirausaha",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "KIMIA"],
      contact: "@elektro_its",
    },
    {
      name: "Teknik Telekomunikasi",
      slug: "teknik-telekomunikasi",
      description:
        "Menghasilkan lulusan dengan kompetensi tinggi di bidang teknik telekomunikasi dan pengembangan keilmuan melalui penelitian.",
      image:
        "/images/dept/teknik-telekomunikasi.webp",
      stats: { snbp: 16, snbt: 24, mandiri: 40 },
      competition: { snbp: "Sedang", snbt: "Sedang", mandiri: "Rendah" },
      accreditation: "Baik Sekali",
      asiin: false,
      competencies: [
        "Pengolahan Sinyal",
        "Rekayasa Elektronika Telekomunikasi",
        "Rekayasa Jaringan Telekomunikasi",
        "Manajemen Teknologi Telekomunikasi",
      ],
      careers: [
        "Antenna Engineer",
        "Radar Engineer",
        "Broadcasting Engineer",
        "Project Manager",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "KIMIA"],
      contact: "@telecom.its",
    },
    {
      name: "Teknik Biomedik",
      slug: "teknik-biomedik",
      description:
        "Bidang multidisiplin yang mengintegrasikan teknik dengan kedokteran dan perawatan kesehatan.",
      image:
        "/images/dept/teknik-biomedik.webp",
      stats: { snbp: 24, snbt: 36, mandiri: 60 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Intelligent Biomedical Instrumentation",
        "Assistive Technology",
        "Biomedical Imaging",
        "Medical Informatics",
      ],
      careers: [
        "Insinyur Biomedis",
        "Insinyur Klinis",
        "Insinyur Rehabilitasi",
        "Akademisi",
      ],
      relatedSubjects: ["BIOLOGI", "MATEMATIKA"],
      contact: "@hmtb_its",
    },
    {
      name: "Teknik Komputer",
      slug: "teknik-komputer",
      description:
        "Memadukan software dan hardware untuk sistem komputasi modern.",
      image:
        "/images/dept/teknik-komputer.webp",
      stats: { snbp: 24, snbt: 42, mandiri: 54 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Sedang" },
      accreditation: "A",
      asiin: true,
      competencies: ["Multimedia", "IoT", "Robotika"],
      careers: [
        "Embedded Engineer",
        "IoT Engineer",
        "System/Network Administrator",
        "Programmer Aplikasi",
      ],
      relatedSubjects: ["MATEMATIKA", "FISIKA"],
      contact: "@computer_its",
    },
    {
      name: "Teknik Informatika",
      slug: "teknik-informatika",
      description:
        "Mempelajari pemrosesan informasi dan rekayasa sistem dengan fokus interaksi manusia dan teknologi.",
      image:
        "/images/dept/teknik-informatika.webp",
      stats: { snbp: 60, snbt: 84, mandiri: 96 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "A",
      asiin: true,
      competencies: [
        "Rekayasa Perangkat Lunak",
        "Komputasi Cerdas",
        "Grafika & Interaksi",
        "Manajemen Informasi",
        "Jaringan & Keamanan Siber",
      ],
      careers: [
        "System Analyst",
        "Database Expert",
        "IT Consultant",
        "Data Scientist",
        "Startup Founder",
      ],
      relatedSubjects: ["MATEMATIKA", "INFORMATIKA"],
      contact: "@its_informatics",
    },
    {
      name: "Rekayasa Kecerdasan Artifisial",
      slug: "rekayasa-kecerdasan-artifisial",
      description:
        "Mengembangkan sistem yang meniru kemampuan manusia dalam berpikir dan belajar.",
      image:
        "/images/dept/rekayasa-kecerdasan-artifisial.webp",
      stats: { snbp: 13, snbt: 18, mandiri: 20 },
      competition: { snbp: "Sedang", snbt: "Sedang", mandiri: "Sedang" },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Machine Learning",
        "Computer Vision",
        "Data Intelligence",
      ],
      careers: ["AI Engineer", "Data Analyst", "Computer Vision Engineer"],
      relatedSubjects: ["FISIKA", "MATEMATIKA"],
      contact: "@its_informatics",
    },
    {
      name: "Rekayasa Perangkat Lunak",
      slug: "rekayasa-perangkat-lunak",
      description:
        "Fokus pada desain, pengembangan, pengujian, dan manajemen proyek perangkat lunak.",
      image:
        "/images/dept/rekayasa-perangkat-lunak.webp",
      stats: { snbp: 13, snbt: 18, mandiri: 20 },
      competition: { snbp: "Sedang", snbt: "Sedang", mandiri: "Sedang" },
      accreditation: "Baik",
      asiin: false,
      competencies: ["Software Development", "Testing", "DevOps"],
      careers: [
        "Frontend Developer",
        "Backend Developer",
        "DevOps Engineer",
        "QA Engineer",
      ],
      relatedSubjects: ["MATEMATIKA"],
      contact: "@its_informatics",
    },
    {
      name: "Sistem Informasi",
      slug: "sistem-informasi",
      description:
        "Mengembangkan dan mengelola sistem informasi serta pemodelan proses bisnis.",
      image:
        "/images/dept/sistem-informasi.webp",
      stats: { snbp: 42, snbt: 63, mandiri: 105 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Tinggi" },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Keamanan TI",
        "Manajemen Sistem Informasi",
        "Rekayasa Data",
        "Sistem Enterprise",
      ],
      careers: ["Business Analyst", "Systems Analyst", "Project Manager"],
      relatedSubjects: ["MATEMATIKA"],
      contact: "@sisteminformasiits",
    },
    {
      name: "Inovasi Digital",
      slug: "inovasi-digital",
      description:
        "Menciptakan dan mengkomersialkan produk digital secara multidisiplin.",
      image:
        "/images/dept/inovasi-digital.webp",
      stats: { snbp: 10, snbt: 15, mandiri: 25 },
      competition: { snbp: "Sedang", snbt: "Sedang", mandiri: "Sedang" },
      accreditation: "Baik",
      asiin: false,
      competencies: ["Lean Startup", "MVP", "Bisnis Digital"],
      careers: ["Digital Entrepreneur", "Product Creator", "Growth Hacker"],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "INFORMATIKA"],
      contact: "@indig_its",
    },
    {
      name: "Teknologi Informasi",
      slug: "teknologi-informasi",
      description: "Fokus pada keamanan siber, IoT, dan smart city.",
      image:
        "/images/dept/teknologi-informasi.webp",
      stats: { snbp: 34, snbt: 50, mandiri: 65 },
      competition: { snbp: "Tinggi", snbt: "Tinggi", mandiri: "Sedang" },
      accreditation: "Baik Sekali",
      asiin: false,
      competencies: ["Keamanan Siber", "Keamanan Aplikasi", "Integrasi Sistem"],
      careers: ["Network Administrator", "Cloud Architect", "IT Consultant"],
      relatedSubjects: ["INFORMATIKA"],
      contact: "@informationtechnology.its",
    },
  ],
};
