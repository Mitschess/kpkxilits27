import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StarfieldProps {
  className?: string;
  /** stars per 10,000 px² */
  density?: number;
}

/** Twinkling night sky on a canvas. Pauses when off-screen. */
export default function Starfield({ className, density = 1.1 }: StarfieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: { x: number; y: number; r: number; phase: number; speed: number; warm: boolean }[] = [];
    let frame = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((width * height) / 10000) * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.4 + 0.4,
        warm: Math.random() < 0.18,
      }));
      draw(0);
    };

    const draw = (t: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const a = still ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase + (t / 1000) * s.speed));
        ctx.globalAlpha = a;
        ctx.fillStyle = s.warm ? "#ffd76a" : "#e8ecff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      frame = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    if (!still) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [density]);

  return <canvas ref={ref} className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true" />;
}
