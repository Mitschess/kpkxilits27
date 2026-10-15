import { cn } from "@/lib/utils";

// Chunky "pop" buttons: a solid darker ledge underneath that squashes when pressed.
const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-bold transition-all duration-200 ease-bounce hover:-translate-y-0.5 active:translate-y-[3px] disabled:pointer-events-none disabled:opacity-50";

const VARIANTS = {
  sun: "bg-sun text-ink shadow-[0_5px_0_#e5a500] hover:shadow-[0_7px_0_#e5a500] active:shadow-[0_2px_0_#e5a500]",
  blue: "bg-its text-white shadow-[0_5px_0_#1d3fb5] hover:shadow-[0_7px_0_#1d3fb5] active:shadow-[0_2px_0_#1d3fb5]",
  pink: "bg-pink text-white shadow-[0_5px_0_#db2b81] hover:shadow-[0_7px_0_#db2b81] active:shadow-[0_2px_0_#db2b81]",
  white:
    "bg-white text-ink ring-2 ring-ink/10 shadow-[0_5px_0_rgb(27_31_59/0.14)] hover:shadow-[0_7px_0_rgb(27_31_59/0.14)] active:shadow-[0_2px_0_rgb(27_31_59/0.14)]",
};

export function buttonClass(variant: keyof typeof VARIANTS = "sun", className?: string) {
  return cn(BASE, VARIANTS[variant], className);
}
