"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "@/src/components/Error500.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error("Application error:", error);

    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error);
  }, [error]);

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

          {process.env.NODE_ENV === "development" && error && (
            <details style={{ marginTop: "1.5rem", textAlign: "left" }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#fca5a5",
                  marginBottom: "0.5rem",
                }}
              >
                Developer Info (Development Only)
              </summary>
              <pre
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "0.5rem",
                  overflow: "auto",
                  fontSize: "0.75rem",
                  color: "#e5e7eb",
                }}
              >
                {error.message}
                {"\n\n"}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}
