"use client";

import { Star, Quote } from "lucide-react";
import styles from "./Testimonials.module.css";

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  since: string;
}

// Função para gerar cor baseada no nome
function getColorFromName(name: string): string {
  const colors = [
    "#8b5cf6",
    "#6366f1",
    "#7c3aed",
    "#a78bfa",
    "#c4b5fd",
    "#4f46e5",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Função para pegar iniciais
function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text:
      "I found the perfect massage therapist in just a few minutes! The platform is super intuitive and all professionals are verified. Highly recommend!",
    name: "Mariana Silva",
    role: "Client since 2024",
    since: "2024",
  },
  {
    id: 2,
    text:
      "As an athlete, I need specialized massages regularly. MasseurMatch connected me with the best sports massage professionals in town.",
    name: "Rafael Costa",
    role: "Client since 2023",
    since: "2023",
  },
  {
    id: 3,
    text:
      "My schedule has tripled since I joined the platform! The support is excellent and the quality of clients is great. Worth every penny of the Elite plan.",
    name: "Ana Beatriz",
    role: "Therapist - Elite Plan",
    since: "2022",
  },
];

export default function Testimonials() {
  // Schema.org para Google Rich Snippets
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MasseurMatch",
    "url": "https://www.masseurmatch.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": testimonials.length.toString(),
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": t.name,
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
      },
      "reviewBody": t.text,
      "datePublished": `${t.since}-01-01`,
    })),
  };

  return (
    <section className={styles.testimonials}>
      {/* Schema para Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      <div className={styles["testimonials-inner"]}>
        <h2>What People Say About Us</h2>
        <p>Real reviews from those already part of our community</p>

        <div className={styles["testimonials-grid"]}>
          {testimonials.map((t) => (
            <article key={t.id} className={styles["testimonial-card"]}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="#FFD700"
                    color="#FFD700"
                    aria-hidden
                  />
                ))}
              </div>

              <Quote className={styles["quote-icon"]} size={32} aria-hidden />

              <p className={styles.text}>"{t.text}"</p>

              <div className={styles.author}>
                <div
                  className={styles["author-avatar"]}
                  style={{ backgroundColor: getColorFromName(t.name) }}
                >
                  {getInitials(t.name)}
                </div>
                <div>
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

