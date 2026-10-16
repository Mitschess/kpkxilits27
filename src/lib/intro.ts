// Lets the hero wait for the loading screen before playing its entrance.
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  const waiting = [...listeners];
  listeners.clear();
  // Run outside whatever called us: if that's a GSAP callback in the intro's scope,
  // GSAP would adopt the page's entrance animations and revert them with the intro.
  queueMicrotask(() => waiting.forEach((fn) => fn()));
}

/** Runs `fn` once the intro has finished (immediately if it already has). Returns an unsubscribe. */
export function onIntroDone(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
