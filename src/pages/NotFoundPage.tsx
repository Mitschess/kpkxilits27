import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import Bus from "@/components/deco/Bus";
import Clouds from "@/components/deco/Clouds";
import { buttonClass } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Halaman tidak ditemukan");

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#bfe6ff] to-cream px-6 pt-28 pb-16 text-center">
      <Clouds className="-z-10" count={4} />
      <div className="relative">
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bob font-display text-4xl font-extrabold text-pink" aria-hidden="true">
          ?!
        </span>
        <Bus className="w-44 animate-wiggle" moving={false} />
      </div>
      <p className="mt-8 font-display text-8xl font-extrabold tracking-tight text-its md:text-9xl">404</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">
        Waduh, busnya <span className="marker">nyasar</span> rek!
      </h1>
      <p className="mt-3 max-w-md text-ink-soft">Halaman yang kamu cari nggak ada di peta. Yuk balik ke jalan utama.</p>
      <Link to="/" className={buttonClass("sun", "mt-8")}>
        <ArrowLeft size={18} /> Balik ke beranda
      </Link>
    </section>
  );
}
