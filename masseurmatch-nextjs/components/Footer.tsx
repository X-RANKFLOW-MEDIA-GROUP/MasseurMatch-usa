"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About MasseurMatch", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Find Therapists",
    links: [
      { label: "Browse by City", href: "/massage-therapists-by-city" },
      { label: "Browse by Service", href: "/massage-services" },
      { label: "Top Cities", href: "/top-massage-cities" },
      { label: "Top Services", href: "/top-massage-services" },
    ],
  },
  {
    title: "For Therapists",
    links: [
      { label: "Join as a Therapist", href: "/join-as-therapist" },
      { label: "How It Works", href: "/how-it-works-for-therapists" },
      { label: "Verification Process", href: "/verification-process" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { label: "Trust & Safety", href: "/trust-safety" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-content"]}>
        <div className={styles["footer-brand"]}>
          <h3 className={styles["footer-logo"]}>
            <span className={styles["brand-gradient"]}>Masseur</span>Match
          </h3>
          <p className={styles["footer-description"]}>
            The inclusive directory for massage therapists that prioritizes trust
            and consistent service quality. We highlight LGBTQ+-friendly practitioners
            and curate city/service landing pages to guide seekers to the right match.
          </p>
          <div className={styles["footer-socials"]}>
            <a
              href="https://www.instagram.com/masseurmatch"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://twitter.com/masseurmatch"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://www.facebook.com/masseurmatch"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/masseurmatch"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className={styles["footer-grid"]}>
          {columns.map((column) => (
            <div key={column.title} className={styles["footer-column"]}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles["footer-bottom"]}>
        © 2025 MasseurMatch. All rights reserved.
      </div>
    </footer>
  );
}
