"use client";

import Hero from "@/src/components/Hero";
import LocationLinks from "@/src/components/LocationLinks";
import HowItWorks from "@/src/components/HowItWorks";
import FeaturedProfessionals from "@/src/components/ProfessionalsHighlights";
import Testimonials from "@/src/components/Testimonials";
import FinalCTA from "@/src/components/FinalCTA";
import Footer from "@/src/components/Footer";
import ComparisonLinks from "@/src/components/ComparisonLinks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LocationLinks />
      <FeaturedProfessionals />
      <HowItWorks />
      <Testimonials />
      <ComparisonLinks />
      <FinalCTA />
      <Footer />  
    </>
  );
}
