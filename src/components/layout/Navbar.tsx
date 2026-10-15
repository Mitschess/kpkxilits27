import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, House, Info, Instagram, Landmark, Menu, MessageSquareHeart, Trophy, Users, X, type LucideIcon } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { INSTAGRAM_URL } from "@/data/home";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";

// `section` links point into the home page and light up while that part is on screen.
const LINKS: { label: string; to: string; icon: LucideIcon; section?: string }[] = [
  { label: "Tentang", to: "/#tentang", icon: Info, section: "tentang" },
  { label: "Fakultas", to: "/fakultas", icon: Landmark },
  { label: "Kabinet", to: "/kabinet", icon: Users },
  { label: "Ranking TOSN", to: "/ranking", icon: Trophy },
  { label: "Buku Tamu", to: "/guestbook", icon: MessageSquareHeart },
];
const MOBILE_LINKS = [{ label: "Beranda", to: "/", icon: House }, ...LINKS];
const MENU_COLORS = ["#ffc93c", "#2f5bea", "#ff4fa3", "#1fbf9a", "#ff8a3d", "#9b7bff"];

// Which nav item a home-page section belongs to (others light nothing up)
const SECTION_OWNER: Record<string, string> = { tentang: "tentang", filosofi: "tentang" };
const WATCHED = ["beranda", "tentang", "filosofi", "acara", "kalkulator", "mitos", "galeri"];

/** Scroll-spy for the home page: which nav section is in the middle of the screen. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let io: IntersectionObserver | undefined;
    // wait a frame so the page's sections are in the DOM
    const frame = requestAnimationFrame(() => {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) setActive(SECTION_OWNER[e.target.id] ?? null);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      WATCHED.forEach((id) => {
        const el = document.getElementById(id);
        if (el) io!.observe(el);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      setActive(null);
    };
  }, [enabled]);

  return active;
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="KPK × Ini Lho ITS! 2026 — Beranda">
      <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-white ring-2 ring-ink/10">
        <img src="/images/logo/hero.webp" alt="" className="h-full w-full scale-[1.45] object-contain" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-extrabold tracking-tight text-ink">KPK</span>
        <span className="eyebrow block text-[0.6rem] text-its">× Ini Lho ITS!</span>
      </span>
    </Link>
  );
}

// flat pill: equal space above and below the label
const linkClass = (active: boolean) =>
  cn(
    "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition",
    active ? "bg-its text-white" : "text-ink/75 hover:bg-ink/[0.07] hover:text-ink",
  );

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();
  const activeSection = useActiveSection(pathname === "/");
  useScrollLock(open);

  // glass after leaving the top; tuck away while scrolling down, return on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 500 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation (render-time reset avoids an extra effect pass)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out-expo md:px-6 md:pt-4",
          hidden && !open && "-translate-y-[120%]",
        )}
      >
        <nav
          aria-label="Navigasi utama"
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full py-2 pr-2 pl-4 transition-all duration-500",
            // blends into the page at the very top, becomes a white pill once you scroll
            scrolled || open
              ? "bg-white/90 shadow-[0_4px_0_rgb(27_31_59/0.08),0_18px_40px_-20px_rgb(27_31_59/0.35)] ring-2 ring-ink/10 backdrop-blur-md"
              : "ring-2 ring-transparent",
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = l.section ? activeSection === l.section : pathname === l.to;
              return (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass(active)} aria-current={active ? (l.section ? "location" : "page") : undefined}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              // flat inside the pill: the usual button ledge would make the gap below look smaller
              className="hidden h-11 items-center gap-2 rounded-full bg-sun px-5 text-sm font-bold text-ink ring-2 ring-sun-dark/30 transition hover:bg-[#ffd75e] sm:inline-flex"
            >
              <Instagram size={16} /> Ikuti kami
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink ring-2 ring-ink/10 transition lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="dots fixed inset-0 z-40 flex flex-col overflow-y-auto bg-cream px-6 pt-28 pb-10 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="relative space-y-1">
              {MOBILE_LINKS.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 border-b-2 border-dashed border-ink/10 py-3 font-display text-3xl font-extrabold tracking-tight text-ink"
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-lg"
                      style={{ background: `${MENU_COLORS[i % MENU_COLORS.length]}33` }}
                      aria-hidden="true"
                    >
                      <l.icon size={20} strokeWidth={2.25} />
                    </span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("sun", "relative mt-8 w-full")}
            >
              <Instagram size={18} /> Ikuti @kpk.2026 <ArrowUpRight size={18} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
