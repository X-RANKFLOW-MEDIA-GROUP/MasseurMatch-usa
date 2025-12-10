"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        <div className={styles["footer-brand"]}>
          <h3 className={styles["footer-logo"]}>
            <span className={styles["brand-gradient"]}>Masseur</span>Match
          </h3>
          <p>
            The most inclusive massage therapist platform. Connecting wellness
            and technology with trust.
          </p>
        </div>

        <div className={styles["footer-links"]}>
          {/* Platform */}
          <div>
            <h4>Platform</h4>
            <ul>
              <li>
                <Link href="/explore">Explore</Link>
              </li>
              <li>
                <Link href="/about">How It Works</Link>
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
                <Link href="/support">Help Center</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/legal/terms">Terms of Use</Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/legal/community-guidelines">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/legal/professional-standards">
                  Professional Standards
                </Link>
              </li>
              <li>
                <Link href="/legal/anti-trafficking">
                  Anti-Trafficking Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities (SEO) */}
          <div>
            <h4>Popular Cities</h4>
            <ul>
              <li>
                <Link href="/city/miami">Miami Gay Massage</Link>
              </li>
              <li>
                <Link href="/city/new-york">NYC Male Massage</Link>
              </li>
              <li>
                <Link href="/city/los-angeles">LA LGBT Massage</Link>
              </li>
              <li>
                <Link href="/city/san-francisco">SF Gay Massage</Link>
              </li>
              <li>
                <Link href="/city/las-vegas">Vegas Gay Massage</Link>
              </li>
              <li>
                <Link href="/city/chicago">Chicago M4M Massage</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles["footer-bottom"]}>
        <p>&copy; 2025 MasseurMatch. All rights reserved.</p>
        <span>Made with care for everyone&apos;s well-being</span>
      </div>
    </footer>
  );
}
