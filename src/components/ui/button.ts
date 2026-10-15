import { cn } from "@/lib/utils";

const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS = {
  /** glowing lantern-amber call to action */
  lantern:
    "bg-gradient-to-b from-gold to-lantern text-night-950 shadow-[0_0_0_1px_rgb(255_215_106/0.7),0_12px_40px_-10px_rgb(255_178_63/0.8)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgb(255_215_106/0.9),0_18px_50px_-8px_rgb(255_178_63/0.95)]",
  ghost: "border border-paper/20 text-paper hover:border-paper/45 hover:bg-paper/[0.06]",
  dark: "bg-night-950 text-paper ring-1 ring-paper/10 hover:bg-night-800 hover:ring-paper/25",
};

export function buttonClass(variant: keyof typeof VARIANTS = "lantern", className?: string) {
  return cn(BASE, VARIANTS[variant], className);
}
