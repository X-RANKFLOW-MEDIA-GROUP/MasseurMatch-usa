"use client";

import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedProfessionals from "@/components/ProfessionalsHighlights";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import { CitiesSection } from "@/components/CitiesSection";
import BackToTop from "@/components/BackToTop";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProfessionals />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <CitiesSection />
      <BackToTop />
    </>
  );
}
