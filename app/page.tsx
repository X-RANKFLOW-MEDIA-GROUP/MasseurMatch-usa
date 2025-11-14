"use client";

import Hero from "@/src/components/Hero";
import HowItWorks from "@/src/components/HowItWorks";
import FeaturedProfessionals from "@/src/components/ProfessionalsHighlights";
import Testimonials from "@/src/components/Testimonials";
import FinalCTA from "@/src/components/FinalCTA";
import Footer from "@/src/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProfessionals />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />  
    </>
  );
}
