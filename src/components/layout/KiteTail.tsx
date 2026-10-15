import { useEffect, useRef } from "react";

const POINTS = 13; // rope points, the first one tied to the kite
const LINK = 6.5; // px between points
// low gravity + plenty of air drag: the tail drifts and settles lazily instead of whipping
const GRAVITY = 0.5;
const DAMPING = 0.8;
const ITERATIONS = 6;
// points two apart may not come closer than this, so the string can't fold into knots
const MIN_SPAN = LINK * 1.55;
// where the tail is tied: the kite's bottom corner, relative to the cursor hotspot
// (kite-flying.svg corner at 27.5,26.5 minus the 3,2 hotspot)
const TIE = { x: 24.5, y: 24.5 };
const BOWS = [
  { at: 3, color: "#1fbf9a" },
  { at: 7, color: "#ffc93c" },
  { at: 11, color: "#ff4fa3" },
];
const INK = "#1b1f3b";

/**
 * The kite cursor's tail: a little rope with ribbon bows that streams behind
 * the kite as the mouse moves and hangs down when it stops. The kite itself is
 * the native CSS cursor (no lag); only the tail is drawn here. Mouse only, and
 * off for reduced motion, where the cursor keeps its drawn-on tail instead.
 */
export default function KiteTail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    root.classList.add("kite-trail");
    // every element that just inherits the page cursor shows the kite
    const kiteCursor = getComputedStyle(root).cursor;

    const x = new Float32Array(POINTS);
    const y = new Float32Array(POINTS);
    const ox = new Float32Array(POINTS);
    const oy = new Float32Array(POINTS);

    let mouseX = 0;
    let mouseY = 0;
    let started = false;
    let visible = false; // is the kite cursor showing right now?
    let alpha = 0;
    let frame = 0;
    let calm = 0; // frames in a row with the rope at rest
    let lastTarget: Element | null = null;
    let recheck = false;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (started) draw();
    };

    const updateTarget = (el: Element | null) => {
      if (el === lastTarget) return;
      lastTarget = el;
      visible = !!el && getComputedStyle(el).cursor === kiteCursor;
    };

    const placeRope = () => {
      // start hanging straight down from the kite
      for (let i = 0; i < POINTS; i++) {
        x[i] = ox[i] = mouseX + TIE.x;
        y[i] = oy[i] = mouseY + TIE.y + i * LINK;
      }
    };

    const simulate = () => {
      x[0] = ox[0] = mouseX + TIE.x;
      y[0] = oy[0] = mouseY + TIE.y;
      let energy = 0;
      for (let i = 1; i < POINTS; i++) {
        const vx = (x[i] - ox[i]) * DAMPING;
        const vy = (y[i] - oy[i]) * DAMPING;
        ox[i] = x[i];
        oy[i] = y[i];
        x[i] += vx;
        y[i] += vy + GRAVITY;
        energy += vx * vx + vy * vy;
      }
      // keep every link the same length, and stop sharp folds
      for (let k = 0; k < ITERATIONS; k++) {
        for (let i = 2; i < POINTS; i++) {
          const dx = x[i] - x[i - 2];
          const dy = y[i] - y[i - 2];
          const d = Math.hypot(dx, dy) || 0.001;
          if (d >= MIN_SPAN) continue;
          const push = (MIN_SPAN - d) / d;
          x[i] += dx * push;
          y[i] += dy * push;
        }
        for (let i = 1; i < POINTS; i++) {
          const dx = x[i] - x[i - 1];
          const dy = y[i] - y[i - 1];
          const d = Math.hypot(dx, dy) || 0.001;
          const diff = (d - LINK) / d;
          if (i === 1) {
            x[i] -= dx * diff;
            y[i] -= dy * diff;
          } else {
            x[i - 1] += dx * diff * 0.5;
            y[i - 1] += dy * diff * 0.5;
            x[i] -= dx * diff * 0.5;
            y[i] -= dy * diff * 0.5;
          }
        }
      }
      return energy;
    };

    const bow = (i: number, color: string) => {
      const a = Math.max(0, i - 1);
      const b = Math.min(POINTS - 1, i + 1);
      const len = Math.hypot(x[b] - x[a], y[b] - y[a]) || 1;
      const tx = (x[b] - x[a]) / len;
      const ty = (y[b] - y[a]) / len;
      // the two wings stick out sideways from the string
      for (const side of [1, -1]) {
        const nx = -ty * side;
        const ny = tx * side;
        ctx.beginPath();
        ctx.moveTo(x[i], y[i]);
        ctx.lineTo(x[i] + nx * 5 + tx * 2.7, y[i] + ny * 5 + ty * 2.7);
        ctx.lineTo(x[i] + nx * 5 - tx * 2.7, y[i] + ny * 5 - ty * 2.7);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      if (alpha <= 0.01) return;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(x[0], y[0]);
      for (let i = 1; i < POINTS - 1; i++) {
        ctx.quadraticCurveTo(x[i], y[i], (x[i] + x[i + 1]) / 2, (y[i] + y[i + 1]) / 2);
      }
      ctx.lineTo(x[POINTS - 1], y[POINTS - 1]);
      // white halo first (like the cursor's sticker edge), then the ink string
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4.8;
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.1;
      for (const b of BOWS) bow(b.at, b.color);
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      frame = 0;
      if (recheck) {
        recheck = false;
        lastTarget = null;
        updateTarget(document.elementFromPoint(mouseX, mouseY));
      }
      const energy = simulate();
      alpha += ((visible ? 1 : 0) - alpha) * 0.35;
      draw();
      // stop once the rope hangs still and the fade has finished; the next move restarts it
      calm = energy < 0.002 ? calm + 1 : 0;
      const faded = Math.abs(alpha - (visible ? 1 : 0)) < 0.01;
      if (calm < 20 || !faded) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      calm = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!started) {
        started = true;
        placeRope();
      }
      updateTarget(e.target instanceof Element ? e.target : null);
      wake();
    };
    // content can slide under a still mouse (scrolling), so look again
    const onScroll = () => {
      if (!started) return;
      recheck = true;
      wake();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      lastTarget = null;
      visible = false;
      wake();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerout", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("kite-trail");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998] h-full w-full" />;
}
