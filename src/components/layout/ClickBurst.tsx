import { useEffect } from "react";

const COLORS = ["#ffc93c", "#ff4fa3", "#1fbf9a", "#2f5bea", "#ff8a3d", "#9b7bff"];
const PIECES = 8;

/**
 * A tiny burst of bunting flags and confetti wherever the mouse clicks.
 * Mouse only, and skipped entirely for visitors who prefer reduced motion.
 */
export default function ClickBurst() {
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || still.matches) return;
      const offset = Math.random() * Math.PI;
      for (let i = 0; i < PIECES; i++) {
        const angle = offset + (i / PIECES) * Math.PI * 2;
        const distance = 22 + Math.random() * 16;
        const flag = i % 2 === 0;
        const size = flag ? 11 : 7;
        const el = document.createElement("span");
        el.setAttribute("aria-hidden", "true");
        Object.assign(el.style, {
          position: "fixed",
          left: `${e.clientX - size / 2}px`,
          top: `${e.clientY - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          background: COLORS[i % COLORS.length],
          borderRadius: flag ? "1px" : "50%",
          clipPath: flag ? "polygon(0 0, 100% 0, 50% 100%)" : "",
          pointerEvents: "none",
          zIndex: "9999",
        });
        document.body.appendChild(el);
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const spin = dx > 0 ? 1 : -1;
        // pop out fast, hang in the air a moment, then drift down and fade
        el.animate(
          [
            { transform: "translate(0, 0) scale(0.4) rotate(0deg)", opacity: 1, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
            { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(${spin * 90}deg)`, opacity: 1, offset: 0.45, easing: "ease-in" },
            { transform: `translate(${dx * 1.15}px, ${dy + 14}px) scale(0.5) rotate(${spin * 180}deg)`, opacity: 0 },
          ],
          { duration: 650 + Math.random() * 150 },
        ).onfinish = () => el.remove();
      }
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
