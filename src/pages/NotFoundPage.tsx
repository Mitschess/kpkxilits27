import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import Lantern, { SCENE_SETS } from "@/components/lantern/Lantern";
import Starfield from "@/components/ui/Starfield";
import { buttonClass } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Halaman tidak ditemukan");

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night-950 px-6 pt-24 pb-16 text-center">
      <Starfield className="-z-10" density={0.8} />
      <div className="mt-16 origin-top animate-swing">
        <Lantern size={90} faces={SCENE_SETS[3]} lit={false} />
      </div>
      <p className="mt-24 font-display text-8xl font-semibold tracking-tight text-paper md:text-9xl">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-paper">
        Wah, kamu <em className="font-serif font-normal text-gold italic">nyasar</em> rek.
      </h1>
      <p className="mt-3 max-w-md text-mist">Halaman yang kamu cari nggak ada di peta. Yuk balik ke jalan utama.</p>
      <Link to="/" className={buttonClass("lantern", "mt-8")}>
        <ArrowLeft size={18} /> Balik ke beranda
      </Link>
    </section>
  );
}
