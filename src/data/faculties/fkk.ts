import type { Faculty } from "./types";
import { HeartPulse } from "lucide-react";

export const FKK: Faculty = {
  id: "fkk",
  name: "Fakultas Kedokteran dan Kesehatan",
  accent: "#43bea9",
  icon: HeartPulse,
  description: "Kedokteran, Teknologi Kesehatan",
  departments: [
    {
      name: "Kedokteran",
      slug: "kedokteran",
      description:
        "Program studi yang fokus mencetak dokter profesional untuk memenuhi kebutuhan tenaga medis dengan mengedepankan nilai mandiri, profesional, transparan, dan humanis.",
      image:
        "/images/dept/kedokteran.webp",
      stats: {
        snbp: 10,
        snbt: 15,
        mandiri: 25,
      },
      competition: {
        snbp: "Tinggi",
        snbt: "Tinggi",
        mandiri: "Tinggi",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: ["Dokter"],
      careers: [
        "Kedokteran umum",
        "Kedokteran Spesialis",
        "Kesehatan masyarakat",
        "Dokter Industri",
        "Dokter Forensik",
        "Manajemen rumah sakit",
        "Profesor",
        "Dosen",
      ],
      relatedSubjects: ["BIOLOGI", "FISIKA", "KIMIA"],
      contact: "@kedokteran_its",
    },
    {
      name: "Teknologi Kedokteran",
      slug: "teknologi-kedokteran",
      description:
        "Mempelajari desain alat kesehatan dengan menggabungkan ilmu kedokteran dan teknik guna merespon kebutuhan alat kedokteran dalam negeri.",
      image:
        "/images/dept/teknologi-kedokteran.webp",
      stats: {
        snbp: 24,
        snbt: 36,
        mandiri: 60,
      },
      competition: {
        snbp: "Sedang",
        snbt: "Tinggi",
        mandiri: "Tinggi",
      },
      accreditation: "Baik",
      asiin: false,
      competencies: [
        "Kedokteran dasar",
        "Desain produk",
        "Teknik informatika",
        "Teknik elektro",
      ],
      careers: ["Engineer bidang kedokteran", "Peneliti", "Membentuk start up"],
      relatedSubjects: ["BIOLOGI", "FISIKA", "KIMIA", "MATEMATIKA"],
      contact: "@teknologi_kedokteran",
    },
  ],
};
