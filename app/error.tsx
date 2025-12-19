"use client";

import Link from "next/link";
import styles from "@/src/components/Error500.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className={styles.page}>
        <div className={styles.glow} aria-hidden />

        <div className={styles.card}>
          <span className={styles.badge}>500 · Server error</span>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.subtitle}>
            We hit an unexpected error. Try again or head back to the homepage.
          </p>

          <div className={styles.actions}>
            <button type="button" onClick={reset} className={styles.btnPrimary}>
              Try again
            </button>
            <Link href="/" className={styles.btnGhost}>
              Go home
            </Link>
          </div>

          {error?.digest && (
            <p className={styles.meta}>Error code: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
