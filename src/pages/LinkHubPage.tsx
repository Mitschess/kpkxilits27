import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Instagram, Landmark, Music2, ShoppingBag, Trophy, Users, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import Clouds from "@/components/deco/Clouds";
import Road from "@/components/deco/Road";
import Townscape from "@/components/deco/Townscape";
import { INSTAGRAM_URL } from "@/data/home";
import { usePageTitle } from "@/hooks/usePageTitle";

const TIKTOK_URL = "https://www.tiktok.com/@kpk.2026";
const TIKTOK_EMBED_URL = "https://www.tiktok.com/embed/@kpk.2026";
const INSTAGRAM_EMBED_URL = `${INSTAGRAM_URL}/embed/`;
const shortcutListVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.08, staggerChildren: 0.14 } },
};
const shortcutItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
};

const SHORTCUTS: { title: string; to: string; icon: LucideIcon; glow: string; tone: string }[] = [
  {
    title: "Fakultas",
    to: "/fakultas",
    icon: Landmark,
    glow: "#2f5bea",
    tone: "border-its/35 bg-its-light text-its-dark shadow-[0_4px_0_rgb(47_91_234/0.2)] hover:bg-[#d2ddff]",
  },
  {
    title: "Kabinet",
    to: "/kabinet",
    icon: Users,
    glow: "#ff4fa3",
    tone: "border-pink/40 bg-pink-light text-pink-dark shadow-[0_4px_0_rgb(255_79_163/0.2)] hover:bg-[#ffd5e8]",
  },
  {
    title: "Ranking TOSN",
    to: "/ranking",
    icon: Trophy,
    glow: "#ffc93c",
    tone: "border-sun-dark/40 bg-sun-light text-[#956000] shadow-[0_4px_0_rgb(229_165_0/0.22)] hover:bg-[#ffe9a1]",
  },
  {
    title: "Merchandise",
    to: "/merch",
    icon: ShoppingBag,
    glow: "#ff8a3d",
    tone: "border-orange/45 bg-orange-light text-[#b84813] shadow-[0_4px_0_rgb(255_138_61/0.22)] hover:bg-[#ffd0ad]",
  },
];

