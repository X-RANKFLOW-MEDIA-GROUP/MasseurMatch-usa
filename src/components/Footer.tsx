"use client";

import Link from "next/link";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  const seoCities = [
    { name: "Los Angeles", slug: "los-angeles" },
    { name: "New York City", slug: "new-york-city" },
    { name: "Miami", slug: "miami" },
    { name: "Chicago", slug: "chicago" },
    { name: "Dallas", slug: "dallas" },
    { name: "San Francisco", slug: "san-francisco" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        {/* Brand */}
        <div className={styles["footer-brand"]}>
          <h3 className={styles["footer-logo"]}>
            <span className={styles["brand-gradient"]}>Masseur</span>Match
          </h3>
          <p>
            The most inclusive massage therapist platform. Connecting wellness
            and technology with trust.
          </p>

          <div className={styles["footer-socials"]}>
            <Link href="#" aria-label="Instagram">
              <FaInstagram />
            </Link>
            <Link href="#" aria-label="Twitter">
              <FaTwitter />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </Link>
            <Link href="mailto:support@masseurmatch.com" aria-label="Email">
              <FaEnvelope />
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className={styles["footer-links"]}>
          {/* Platform */}
          <div>
            <h4>Platform</h4>
            <ul>
              <li>
                <Link href="/explore">Explore</Link>
              </li>
              <li>
                <Link href="/cities">Cities</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          {/* For Therapists */}
          <div>
            <h4>For Therapists</h4>
            <ul>
              <li>
                <Link href="/join">Create Account</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/checkout">Plans &amp; Pricing</Link>
              </li>
              <li>
                <Link href="/therapist">Help Center</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/terms">Terms of Use</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/community-guidelines">Community Guidelines</Link>
              </li>
              <li>
                <Link href="/trust-and-safety">Trust &amp; Safety</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Language Selector */}
        <div className={styles["footer-language"]}>
          <h4>Language</h4>
          <select aria-label="Language selector">
            <option value="en">English</option>
            <option value="pt">Portuguese (Brazil)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      <div className={styles["footer-seo"]}>
        <span className={styles["footer-seo-label"]}>Gay massage near you:</span>
        <div className={styles["footer-seo-links"]}>
          {seoCities.map((city) => (
            <Link key={city.slug} href={`/massage/${city.slug}`}>
              {city.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles["footer-bottom"]}>
        <p>Copyright 2025 MasseurMatch. All rights reserved.</p>
        <span>Made with care for everyone's well-being.</span>
      </div>
    </footer>
  );
}
