import { useRef } from "react";
import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import AboutSection from "@/components/home/AboutSection";
import PhilosophySection from "@/components/home/PhilosophySection";
import EventsSection from "@/components/home/EventsSection";
import CommuteCalculator from "@/components/home/CommuteCalculator";
import MythQuiz from "@/components/home/MythQuiz";
import GallerySection from "@/components/home/GallerySection";
import RouteRail from "@/components/home/RouteRail";
import { SectionBlend } from "@/components/deco/SectionFade";
import FacultyTeaser from "@/components/home/FacultyTeaser";
import { useReveal } from "@/hooks/useReveal";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  usePageTitle();
  useReveal(root);

  return (
    <div ref={root}>
      <RouteRail />
      <Hero />
      <Ticker />
      <AboutSection />
      <PhilosophySection />
      <SectionBlend from="var(--color-sun-light)" via="#a9dcff" to="var(--color-its)" />
      <EventsSection />
      <FacultyTeaser />
      <CommuteCalculator />
      <MythQuiz />
      <GallerySection />
    </div>
  );
}
