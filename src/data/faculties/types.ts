import type { LucideIcon } from "lucide-react";

export type Competition = "Rendah" | "Sedang" | "Tinggi";

export interface Department {
  name: string;
  slug: string;
  description: string;
  /** Local path (/images/dept/...) or remote URL */
  image: string;
  /** Student quota per admission track */
  stats: {
    snbp: number;
    snbt: number;
    mandiri: number;
  };
  competition: {
    snbp: Competition;
    snbt: Competition;
    mandiri: Competition;
  };
  /** e.g. "Unggul", "A (LAMSAMA)" */
  accreditation: string;
  /** International (ASIIN) accreditation */
  asiin: boolean;
  competencies: string[];
  careers: string[];
  relatedSubjects: string[];
  /** Instagram handle */
  contact: string;
}

export interface Faculty {
  id: string;
  name: string;
  /** Hex accent used for the faculty's glow */
  accent: string;
  icon: LucideIcon;
  description: string;
  departments: Department[];
}
