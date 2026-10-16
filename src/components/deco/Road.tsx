import { cn } from "@/lib/utils";
import Bus from "./Bus";

interface RoadProps {
  className?: string;
  /** 0–100: park the bus that far along the road instead of letting it drive on its own */
  progress?: number;
}

/** The road from Gresik to ITS, with the KPK bus driving along it. */
export default function Road({ className, progress }: RoadProps) {
  return (
    <div className={cn("relative h-14 border-t-[3px] border-ink bg-[#4a5070] md:h-16", className)} aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff_0_34px,transparent_34px_68px)]" />
      <div
        className={cn(
          "absolute bottom-[38%] w-[var(--bus-w)] [--bus-w:6rem] md:[--bus-w:8rem]",
          progress === undefined ? "left-0 animate-drive" : "transition-[left] duration-300 ease-out",
        )}
        style={progress === undefined ? undefined : { left: `calc((100% - var(--bus-w)) * ${progress / 100})` }}
      >
        <Bus className="w-full drop-shadow-[0_6px_0_rgb(27_31_59/0.25)]" />
      </div>
    </div>
  );
}
