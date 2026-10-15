import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Instagram, Menu, X } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { INSTAGRAM_URL } from "@/data/home";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Beranda", to: "/" },
  { label: "Acara", to: "/#acara" },
  { label: "Fakultas", to: "/#fakultas" },
  { label: "Kabinet", to: "/kabinet" },
  { label: "Ranking", to: "/ranking" },
  { label: "Buku Tamu", to: "/guestbook" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="KPK × Ini Lho ITS! 2026 — Beranda">
      <img src="/images/logo/hero.webp" alt="" className="h-10 w-10 scale-[1.35] object-contain" />
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight text-paper">KPK</span>
        <span className="eyebrow block text-[0.6rem] text-lantern">× ILITS 2026</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();
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
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full py-2 pr-2 pl-4 transition-all duration-500",
            scrolled || open ? "glass shadow-[0_10px_40px_-12px_rgb(0_0_0/0.6)]" : "border border-transparent",
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <NavLink
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2 text-sm font-medium text-paper/75 transition hover:bg-paper/[0.07] hover:text-paper",
                      isActive && !l.to.includes("#") && "bg-paper/[0.08] text-paper",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("lantern", "hidden px-5 py-2.5 text-sm sm:inline-flex")}
            >
              <Instagram size={16} /> Ikuti kami
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className="grid h-11 w-11 place-items-center rounded-full bg-paper/[0.07] text-paper ring-1 ring-paper/10 transition hover:bg-paper/15 lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-night-950/96 px-6 pt-28 pb-10 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(circle at 80% 10%, rgb(255 178 63 / 0.18), transparent 50%)" }}
            />
            <ul className="relative space-y-1">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-paper/10 py-4 font-display text-4xl font-semibold tracking-tight text-paper"
                  >
                    <span className="eyebrow text-lantern/80">0{i + 1}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("lantern", "relative mt-auto w-full")}
            >
              <Instagram size={18} /> Ikuti @kpk.2026 <ArrowUpRight size={18} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
