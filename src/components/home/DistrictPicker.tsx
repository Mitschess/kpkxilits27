import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { GRESIK_DISTRICTS } from "@/data/home";
import { cn } from "@/lib/utils";

export type District = (typeof GRESIK_DISTRICTS)[number];

// "Ujung Pangkah", "ujungpangkah" and "UJUNG-PANGKAH" all match each other
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

function search(query: string) {
  const q = normalize(query);
  if (!q) return GRESIK_DISTRICTS;
  const hits = GRESIK_DISTRICTS.filter((d) => normalize(d.name).includes(q));
  // names that start with what was typed come first
  return hits.sort((a, b) => Number(!normalize(a.name).startsWith(q)) - Number(!normalize(b.name).startsWith(q)));
}

/** Mark the part of `text` that matches the query. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-sun-light text-ink">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

interface DistrictPickerProps {
  value: District;
  onChange: (district: District) => void;
}

/**
 * Type-to-search field for the kecamatan (ARIA combobox + listbox). Suggestions
 * narrow down as you type; pick with a click, or ↑/↓ + Enter. Only the listed
 * kecamatan are selectable because the calculator needs their distance to ITS.
 */
export default function DistrictPicker({ value, onChange }: DistrictPickerProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  // null while not typing: the field shows the chosen kecamatan
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const results = search(query ?? "");
  const optionId = (i: number) => `${id}-opt-${i}`;

  const show = () => {
    setOpen(true);
    if (query === null) setActive(Math.max(0, GRESIK_DISTRICTS.findIndex((d) => d.name === value.name)));
  };
  const choose = (d: District) => {
    onChange(d);
    setQuery(null);
    setOpen(false);
  };
  // leaving the field: an unambiguous match counts as a pick, anything else reverts
  const dismiss = () => {
    if (query && results.length === 1) choose(results[0]);
    else {
      setQuery(null);
      setOpen(false);
    }
  };

  // keep the highlighted suggestion visible while arrowing through the list
  useEffect(() => {
    if (open) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [id, active, open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) show();
        else setActive((a) => Math.min(a + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Enter":
        if (open && results[active]) {
          e.preventDefault();
          choose(results[active]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setQuery(null);
          setOpen(false);
        }
        break;
    }
  };

  return (
    <div className="relative">
      <label htmlFor={`${id}-input`} className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-pink-light text-pink">
          <MapPin size={16} />
        </span>
        Rumahmu di kecamatan mana?
      </label>

      <div className="relative mt-3">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? optionId(active) : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder="Ketik nama kecamatan, mis. Kebomas"
          value={query ?? value.name}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={(e) => {
            e.currentTarget.select();
            show();
          }}
          onClick={show}
          onBlur={dismiss}
          onKeyDown={onKeyDown}
          className="w-full rounded-2xl bg-cream py-4 pr-12 pl-11 lg:py-3 font-semibold text-ink ring-2 ring-ink/10 transition outline-none placeholder:font-medium placeholder:text-ink-soft/60 hover:ring-ink/25 focus:ring-its"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Tutup daftar kecamatan" : "Lihat semua kecamatan"}
          onMouseDown={(e) => e.preventDefault()} // keep focus in the input
          onClick={() => {
            if (open) dismiss();
            else {
              inputRef.current?.focus();
              show();
            }
          }}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink-soft"
        >
          <ChevronDown size={18} className={cn("transition", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Kecamatan di Kabupaten Gresik"
          data-lenis-prevent
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl bg-white p-2 shadow-[0_6px_0_rgb(27_31_59/0.08),0_24px_48px_-20px_rgb(27_31_59/0.4)] ring-2 ring-ink/10"
        >
          {results.length === 0 ? (
            <li role="presentation" className="px-3 py-4 text-sm font-medium text-ink-soft">
              Hmm, “{query}” belum ada di daftar.
              <br />
              Coba cek ejaannya, atau pilih kecamatan terdekat.
            </li>
          ) : (
            results.map((d, i) => {
              const selected = d.name === value.name;
              return (
                <li
                  key={d.name}
                  id={optionId(i)}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()} // keep focus in the input
                  onClick={() => choose(d)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink",
                    i === active && "bg-its-light",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Check size={16} className={cn("text-its", !selected && "invisible")} />
                    {/* own span: inside the flex row each text piece would get the gap */}
                    <span>
                      <Highlight text={d.name} query={query ?? ""} />
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-cream px-2 py-0.5 text-xs font-bold text-ink-soft">{d.km} km</span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
