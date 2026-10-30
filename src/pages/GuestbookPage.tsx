import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Inbox, MessageCircle, MessageSquareHeart, PenLine, Send } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { buttonClass } from "@/components/ui/button";
import { supabase, type GuestbookMessage } from "@/lib/supabase";
import { scrollToElement } from "@/lib/motion";
import { cn, safeStorage } from "@/lib/utils";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";

const DEVICE_KEY = "kpk_gb_device";
const QUOTA_KEY = "kpk_gb_quota"; // {"day":"2026-10-22","sent":1}
// messages per device per day; the database enforces the same (supabase/schema.sql)
const MAX_PER_DAY = 2;
const COLORS = ["yellow", "pink", "blue", "green", "orange", "purple"];
// messages per page: two columns of 4 on wider screens, a single column of 4 on phones
const PAGE_SIZE_WIDE = 8;
const PAGE_SIZE_PHONE = 4;
// only what's shown: device_id stays private (see supabase/schema.sql)
const FIELDS = "id, name, message, color, created_at";

// two message columns from Tailwind's sm breakpoint up
const twoColsQuery = () => window.matchMedia("(min-width: 640px)");
function subscribeTwoCols(onChange: () => void) {
  const mq = twoColsQuery();
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getTwoCols = () => twoColsQuery().matches;

// 1 … 4 5 6 … 12: both ends, the current page and its neighbours
function pageNumbers(current: number, last: number) {
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= last; p++) {
    if (p === 1 || p === last || Math.abs(p - current) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }
  return pages;
}

// stored colour name → bubble colours
const BUBBLE: Record<string, { bg: string; dot: string }> = {
  yellow: { bg: "#fff2c4", dot: "#ffc93c" },
  pink: { bg: "#ffe1ef", dot: "#ff4fa3" },
  blue: { bg: "#dfe7ff", dot: "#2f5bea" },
  green: { bg: "#d3f7eb", dot: "#1fbf9a" },
  orange: { bg: "#ffe4d1", dot: "#ff8a3d" },
  purple: { bg: "#ece6ff", dot: "#9b7bff" },
};

function getDeviceId() {
  let id = safeStorage.get("local", DEVICE_KEY);
  if (!id) {
    id = `d${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    safeStorage.set("local", DEVICE_KEY, id);
  }
  return id;
}

// a "day" is a calendar day in WIB, the same as the database's rule
const todayWIB = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());

function sentToday() {
  try {
    const q = JSON.parse(safeStorage.get("local", QUOTA_KEY) ?? "null") as { day?: string; sent?: number } | null;
    return q?.day === todayWIB() ? Number(q.sent) || 0 : 0;
  } catch {
    return 0;
  }
}
const saveSentToday = (sent: number) => safeStorage.set("local", QUOTA_KEY, JSON.stringify({ day: todayWIB(), sent }));

export default function GuestbookPage() {
  usePageTitle("Buku Tamu");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [remaining, setRemaining] = useState(() => Math.max(0, MAX_PER_DAY - sentToday()));
  const twoCols = useSyncExternalStore(subscribeTwoCols, getTwoCols);
  const pageSize = twoCols ? PAGE_SIZE_WIDE : PAGE_SIZE_PHONE;
  const listTop = useRef<HTMLDivElement>(null);
  const request = useRef(0);
  const firstShown = useRef(0); // position of the first message on screen

  // one page of messages (newest first), plus how many there are in all
  const loadPage = useCallback(async (p: number, size: number) => {
    if (!supabase) {
      setError("Database belum siap.");
      setLoading(false);
      return;
    }
    const id = ++request.current;
    setPageLoading(true);
    const from = (p - 1) * size;
    const { data, count, error } = await supabase
      .from("guestbook")
      .select(FIELDS, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + size - 1);
    if (id !== request.current) return; // another page was asked for meanwhile
    // the page no longer exists (messages were removed): start over
    if (error?.code === "PGRST103" && p > 1) return loadPage(1, size);
    setPageLoading(false);
    setLoading(false);
    if (error) {
      setError("Gagal memuat pesan.");
      return;
    }
    setMessages(data ?? []);
    setTotal(count ?? 0);
    setPage(p);
    firstShown.current = from;
  }, []);

  function goToPage(p: number) {
    void loadPage(p, pageSize);
    // back to the top of the list if it has been scrolled past
    if (listTop.current && listTop.current.getBoundingClientRect().top < 0) scrollToElement(listTop.current);
  }

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  // split alternately so each page reads left to right, newest first
  const columns = twoCols ? [messages.filter((_, i) => i % 2 === 0), messages.filter((_, i) => i % 2 === 1)] : [messages];

  // on first load, and when the page size changes (e.g. the phone is turned), open the page
  // that holds the message that was first on screen
  useEffect(() => {
    void loadPage(Math.floor(firstShown.current / pageSize) + 1, pageSize);
  }, [loadPage, pageSize]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setError("Isi dulu dong~");
      return;
    }
    if (remaining <= 0 || !supabase) return;

    setSending(true);
    setError("");
    const { error } = await supabase.from("guestbook").insert([
      {
        name: name.trim(),
        message: text.trim(),
        device_id: getDeviceId(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
    ]);
    setSending(false);
    if (error) {
      // the database's own limits come back as readable messages (P0001)
      setError(error.code === "P0001" ? error.message : "Gagal kirim, coba lagi ya!");
      // the database says today's quota is used up (e.g. sent from this browser before): close the form
      if (error.hint === "daily_quota") {
        saveSentToday(MAX_PER_DAY);
        setRemaining(0);
      }
      return;
    }
    saveSentToday(sentToday() + 1);
    setRemaining((r) => r - 1);
    setSuccess(true);
    setName("");
    setText("");
    void loadPage(1, pageSize);
  }

  return (
    <div ref={root} className="bg-cream">
      <PageHero
        icon={MessageSquareHeart}
        eyebrow="Buku Tamu"
        title={<>Tinggalkan <em>jejakmu</em> di sini!</>}
        description="Hai! Seneng kamu mampir ke sini. Yuk tinggalin pesan buat kenang-kenangan~"
      />

      <div className="mx-auto grid max-w-7xl items-start gap-8 px-6 pb-24 lg:grid-cols-[400px_1fr]">
        {/* form */}
        <div data-reveal className="card p-6 md:p-8 lg:sticky lg:top-[calc(var(--nav-offset,0px)+1.5rem)] lg:transition-[top] lg:duration-500 lg:ease-out-expo">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
              <PenLine size={22} strokeWidth={2.5} aria-hidden="true" /> Tulis pesan
            </h2>
            {remaining > 0 && <span className="rounded-full bg-sun-light px-3 py-1 text-xs font-bold text-ink ring-2 ring-sun">Sisa kuota hari ini: {remaining}</span>}
          </div>

          {remaining <= 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-mint-light px-6 py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-mint-dark" aria-hidden="true">
                <Heart size={28} strokeWidth={2.25} />
              </span>
              <p className="mt-3 font-display text-lg font-extrabold text-ink">Makasih udah nulis!</p>
              <p className="mt-1 text-sm text-ink-soft">Kuota nulismu hari ini sudah habis. Balik lagi besok ya!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="gb-name" className="text-sm font-bold text-ink">
                  Namamu
                </label>
                <input
                  id="gb-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama panggilan…"
                  maxLength={20}
                  disabled={sending}
                  className="mt-2 w-full rounded-2xl bg-cream px-4 py-3.5 font-medium text-ink ring-2 ring-ink/10 outline-none placeholder:text-ink-soft/60 focus:ring-its"
                />
              </div>
              <div>
                <label htmlFor="gb-message" className="text-sm font-bold text-ink">
                  Pesanmu
                </label>
                <textarea
                  id="gb-message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tulis pesan, harapan, atau semangat…"
                  maxLength={200}
                  rows={5}
                  disabled={sending}
                  className="mt-2 w-full resize-none rounded-2xl bg-cream px-4 py-3.5 font-medium text-ink ring-2 ring-ink/10 outline-none placeholder:text-ink-soft/60 focus:ring-its"
                />
                <p className="mt-1 text-right text-xs font-semibold text-ink-soft">{text.length}/200</p>
              </div>

              {error && (
                <p role="alert" className="rounded-2xl bg-pink-light px-4 py-3 text-sm font-semibold text-pink-dark">
                  {error}
                </p>
              )}
              {success && (
                <p role="status" className="rounded-2xl bg-mint-light px-4 py-3 text-sm font-semibold text-mint-dark">
                  Pesan berhasil dikirim!
                </p>
              )}

              <button type="submit" disabled={sending || !supabase} className={buttonClass("blue", "w-full")}>
                {sending ? (
                  "Mengirim…"
                ) : (
                  <>
                    Kirim pesan <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* messages */}
        <div>
          <div ref={listTop} className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
              <MessageCircle size={22} strokeWidth={2.5} aria-hidden="true" /> Pesan masuk
            </h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-ink ring-2 ring-ink/10">{total} pesan</span>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-[1.5rem] bg-white" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-[1.75rem] border-4 border-dashed border-ink/10 bg-white/60 px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream text-ink-soft" aria-hidden="true">
                <Inbox size={28} strokeWidth={2.25} />
              </span>
              <p className="mt-3 font-display text-xl font-extrabold text-ink">Belum ada pesan nih.</p>
              <p className="mt-1 text-ink-soft">Jadilah yang pertama nulis!</p>
            </div>
          ) : (
            <>
              <div aria-busy={pageLoading} className={cn("flex items-start gap-4 transition-opacity", pageLoading && "opacity-50")}>
                {columns.map((col, c) => (
                  <div key={c} className="flex min-w-0 flex-1 flex-col gap-4">
                    <AnimatePresence initial={false}>
                      {col.map((m) => (
                        <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                          <MessageBubble message={m} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {lastPage > 1 && <Pagination page={page} lastPage={lastPage} disabled={pageLoading} onChange={goToPage} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const PAGE_BTN = "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-bold transition-all duration-200 ease-bounce disabled:pointer-events-none";

function Pagination({ page, lastPage, disabled, onChange }: { page: number; lastPage: number; disabled: boolean; onChange: (p: number) => void }) {
  const arrow = cn(PAGE_BTN, "bg-white text-ink ring-2 ring-ink/10 hover:-translate-y-0.5 disabled:opacity-40");
  return (
    <nav aria-label="Halaman pesan" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={() => onChange(page - 1)} disabled={disabled || page <= 1} aria-label="Halaman sebelumnya" className={arrow}>
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>
      {pageNumbers(page, lastPage).map((p, i) =>
        p === "gap" ? (
          <span key={`gap${i}`} className="px-1 font-bold text-ink-soft" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            disabled={disabled || p === page}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Halaman ${p}`}
            className={cn(
              PAGE_BTN,
              p === page ? "bg-its text-white shadow-[0_3px_0_#1d3fb5]" : "bg-white text-ink ring-2 ring-ink/10 hover:-translate-y-0.5",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" onClick={() => onChange(page + 1)} disabled={disabled || page >= lastPage} aria-label="Halaman berikutnya" className={arrow}>
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </nav>
  );
}

function MessageBubble({ message }: { message: GuestbookMessage }) {
  const c = BUBBLE[message.color] ?? BUBBLE.yellow;
  const date = new Date(message.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return (
    <article className="flex gap-3">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-white font-display font-extrabold text-white shadow-[0_3px_0_rgb(27_31_59/0.12)]"
        style={{ background: c.dot }}
        aria-hidden="true"
      >
        {message.name.trim().charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1 rounded-[1.4rem] rounded-tl-md p-4" style={{ background: c.bg }}>
        <p className="flex items-baseline justify-between gap-3">
          <span className="truncate font-bold text-ink">{message.name}</span>
          <time dateTime={message.created_at} className="shrink-0 text-xs font-semibold text-ink-soft">
            {date}
          </time>
        </p>
        <p className="mt-1.5 leading-relaxed break-words text-ink">{message.message}</p>
      </div>
    </article>
  );
}
