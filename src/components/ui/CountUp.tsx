import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

/** Number that counts up from 0 the first time it scrolls into view. */
export default function CountUp({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.n)}${suffix}`;
        },
      });
    },
    { dependencies: [value, suffix] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
