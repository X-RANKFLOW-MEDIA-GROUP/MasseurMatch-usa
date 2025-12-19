import Link from "next/link";
import styles from "@/src/components/NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden />

      <div className={styles.card}>
        <span className={styles.eyebrow}>Error 404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.subtitle}>
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            Go to home
          </Link>
          <Link href="/explore" className={styles.btnGhost}>
            Explore therapists
          </Link>
        </div>
      </div>
    </div>
  );
}