export default function LinkHubPage() {
  usePageTitle("Link Hub");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <div>
      <section
        aria-label="Tautan Kampus Pulang Kampung"
        className="relative isolate flex min-h-[100svh] items-center justify-center px-5 py-3 sm:px-6"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#b9e5ff] via-[#fff8ec] to-[#ffe4d1]" />
          <div className="dots-light absolute inset-0 opacity-40" />
          <div className="absolute -top-28 -right-24 h-96 w-96 rounded-full bg-its/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-pink/15 blur-3xl" />
          <Clouds className="absolute inset-0" count={7} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-lg">
          <div
            className="card relative flex flex-col rounded-[2rem] p-4 pb-6 ring-1 ring-white/60 sm:p-6 sm:pb-8"
            style={{
              minHeight: "min(36rem, calc(100svh - 1.5rem))",
              backgroundColor: "rgba(255, 255, 255, 0.76)",
              backdropFilter: "blur(12px) saturate(0.9)",
              WebkitBackdropFilter: "blur(12px) saturate(0.9)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden="true">
              <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-sun-light/25 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-light/25 blur-3xl" />
            </div>

            <div className="relative mb-8 flex flex-col items-center">
              <div className="relative h-40 w-40 sm:h-44 sm:w-44">
                <div className="absolute inset-4 rounded-full bg-white/80 blur-xl" aria-hidden="true" />
                <img
                  src="/images/logo/hero.webp"
                  alt="Kampus Pulang Kampung × Ini Lho ITS!"
                  className="relative h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(27,31,59,0.2)]"
                />
              </div>
              <span className="-mt-1 inline-flex items-center gap-2 rounded-full border border-white/60 bg-its px-4 py-1.5 text-xs font-extrabold tracking-[0.16em] text-white shadow-[0_4px_0_#1d3fb5]">
                LINK HUB
              </span>
            </div>

            <motion.div
              className="relative grid grid-cols-1 gap-2.5"
              variants={shortcutListVariants}
              initial="hidden"
              animate="visible"
              onPointerOver={(event) => {
                const target = (event.target as HTMLElement).closest<HTMLElement>("[data-preview-key]");
                setHoveredLink(target?.dataset.previewKey ?? null);
              }}
              onPointerLeave={() => setHoveredLink(null)}
            >
              {SHORTCUTS.map(({ title, to, icon: Icon, glow, tone }) => (
                <motion.div
                  key={to}
                  className="relative"
                  variants={shortcutItemVariants}
                >
                  <HologramPreview open={hoveredLink === to} label={title} detail={to} color={glow} icon={Icon} src={to} />
                  <Link
                    to={to}
                    data-preview-key={to}
                    onFocus={() => setHoveredLink(to)}
                    onBlur={() => setHoveredLink(null)}
                    style={hoveredLink === to ? { borderColor: glow, boxShadow: `0 0 22px ${glow}55` } : undefined}
                    className={`group relative flex min-h-14 items-center justify-center rounded-2xl border-2 px-6 py-3 font-display text-base font-extrabold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_rgb(27_31_59/0.12)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-its ${tone}`}
                  >
                    {title}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="min-h-6 flex-1" aria-hidden="true" />
              <div className="border-t border-ink/10" aria-hidden="true" />
              <div className="min-h-6 flex-1" aria-hidden="true" />
              <div className="flex shrink-0 items-center justify-center gap-7 text-ink-soft/70">
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredLink("tiktok")}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <HologramPreview
                    open={hoveredLink === "tiktok"}
                    label="TikTok"
                    detail="@kpk.2026"
                    color="#1b1f3b"
                    icon={Music2}
                    src={TIKTOK_EMBED_URL}
                  />
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok KPK x ILITS"
                    onFocus={() => setHoveredLink("tiktok")}
                    onBlur={() => setHoveredLink(null)}
                    style={hoveredLink === "tiktok" ? { filter: "drop-shadow(0 0 8px #1b1f3b88)" } : undefined}
                    className="block rounded-full p-1 transition duration-200 hover:-translate-y-0.5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-its"
                  >
                    <TikTokIcon />
                  </a>
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredLink("instagram")}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <HologramPreview
                    open={hoveredLink === "instagram"}
                    label="Instagram"
                    detail="@kpk.2026"
                    color="#ff4fa3"
                    icon={Instagram}
                    src={INSTAGRAM_EMBED_URL}
                  />
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram KPK x ILITS"
                    onFocus={() => setHoveredLink("instagram")}
                    onBlur={() => setHoveredLink(null)}
                    style={hoveredLink === "instagram" ? { filter: "drop-shadow(0 0 8px #ff4fa388)" } : undefined}
                    className="block rounded-full p-1 transition duration-200 hover:-translate-y-0.5 hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                  >
                    <Instagram size={25} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Townscape className="absolute inset-x-0 bottom-14 z-0 h-[120px] md:h-[190px]" />
        <Road className="absolute inset-x-0 bottom-0 z-0" />
      </section>
    </div>
  );
}

function TikTokIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.75 4.08 1.12 1.1 2.65 1.61 4.16 1.75v3.95c-1.42-.05-2.86-.34-4.16-.96-.57-.25-1.1-.57-1.62-.91-.01 2.77.01 5.54-.02 8.3-.07 1.37-.52 2.72-1.32 3.84-1.29 1.86-3.53 3.07-5.8 3.11-1.39.08-2.79-.3-3.95-1.07-1.92-1.26-3.24-3.48-3.26-5.8-.12-1.35.24-2.7.92-3.87 1.1-1.96 3.18-3.31 5.42-3.5.21-.03.42-.02.63-.02.02 1.4-.04 2.81-.04 4.21-.94-.05-1.9.22-2.57.88-.5.45-.88 1.04-.98 1.72-.22 1.14.23 2.37 1.1 3.13.83.73 2.03 1.02 3.1.76 1.06-.23 1.95-1 2.33-2.02.13-.37.19-.76.18-1.15V.02z" />
    </svg>
  );
}

