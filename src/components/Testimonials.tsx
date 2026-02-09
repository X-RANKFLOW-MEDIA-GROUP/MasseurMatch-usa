"use client";

import { Star, Quote } from "lucide-react";
import styles from "./Testimonials.module.css";

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  image: string;
  since: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text:
      "I found the perfect massage therapist in just a few minutes. The platform is intuitive and all professionals are verified.",
    name: "Alex Morgan",
    role: "Client since 2024",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    since: "2024",
  },
  {
    id: 2,
    text:
      "As an athlete, I need specialized sessions regularly. MasseurMatch connected me with the best sports massage pros in town.",
    name: "Taylor Brooks",
    role: "Client since 2023",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    since: "2023",
  },
  {
    id: 3,
    text:
      "My schedule has tripled since I joined. The support is excellent and the client quality is great.",
    name: "Jordan Lee",
    role: "Therapist - Elite Plan",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    since: "2022",
  },
];

export default function Testimonials() {
  return (
    <section className={`${styles.testimonials} mm-fade-up mm-fade-up--delay-3`}>
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
                <img
                  src={t.image}
                  alt={t.name}
                  className={styles["author-img"]}
                  loading="lazy"
                />
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
