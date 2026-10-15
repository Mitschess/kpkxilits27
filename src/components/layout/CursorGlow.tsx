import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** A soft pool of lantern light that follows the mouse. Desktop only. */
export default function CursorGlow() {
  const enabled = useMediaQuery("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const onMove = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.style.opacity = "1";
    };
    const onLeave = () => (el.style.opacity = "0");
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[70] -mt-[260px] -ml-[260px] h-[520px] w-[520px] rounded-full opacity-0 mix-blend-screen transition-opacity duration-500"
      style={{ background: "radial-gradient(circle, rgb(255 178 63 / 0.09) 0%, rgb(255 178 63 / 0.03) 35%, transparent 65%)" }}
    />
  );
}
