import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { motion } from "framer-motion";
import { ScrollTrigger, startSmoothScroll } from "@/lib/motion";
import ClickBurst from "./ClickBurst";
import KiteTail from "./KiteTail";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingScreen from "./LoadingScreen";
import ScrollManager from "./ScrollManager";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isLinkHub = pathname === "/linkhub";
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    startSmoothScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Pinned sections need fresh measurements whenever the page height changes
  // (lazy routes, fonts, images without fixed size).
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    let lastHeight = 0;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        const h = main.offsetHeight;
        if (Math.abs(h - lastHeight) > 2) {
          lastHeight = h;
          ScrollTrigger.refresh();
        }
      }, 250);
    });
    ro.observe(main);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <ScrollManager />
      <ClickBurst />
      <KiteTail />
      <LoadingScreen />
      {!isLinkHub && <Navbar />}
      <main ref={mainRef} className="relative">
        {/* Opacity only: a transform here would break pinned (position: fixed) sections */}
        <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Outlet />
          </Suspense>
        </motion.div>
      </main>
      {!isLinkHub && <Footer />}
    </>
  );
}
