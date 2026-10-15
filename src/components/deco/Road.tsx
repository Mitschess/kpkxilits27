import { cn } from "@/lib/utils";
import Bus from "./Bus";

/** The road from Gresik to ITS, with the KPK bus driving along it. */
export default function Road({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-14 border-t-[3px] border-ink bg-[#4a5070] md:h-16", className)} aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff_0_34px,transparent_34px_68px)]" />
      <div className="absolute bottom-[38%] left-0 w-24 animate-drive md:w-32">
        <Bus className="w-full drop-shadow-[0_6px_0_rgb(27_31_59/0.25)]" />
      </div>
      {/* road signs */}
      <span className="absolute bottom-full left-4 mb-2 rounded-lg border-[3px] border-ink bg-mint px-2.5 py-1 text-xs font-extrabold text-white md:left-8 md:text-sm">
        Gresik
      </span>
      <span className="absolute right-4 bottom-full mb-2 rounded-lg border-[3px] border-ink bg-its px-2.5 py-1 text-xs font-extrabold text-white md:right-8 md:text-sm">
        ITS Surabaya →
      </span>
    </div>
  );
}
