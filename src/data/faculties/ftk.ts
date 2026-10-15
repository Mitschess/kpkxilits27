import type { Faculty } from "./types";
import { Anchor } from "lucide-react";

export const FTK: Faculty = {
  id: "ftk",
  name: "Fakultas Teknologi Kelautan",
  accent: "#4fa3ff",
  icon: Anchor,
  description: "Perkapalan, Kelautan, Transportasi Laut",
  departments: [
    {
      name: "Teknik Perkapalan",
      slug: "teknik-perkapalan",
      description:
        "Pelopor ilmu kemaritiman yang mempelajari desain pembangunan kapal, sistem transportasi, hingga operasi bisnis armada laut.",
      image:
        "/images/dept/teknik-perkapalan.webp",
      stats: {
        snbp: 24,
        snbt: 54,
        mandiri: 42,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Tinggi",
        mandiri: "Tinggi",
      },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Desain Kapal",
        "Hidrodinamika",
        "Konstruksi dan Kekuatan Kapal",
        "Teknologi dan Manajemen Produksi Kapal",
      ],
      careers: [
        "Naval Architect",
        "Marine Engineer",
        "QA/QC Engineer",
        "Welding Inspector",
        "Structural Engineer",
      ],
      relatedSubjects: ["FISIKA", "KIMIA", "MATEMATIKA"],
      contact: "@teknikperkapalan.its",
    },
    {
      name: "Teknik Sistem Perkapalan",
      slug: "teknik-sistem-perkapalan",
      description:
        "Mempelajari perancangan instalasi, manajerial, serta perawatan dan perbaikan instalasi kapal maupun bangunan lepas pantai.",
      image:
        "/images/dept/teknik-sistem-perkapalan.webp",
      stats: {
        snbp: 28,
        snbt: 63,
        mandiri: 49,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Tinggi",
        mandiri: "Sedang",
      },
      accreditation: "Unggul",
      asiin: false,
      competencies: [
        "Listrik Kapal dan Otomasi",
        "Mesin Fluida dan Sistem",
        "Keandalan dan Keselamatan Sistem",
        "Mesin Kapal dan Getaran",
      ],
      careers: [
        "Surveyor Sistem Perkapalan",
        "Perancang dan Konsultan",
        "Perekayasa Produksi",
        "Akademisi dan Peneliti",
      ],
      relatedSubjects: ["FISIKA", "KIMIA", "MATEMATIKA"],
      contact: "@its_siskal",
    },
    {
      name: "Teknik Kelautan",
      slug: "teknik-kelautan",
      description:
        "Berfokus pada desain, konstruksi, dan pemeliharaan struktur pantai serta lepas pantai, serta konservasi energi dan lingkungan laut.",
      image:
        "/images/dept/teknik-kelautan.webp",
      stats: {
        snbp: 24,
        snbt: 54,
        mandiri: 42,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Tinggi",
        mandiri: "Sedang",
      },
      accreditation: "Unggul",
      asiin: false,
      competencies: [
        "Hidrodinamika Bangunan Laut",
        "Energi dan Lingkungan Laut",
        "Infrastruktur Pantai dan Pelabuhan",
      ],
      careers: [
        "Structure Engineer",
        "Field Engineer",
        "Project Engineer",
        "Design Engineer",
      ],
      relatedSubjects: ["FISIKA", "KIMIA", "MATEMATIKA"],
      contact: "@teknikkelautan_its",
    },
    {
      name: "Teknik Lepas Pantai",
      slug: "teknik-lepas-pantai",
      description:
        "Mempelajari rekayasa lepas pantai untuk eksplorasi sumber daya alam seperti minyak, gas bumi, dan mineral di laut dalam.",
      image:
        "/images/dept/teknik-lepas-pantai.webp",
      stats: {
        snbp: 16,
        snbt: 36,
        mandiri: 28,
      },
      competition: {
        snbp: "Rendah",
        snbt: "Rendah",
        mandiri: "Sedang",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Teknologi Konstruksi Bangunan Lepas Pantai",
        "Teknologi Dasar Laut dan Pipa Penyalur",
        "Robotika Lepas Pantai",
      ],
      careers: [
        "Akademisi",
        "Industri Offshore",
        "Project Management",
        "Consultant Offshore",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "BAHASA INGGRIS"],
      contact: "@tlp_its",
    },
    {
      name: "Teknik Transportasi Laut",
      slug: "teknik-transportasi-laut",
      description:
        "Mempelajari manajerial dan operasional kapal mencakup ekonomi, perencanaan jaringan, armada, dan teknologi rekayasa transportasi laut.",
      image:
        "/images/dept/teknik-transportasi-laut.webp",
      stats: {
        snbp: 16,
        snbt: 36,
        mandiri: 28,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Sedang",
        mandiri: "Sedang",
      },
      accreditation: "Unggul",
      asiin: true,
      competencies: [
        "Perencanaan Pelabuhan",
        "Manajemen Pelayaran",
        "Logistik Maritim",
      ],
      careers: [
        "Shipping dan Maritim Logistik",
        "Perusahaan Pelayaran",
        "Kepelabuhanan",
        "Freight Forwarder",
      ],
      relatedSubjects: ["FISIKA", "MATEMATIKA", "EKONOMI"],
      contact: "@seatrans_its",
    },
  ],
};
