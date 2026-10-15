// Lets the hero wait for the loading screen before playing its entrance.
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
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
