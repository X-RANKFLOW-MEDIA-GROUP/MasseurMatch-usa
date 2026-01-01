"use client";

import { ProfileHero } from "./ProfileHero";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { PricingSection } from "./PricingSection";
import { ContactSection } from "./ContactSection";
import { GallerySection } from "./GallerySection";

/**
 * Perfil Público do Terapeuta - Versão Melhorada
 *
 * Características:
 * - Design moderno e limpo
 * - Cores bem definidas (sem ambiguidade)
 * - Componentes modulares
 * - Responsivo (mobile-first)
 * - Otimizado para SEO
 * - Acessibilidade (WCAG 2.1)
 * - Performance otimizada
 */

interface TherapistProfileData {
  // Basic Info
  displayName: string;
  fullName?: string;
  headline?: string;
  about?: string;
  philosophy?: string;

  // Media
  profilePhoto?: string;
  gallery?: string[];

  // Location
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  neighborhood?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;

  // Contact
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;

  // Services
  services?: string[];
  massageTechniques?: string[];
  additionalServices?: string[];
  specialties?: string[];

  // Pricing
  rate60?: string;
  rate90?: string;
  rate120?: string;
  rateOutcall?: string;
  incallEnabled?: boolean;
  outcallEnabled?: boolean;
  mobileServiceRadius?: number;

  // Professional
  languages?: string[];
  degrees?: string;
  affiliations?: string[];
  massageStartDate?: string;

  // Ratings & Status
  rating: number;
  reviewCount: number;
  status: "available" | "visiting_now" | "visiting_soon" | "offline";

  // Travel Info (when visiting)
  travelCity?: string;
  travelState?: string;
  travelStartDate?: string;
  travelEndDate?: string;

  // Availability
  availability?: any;
  businessHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  // Promotions
  activePromotions?: Array<{
    title: string;
    description: string;
    discountText: string;
    startDate: string;
    endDate: string;
  }>;
}

export function ImprovedTherapistProfile(data: TherapistProfileData) {
  // Calculate years of experience
  const yearsExperience = data.massageStartDate
    ? new Date().getFullYear() - new Date(data.massageStartDate).getFullYear()
    : undefined;

  // Travel info
  const travelInfo =
    data.travelCity && data.travelState && data.travelStartDate && data.travelEndDate
      ? {
          city: data.travelCity,
          state: data.travelState,
          startDate: data.travelStartDate,
          endDate: data.travelEndDate,
        }
      : undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <ProfileHero
        displayName={data.displayName}
        headline={data.headline}
        profilePhoto={data.profilePhoto}
        city={data.city}
        state={data.state}
        rating={data.rating}
        reviewCount={data.reviewCount}
        yearsExperience={yearsExperience}
        status={data.status}
        travelInfo={travelInfo}
      />

      {/* Gallery Section */}
      {data.gallery && data.gallery.length > 0 && (
        <GallerySection
          images={data.gallery}
          therapistName={data.displayName}
        />
      )}

      {/* About Section */}
      <AboutSection
        about={data.about}
        philosophy={data.philosophy}
        specialties={data.specialties}
        languages={data.languages}
      />

      {/* Services Section */}
      <ServicesSection
        services={data.services}
        massageTechniques={data.massageTechniques}
        additionalServices={data.additionalServices}
      />

      {/* Pricing Section */}
      <PricingSection
        rate60={data.rate60}
        rate90={data.rate90}
        rate120={data.rate120}
        rateOutcall={data.rateOutcall}
        incallEnabled={data.incallEnabled}
        outcallEnabled={data.outcallEnabled}
        mobileServiceRadius={data.mobileServiceRadius}
      />

      {/* Contact Section */}
      <ContactSection
        phone={data.phone}
        email={data.email}
        website={data.website}
        instagram={data.instagram}
        whatsapp={data.whatsapp}
        address={data.address}
        city={data.city}
        state={data.state}
        zipCode={data.zipCode}
        latitude={data.latitude}
        longitude={data.longitude}
        businessHours={data.businessHours}
      />
    </div>
  );
}
