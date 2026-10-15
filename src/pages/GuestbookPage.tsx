import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Inbox, MessageCircle, MessageSquareHeart, PenLine, Send } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { buttonClass } from "@/components/ui/button";
import { supabase, type GuestbookMessage } from "@/lib/supabase";
import { safeStorage } from "@/lib/utils";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";

const DEVICE_KEY = "kpk_gb_device";
const COUNT_KEY = "kpk_gb_count";
const MAX_MESSAGES = 2;
const COLORS = ["yellow", "pink", "blue", "green", "orange", "purple"];

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

const sentCount = () => parseInt(safeStorage.get("local", COUNT_KEY) ?? "0", 10) || 0;

export default function GuestbookPage() {
  usePageTitle("Buku Tamu");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [remaining, setRemaining] = useState(() => Math.max(0, MAX_MESSAGES - sentCount()));

  const loadMessages = useCallback(async () => {
    if (!supabase) {
      setError("Database belum siap.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("guestbook").select("*").order("created_at", { ascending: false });
    if (error) setError("Gagal memuat pesan.");
    else setMessages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

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
      setError("Gagal kirim, coba lagi ya!");
      return;
    }
    safeStorage.set("local", COUNT_KEY, String(sentCount() + 1));
    setRemaining((r) => r - 1);
    setSuccess(true);
    setName("");
    setText("");
    void loadMessages();
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
        <div data-reveal className="card p-6 md:p-8 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
              <PenLine size={22} strokeWidth={2.5} aria-hidden="true" /> Tulis pesan
            </h2>
            {remaining > 0 && <span className="rounded-full bg-sun-light px-3 py-1 text-xs font-bold text-ink ring-2 ring-sun">Sisa kuota: {remaining}</span>}
          </div>

          {remaining <= 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-mint-light px-6 py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-mint-dark" aria-hidden="true">
                <Heart size={28} strokeWidth={2.25} />
              </span>
              <p className="mt-3 font-display text-lg font-extrabold text-ink">Makasih udah nulis!</p>
              <p className="mt-1 text-sm text-ink-soft">Kuota nulismu sudah habis.</p>
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
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
              <MessageCircle size={22} strokeWidth={2.5} aria-hidden="true" /> Pesan masuk
            </h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-ink ring-2 ring-ink/10">{messages.length} pesan</span>
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
            <div className="columns-1 gap-4 sm:columns-2">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 break-inside-avoid">
                    <MessageBubble message={m} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
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
