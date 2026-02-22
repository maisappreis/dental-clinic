"use client";
import styles from "./Loading.module.css";
import { ReactNode } from "react";

type LoadingVariant = "fullscreen" | "inline";

interface LoadingProps {
  label?: ReactNode;
  variant?: LoadingVariant;
}

export function Loading({
  label = "Carregando…",
  variant = "fullscreen",
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.overlay} ${styles[variant]}`}
    >
      <div className={styles.container}>
        <span className={styles.spinner} aria-hidden />
        {label && (
          <span className={styles.label}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};