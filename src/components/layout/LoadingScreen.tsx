import { useEffect, useState } from "react";
import IntroBus from "@/components/intro/IntroBus";
import IntroKinetik from "@/components/intro/IntroKinetik";
import IntroLampion from "@/components/intro/IntroLampion";
import IntroPanggung from "@/components/intro/IntroPanggung";
import { finishIntro } from "@/lib/intro";
import { safeStorage } from "@/lib/utils";

const SEEN_KEY = "kpk_has_loaded";

// All the intros we made are kept here; DEFAULT_INTRO is the one visitors see.
// `?intro=lampion` / `bus` / `panggung` / `kinetik` plays a specific one.
const INTROS = {
  lampion: IntroLampion,
  bus: IntroBus,
  panggung: IntroPanggung,
  kinetik: IntroKinetik,
};
type IntroName = keyof typeof INTROS;
const DEFAULT_INTRO: IntroName = "kinetik";

function requestedIntro(): IntroName {
  const name = new URLSearchParams(window.location.search).get("intro");
  return name && name in INTROS ? (name as IntroName) : DEFAULT_INTRO;
}

/** Once per session (or whenever `?intro` is in the URL), the site opens with a short intro. */
export default function LoadingScreen() {
  const [show, setShow] = useState(
    () => !safeStorage.get("session", SEEN_KEY) || new URLSearchParams(window.location.search).has("intro"),
  );
  const [Intro] = useState(() => INTROS[requestedIntro()]);

  useEffect(() => {
    if (show) safeStorage.set("session", SEEN_KEY, "1");
    else finishIntro();
  }, [show]);

  return show ? <Intro onDone={() => setShow(false)} /> : null;
}
