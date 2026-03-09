"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ButtonVariant = "primary" | "secondary" | "danger" | "default";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode;
  icon?: IconDefinition;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  label,
  icon = undefined,
  variant = "default",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        styles.button,
        styles[variant],
        styles[size],
        icon && styles.hasIcon,
        isDisabled && styles.disabled,
      ].filter(Boolean).join(" ")}
    >
      <span className={styles.content}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={styles.icon}
            aria-hidden
          />
        )}

        <span className={styles.label}>
          {isLoading ? "Carregando…" : label}
        </span>
      </span>
    </button>
  );
}