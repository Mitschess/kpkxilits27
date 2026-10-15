import { useEffect, useLayoutEffect, useRef } from "react";
import { animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
}

/** Tweens to each new value instead of jumping. */
export default function AnimatedNumber({ value, format = (n) => String(Math.round(n)), className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  // callers usually pass an inline formatter; don't restart the tween for that
  const fmt = useRef(format);
  useEffect(() => {
    fmt.current = format;
  });

  // React never owns the text, so re-renders can't flash the final value mid-tween
  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = fmt.current(from.current);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controls = animate(from.current, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        from.current = n;
        el.textContent = fmt.current(n);
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref} className={className} />;
}
