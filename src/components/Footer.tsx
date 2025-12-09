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
            The most inclusive massage therapist platform. Connecting wellness and technology with trust.
          </p>
        </div>

        <div className={styles["footer-links"]}>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy</Link>
              </li>
              <li>
                <Link href="/community-guidelines">Community Guidelines</Link>
              </li>
              <li>
                <Link href="/cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/professional-standards">Professional Standards</Link>
              </li>
              <li>
                <Link href="/anti-trafficking">Anti Trafficking</Link>
              </li>
            </ul>
          </div>

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
                <Link href="/city/chicago">Chicago M4M</Link>
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
