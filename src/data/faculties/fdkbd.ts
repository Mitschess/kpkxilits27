import type { Faculty } from "./types";
import { Palette } from "lucide-react";

export const FDKBD: Faculty = {
  id: "fdkbd",
  name: "Fakultas Desain Kreatif dan Bisnis Digital",
  accent: "#a78bfa",
  icon: Palette,
  description: "Desain Produk, Interior, DKV, Manajemen Bisnis",
  departments: [
    {
      name: "Desain Produk Industri",
      slug: "desain-produk-industri",
      description:
        "Departemen yang menekuni bidang desain khususnya pada dunia industri, dengan memanfaatkan kreativitas dan pengetahuan untuk menciptakan gagasan inovatif dalam menyelesaikan permasalahan produk bagi masyarakat.",
      image:
        "/images/dept/desain-produk-industri.webp",
      stats: {
        snbp: 30,
        snbt: 48,
        mandiri: 42,
      },
      competition: {
        snbp: "Rendah",
        snbt: "Sedang",
        mandiri: "Rendah",
      },
      accreditation: "Unggul",
      asiin: false,
      competencies: [
        "Apparel",
        "Furniture",
        "Appliance (apparatus medis dan home appliance)",
        "Transportasi",
      ],
      careers: [
        "Jewelry Designer",
        "Fashion Designer",
        "Furniture Designer",
        "Desainer Peralatan Khusus",
        "Konsultan Designer",
        "Birokrat Industri Kreatif",
      ],
      relatedSubjects: ["Ilmu Sosial", "Seni Rupa", "Bahasa Inggris"],
      contact: "@its_despro",
    },
    {
      name: "Desain Interior",
      slug: "desain-interior",
      description:
        "Departemen yang menekuni bidang perencanaan tata letak dan pengimplementasian konsep desain pada ruang dalam untuk mewujudkan interior yang estetis, nyaman, dan aman.",
      image:
        "/images/dept/desain-interior.webp",
      stats: {
        snbp: 24,
        snbt: 36,
        mandiri: 60,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Rendah",
      },
      accreditation: "A",
      asiin: false,
      competencies: [
        "Desain Interior Arsitektur",
        "Desain Interior Transportasi",
        "Desain Interior Eksibisi",
        "Desain Furniture",
        "Aksesoris Interior",
        "Desain Taman",
      ],
      careers: [
        "Dekorator Interior",
        "Industri Furnitur",
        "Industri Material Arsitektur Interior",
        "Estimator Arsitektur Interior",
        "Home Decor",
        "Art and Culture Researcher",
      ],
      relatedSubjects: ["MATEMATIKA", "FISIKA", "SENI RUPA", "BAHASA INGGRIS"],
      contact: "@interiordesign.its",
    },
    {
      name: "Desain Komunikasi Visual",
      slug: "desain-komunikasi-visual",
      description:
        "Departemen yang menekuni bidang komunikasi yang dikemas dalam bentuk bahasa visual agar pesan dapat diterima dengan metode yang kreatif.",
      image:
        "/images/dept/desain-komunikasi-visual.webp",
      stats: {
        snbp: 32,
        snbt: 48,
        mandiri: 80,
      },
      competition: {
        snbp: "Tinggi",
        snbt: "Tinggi",
        mandiri: "Sedang",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: ["Media Kreatif Digital", "Branding & Komunikasi Strategi"],
      careers: [
        "Konsultan Design",
        "Production House",
        "Ilustrator & Animator",
      ],
      relatedSubjects: [],
      contact: "@dkvits",
    },
    {
      name: "Manajemen Bisnis",
      slug: "manajemen-bisnis",
      description:
        "Program yang dirancang untuk membantu mahasiswa mencapai karir dalam bidang manajemen dan kewirausahaan, serta mempersiapkan pemimpin bisnis masa depan.",
      image:
        "/images/dept/manajemen-bisnis.webp",
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
      accreditation: "Unggul",
      asiin: false,
      competencies: [
        "Manajemen Sumber Daya Manusia",
        "Finance",
        "Marketing",
        "Operation",
      ],
      careers: ["Teknopreneur", "Sociopreneur", "Perpajakan", "Perbankan"],
      relatedSubjects: ["AKUNTANSI", "MATEMATIKA BISNIS"],
      contact: "@mb_its",
    },
    {
      name: "Bisnis Digital",
      slug: "bisnis-digital",
      description:
        "Program studi yang menggabungkan ilmu bisnis dan teknologi digital untuk mencetak lulusan yang mampu beradaptasi dengan ekonomi digital, mencakup e-commerce hingga analisis data.",
      image:
        "/images/dept/bisnis-digital.webp",
      stats: {
        snbp: 12,
        snbt: 18,
        mandiri: 25,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Sedang",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: [],
      careers: [
        "Analis Bisnis Digital",
        "Spesialis Pemasaran Digital",
        "Pengusaha Bisnis Digital",
        "Analis Model Bisnis Digital",
      ],
      relatedSubjects: ["AKUNTANSI", "MATEMATIKA BISNIS"],
      contact: "@mb_its",
    },
    {
      name: "Studi Pembangunan",
      slug: "studi-pembangunan",
      description:
        "Bidang studi yang mempelajari hukum, kebijakan publik, lingkungan, dan ekonomi untuk mengintegrasikan segala bidang demi memajukan pembangunan.",
      image:
        "/images/dept/studi-pembangunan.webp",
      stats: {
        snbp: 27,
        snbt: 54,
        mandiri: 54,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Sedang",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Ekonomi Pembangunan dan Globalisasi",
        "Pemberdayaan Masyarakat",
        "Lingkungan Berkelanjutan",
      ],
      careers: ["Pemerintahan BAPPENAS", "Humas di BUMN", "Sociopreneur"],
      relatedSubjects: ["SOSIOLOGI", "EKONOMI", "MATEMATIKA"],
      contact: "@studipembangunanits",
    },
    {
      name: "Sains Komunikasi",
      slug: "sains-komunikasi",
      description:
        "Bidang yang mempelajari peran dan fungsi komunikasi dalam kehidupan sehari-hari maupun profesional, termasuk pembentukan opini publik dan pertukaran informasi efektif.",
      image:
        "/images/dept/sains-komunikasi.webp",
      stats: {
        snbp: 10,
        snbt: 20,
        mandiri: 18,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Sedang",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Analisis Komunikasi",
        "Praktisi Media",
        "Staf Komunikasi",
        "Asisten riset komunikasi",
      ],
      careers: [
        "Jurnalis",
        "Asisten Peneliti Media",
        "Copywriter",
        "Public Relations Analyst",
      ],
      relatedSubjects: ["BAHASA INDONESIA", "MATEMATIKA"],
      contact: "@sainskomunikasiits",
    },
  ],
};
