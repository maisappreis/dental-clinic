"use client";

import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: number;
  centered?: boolean;
};

export function Spinner({ size = 40, centered = true }: SpinnerProps) {
  const spinner = (
    <div
      className={styles.spinner}
      style={{
        width: size,
        height: size,
      }}
    />
  );

  if (!centered) return spinner;

  return (
    <div className={styles.container}>
      {spinner}
      Carregando...
    </div>
  );
};