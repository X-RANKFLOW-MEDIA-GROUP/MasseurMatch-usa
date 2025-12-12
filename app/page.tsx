"use client";

import Hero from "@/src/components/Hero";
import HowItWorks from "@/src/components/HowItWorks";
import FeaturedProfessionals from "@/src/components/ProfessionalsHighlights";
import Testimonials from "@/src/components/Testimonials";
import FinalCTA from "@/src/components/FinalCTA";
import Footer from "@/src/components/Footer";
import { CitiesSection } from "@/src/components/CitiesSection";

export default function HomePage() {
  return (
    <>a
      <Hero />
      <FeaturedProfessionals />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <CitiesSection/>
      <Footer />  
    </>
  );
}