function HologramPreview({
  open,
  label,
  detail,
  color,
  icon: Icon,
  src,
  miniaturize = true,
}: {
  open: boolean;
  label: string;
  detail: string;
  color: string;
  icon: LucideIcon;
  src?: string;
  miniaturize?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 z-40 w-[20rem] max-w-[calc(100vw-3rem)] -translate-x-1/2 pb-3"
          style={{ perspective: 900 }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.78, rotateX: 35 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 12, scale: 0.82, rotateX: 25 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="origin-bottom"
          >
            <div
              className="overflow-hidden rounded-2xl border-2 bg-ink text-white"
              style={{ borderColor: color, boxShadow: `0 0 28px ${color}88, inset 0 0 22px ${color}2a` }}
            >
              <div className="flex h-8 items-center gap-1.5 border-b border-white/10 bg-ink/95 px-3">
                <span className="h-2 w-2 rounded-full bg-pink" />
                <span className="h-2 w-2 rounded-full bg-sun" />
                <span className="h-2 w-2 rounded-full bg-mint" />
                <span className="ml-2 min-w-0 truncate font-mono text-[0.62rem] text-white/65">{detail}</span>
              </div>
              <div className={`relative overflow-hidden bg-white ${miniaturize ? "aspect-[5/3]" : "h-[13.5rem]"}`}>
                {src ? (
                  <MiniPagePreview src={src} label={label} miniaturize={miniaturize} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#fff4fa] via-white to-[#fff1e6] text-ink">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink to-orange text-white shadow-lg">
                      <Icon size={30} strokeWidth={2.3} />
                    </span>
                    <span className="mt-3 font-display text-lg font-extrabold">{label}</span>
                    <span className="mt-1 font-mono text-sm text-ink-soft">{detail}</span>
                    <span className="mt-2 text-xs text-ink-soft">Buka profil di tab baru</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:100%_5px] opacity-30" />
                <motion.div
                  animate={{ y: ["-120%", "240%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 blur-md"
                  style={{ background: `linear-gradient(to bottom, transparent, ${color}66, transparent)` }}
                />
              </div>
              <div className="flex h-7 items-center justify-between bg-ink/95 px-3 font-mono text-[0.58rem] tracking-wider text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: color }} />
                  {src ? "LIVE PAGE PREVIEW" : "PROFILE PREVIEW"}
                </span>
                <span>{label}</span>
              </div>
            </div>
            <motion.div
              animate={{ opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mx-auto h-5 w-16 blur-[2px]"
              style={{ background: `linear-gradient(to top, ${color}cc, transparent)`, clipPath: "polygon(0 0, 100% 0, 62% 100%, 38% 100%)" }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MiniPagePreview({ src, label, miniaturize }: { src: string; label: string; miniaturize: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !miniaturize) return;

    const resize = () => setScale(frame.clientWidth / 1440);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [miniaturize]);

  return (
    <div ref={frameRef} className={miniaturize ? "relative aspect-[5/3] w-full overflow-hidden bg-white" : "relative h-full w-full overflow-hidden bg-white"}>
      <iframe
        src={src}
        title={`Pratinjau mini ${label}`}
        className={miniaturize ? "pointer-events-none absolute left-0 top-0 border-0 bg-white" : "pointer-events-none h-full w-full border-0 bg-white"}
        style={miniaturize ? { width: 1440, height: 864, transform: `scale(${scale})`, transformOrigin: "top left" } : undefined}
        sandbox="allow-scripts allow-same-origin allow-forms"
        tabIndex={-1}
      />
    </div>
  );
}
