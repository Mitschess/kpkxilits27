import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Storage access that never throws (private mode, blocked site data, etc.). */
export const safeStorage = {
  get(store: "local" | "session", key: string): string | null {
    try {
      return (store === "local" ? localStorage : sessionStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(store: "local" | "session", key: string, value: string) {
    try {
      (store === "local" ? localStorage : sessionStorage).setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};
