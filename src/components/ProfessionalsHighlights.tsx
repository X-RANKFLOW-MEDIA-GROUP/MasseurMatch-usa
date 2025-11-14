"use client";

import { MapPin, Star, BadgeCheck, Briefcase } from "lucide-react";
import styles from "./ProfessionalsHighlights.module.css";

interface Professional {
  id: number;
  name: string;
  location: string;
  experience: string;
  rating: number;
  totalReviews: number;
  tags: string[];
  image: string;
  badge:
    | "Highest Rated"
    | "Top Promotion"
    | "Clients' Favorite"
    | "Expert"
    | "Popular";
  verified: boolean;
}

const professionals: Professional[] = [
  {
    id: 1,
    name: "Dr. Morgan Santos",
    location: "São Paulo - SP",
    experience: "8 years of experience",
    rating: 5,
    totalReviews: 203,
    tags: ["Deep Tissue", "Therapeutic", "Sports"],
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    badge: "Highest Rated",
    verified: true,
  },
  {
    id: 2,
    name: "Alex Rivera",
    location: "Rio de Janeiro - RJ",
    experience: "10 years of experience",
    rating: 5,
    totalReviews: 187,
    tags: ["Ayurveda", "Relaxing", "Holistic"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG9tZW0lMjBwZXJmaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    badge: "Top Promotion",
    verified: true,
  },
  {
    id: 3,
    name: "Jamie Oliveira",
    location: "Belo Horizonte - MG",
    experience: "6 years of experience",
    rating: 4.9,
    totalReviews: 145,
    tags: ["Shiatsu", "Reflexology", "Hot Stones"],
    image:
      "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464",
    badge: "Clients' Favorite",
    verified: true,
  },
  {
    id: 4,
    name: "Casey Taylor",
    location: "Curitiba - PR",
    experience: "12 years of experience",
    rating: 4.9,
    totalReviews: 143,
    tags: ["Thai", "Sports", "Intensive"],
    image:
      "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    badge: "Expert",
    verified: true,
  },
  {
    id: 5,
    name: "Morgan Blake",
    location: "Porto Alegre - RS",
    experience: "7 years of experience",
    rating: 4.8,
    totalReviews: 134,
    tags: ["Swedish", "Aromatic"],
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
    badge: "Popular",
    verified: true,
  },
  {
    id: 6,
    name: "Morgan Blake",
    location: "Salvador - BA",
    experience: "7 years of experience",
    rating: 4.8,
    totalReviews: 134,
    tags: ["Swedish", "Aromatic"],
    image:
      "https://images.unsplash.com/photo-1695927621677-ec96e048dce2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=435",
    badge: "Popular",
    verified: true,
  },
];

const badgeClassMap: Record<Professional["badge"], string> = {
  "Highest Rated": "badge-highest-rated",
  "Top Promotion": "badge-top-promotion",
  "Clients' Favorite": "badge-clients--favorite",
  Expert: "badge-expert",
  Popular: "badge-popular",
};

const FeaturedProfessionals: React.FC = () => {
  return (
    <section className={styles.featured}>
      <div className={styles["featured-inner"]}>
        <h2>Featured Professionals</h2>
        <p>
          Meet the most highly rated and experienced massage therapists on the
          platform
        </p>

        <div className={styles.cards}>
          {professionals.map((p) => {
            const badgeClassKey = badgeClassMap[p.badge];
            const badgeClassName = `${styles.badge} ${
              styles[badgeClassKey]
            }`;

            return (
              <div key={p.id} className={styles.card}>
                <div className={styles["card-top"]}>
                  <span className={badgeClassName}>{p.badge}</span>

                  {p.verified && (
                    <span className={styles.verified}>
                      <BadgeCheck size={16} /> Verified
                    </span>
                  )}
                </div>

                <img src={p.image} alt={p.name} className={styles["card-img"]} />

                <div className={styles["card-body"]}>
                  <h3>{p.name}</h3>

                  <div className={styles.row}>
                    <MapPin size={14} />
                    <span>{p.location}</span>
                  </div>

                  <div className={styles.row}>
                    <Briefcase size={14} />
                    <span>{p.experience}</span>
                  </div>

                  <div className={`${styles.row} ${styles.rating}`}>
                    <Star size={14} fill="#FFD700" color="#FFD700" />
                    <span>
                      {p.rating} ({p.totalReviews})
                    </span>
                  </div>

                  <div className={styles.tags}>
                    {p.tags.map((tag, i) => (
                      <span key={i}>{tag}</span>
                    ))}
                  </div>

                  <button className={styles["btn-view"]}>
                    View Full Profile →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfessionals;
