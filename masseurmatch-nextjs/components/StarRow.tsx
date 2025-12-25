"use client";

import styles from "./ExploreTherapists.module.css";

export function StarRow({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className={styles.stars}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className={`${styles.star} ${styles["star--full"]}`}>
          {"ƒ~."}
        </span>
      ))}
      {Array.from({ length: half }).map((_, i) => (
        <span key={`h${i}`} className={`${styles.star} ${styles["star--half"]}`}>
          {"ƒo"}
        </span>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className={`${styles.star} ${styles["star--empty"]}`}>
          {"ƒ~+"}
        </span>
      ))}
      <span className={styles["stars__value"]}>{value.toFixed(1)}</span>
    </div>
  );
}
