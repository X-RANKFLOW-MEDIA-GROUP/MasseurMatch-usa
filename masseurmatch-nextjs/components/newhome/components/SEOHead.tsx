"use client";

import { useEffect } from 'react';

export function SEOHead() {
  useEffect(() => {
    // Update document title
    document.title = 'MasseurMatch - Find LGBTQ+ Friendly Massage Therapists Near You';
    
    // Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'MasseurMatch connects you with verified, LGBTQ+ friendly massage therapists. Find Deep Tissue, Swedish, Sports, Thai, Hot Stone, and Aromatherapy massage specialists near you.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'MasseurMatch connects you with verified, LGBTQ+ friendly massage therapists. Find Deep Tissue, Swedish, Sports, Thai, Hot Stone, and Aromatherapy massage specialists near you.';
      document.head.appendChild(meta);
    }

    // Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = 'massage therapist near me, lgbtq friendly massage, deep tissue massage, swedish massage, sports massage, thai massage, hot stone massage, aromatherapy massage, massage directory, verified massage therapist';
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    // Open Graph Tags
    const updateOrCreateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (tag) {
        tag.content = content;
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.content = content;
        document.head.appendChild(tag);
      }
    };

    updateOrCreateOGTag('og:title', 'MasseurMatch - LGBTQ+ Friendly Massage Therapists');
    updateOrCreateOGTag('og:description', 'Find verified, LGBTQ+ friendly massage therapists near you. Direct contact, no middleman fees.');
    updateOrCreateOGTag('og:type', 'website');
    updateOrCreateOGTag('og:url', 'https://masseurmatch.com');
    updateOrCreateOGTag('og:site_name', 'MasseurMatch');
    updateOrCreateOGTag('og:locale', 'en_US');

    // Twitter Card Tags
    const updateOrCreateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (tag) {
        tag.content = content;
      } else {
        tag = document.createElement('meta');
        tag.name = name;
        tag.content = content;
        document.head.appendChild(tag);
      }
    };

    updateOrCreateTwitterTag('twitter:card', 'summary_large_image');
    updateOrCreateTwitterTag('twitter:title', 'MasseurMatch - LGBTQ+ Friendly Massage Therapists');
    updateOrCreateTwitterTag('twitter:description', 'Find verified massage therapists near you. LGBTQ+ friendly, AI-powered matching.');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = 'https://masseurmatch.com';
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = 'https://masseurmatch.com';
      document.head.appendChild(canonical);
    }

    // Structured Data - Organization
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MasseurMatch",
      "url": "https://masseurmatch.com",
      "logo": "https://masseurmatch.com/logo.png",
      "description": "Premium platform connecting clients with verified, LGBTQ+ friendly massage therapists",
      "foundingDate": "2024",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "support@masseurmatch.com"
      },
      "sameAs": [
        "https://twitter.com/masseurmatch",
        "https://facebook.com/masseurmatch",
        "https://instagram.com/masseurmatch"
      ]
    };

    // Structured Data - LocalBusiness
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "MasseurMatch",
      "image": "https://masseurmatch.com/logo.png",
      "@id": "https://masseurmatch.com",
      "url": "https://masseurmatch.com",
      "telephone": "+1-555-MASSAGE",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Online Platform",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "postalCode": "94102",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2847"
      }
    };

    // Structured Data - WebSite
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MasseurMatch",
      "url": "https://masseurmatch.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://masseurmatch.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // Insert structured data scripts
    const insertStructuredData = (id: string, data: object) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    insertStructuredData('schema-organization', organizationSchema);
    insertStructuredData('schema-localbusiness', localBusinessSchema);
    insertStructuredData('schema-website', websiteSchema);

  }, []);

  return null;
}
