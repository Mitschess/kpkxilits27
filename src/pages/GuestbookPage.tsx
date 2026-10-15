import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { buttonClass } from "@/components/ui/button";
import { supabase, type GuestbookMessage } from "@/lib/supabase";
import { safeStorage, cn } from "@/lib/utils";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";

const DEVICE_KEY = "kpk_gb_device";
const COUNT_KEY = "kpk_gb_count";
const MAX_MESSAGES = 2;
const COLORS = ["yellow", "pink", "blue", "green", "orange", "purple"];

// stored color name → lantern light
const GLOW: Record<string, string> = {
  yellow: "#ffd76a",
  pink: "#ec3b92",
  blue: "#6f8fff",
  green: "#22b89a",
  orange: "#ffb23f",
  purple: "#a78bfa",
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
    <div ref={root} className="bg-night-950">
      <PageHero
        eyebrow="Buku Tamu"
        title={<>Tinggalkan <em>jejak</em> cahayamu.</>}
        description="Hai! Seneng kamu mampir ke sini ✨ Yuk tinggalin pesan buat kenang-kenangan~"
      />

      <div className="mx-auto grid max-w-7xl items-start gap-8 px-6 pb-28 lg:grid-cols-[400px_1fr]">
        {/* form */}
        <div data-reveal className="glass rounded-[2rem] p-6 md:p-8 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-paper">Tulis pesan</h2>
            {remaining > 0 && <span className="rounded-full bg-paper/[0.08] px-3 py-1 text-xs text-mist">Sisa kuota: {remaining}</span>}
          </div>

          {remaining <= 0 ? (
            <div className="mt-6 rounded-2xl bg-paper/[0.04] px-6 py-10 text-center ring-1 ring-paper/10">
              <p className="text-4xl">🙌</p>
              <p className="mt-3 font-display text-lg font-semibold text-paper">Makasih udah nulis!</p>
              <p className="mt-1 text-sm text-mist">Kuota nulismu sudah habis.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="gb-name" className="eyebrow text-paper/60">
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
                  className="mt-2 w-full rounded-2xl bg-night-950/60 px-4 py-3.5 text-paper ring-1 ring-paper/15 outline-none placeholder:text-mist/60 focus:ring-2 focus:ring-lantern"
                />
              </div>
              <div>
                <label htmlFor="gb-message" className="eyebrow text-paper/60">
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
                  className="mt-2 w-full resize-none rounded-2xl bg-night-950/60 px-4 py-3.5 text-paper ring-1 ring-paper/15 outline-none placeholder:text-mist/60 focus:ring-2 focus:ring-lantern"
                />
                <p className="mt-1 text-right text-xs text-mist">{text.length}/200</p>
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-magenta/10 px-4 py-3 text-sm text-[#ff8cc0] ring-1 ring-magenta/30">
                  {error}
                </p>
              )}
              {success && (
                <p role="status" className="rounded-xl bg-teal/10 px-4 py-3 text-sm text-mint ring-1 ring-teal/30">
                  Pesan berhasil dikirim! ✨
                </p>
              )}

              <button type="submit" disabled={sending || !supabase} className={buttonClass("lantern", "w-full")}>
                {sending ? "Mengirim…" : (
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
            <h2 className="font-display text-2xl font-semibold text-paper">Pesan masuk</h2>
            <span className="text-sm text-mist">{messages.length} pesan</span>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-3xl bg-paper/[0.04]" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-paper/15 px-6 py-16 text-center">
              <p className="font-display text-xl font-semibold text-paper">Belum ada pesan nih.</p>
              <p className="mt-2 text-mist">Jadilah yang pertama menyalakan lampion di sini!</p>
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div key={m.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 break-inside-avoid">
                    <MessageCard message={m} />
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

function MessageCard({ message }: { message: GuestbookMessage }) {
  const glow = GLOW[message.color] ?? GLOW.yellow;
  const date = new Date(message.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return (
    <article className={cn("relative overflow-hidden rounded-3xl bg-night-800/80 p-6 ring-1 ring-paper/10")}>
      <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full opacity-35 blur-2xl" style={{ background: glow }} />
      <div className="absolute inset-x-6 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }} />
      <p className="relative text-[1.05rem] leading-relaxed break-words text-paper/90">“{message.message}”</p>
      <footer className="relative mt-5 flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-medium text-paper">
          <span className="h-2 w-2 rounded-full" style={{ background: glow, boxShadow: `0 0 10px ${glow}` }} />
          {message.name}
        </span>
        <time dateTime={message.created_at} className="text-xs text-mist">
          {date}
        </time>
      </footer>
    </article>
  );
}
