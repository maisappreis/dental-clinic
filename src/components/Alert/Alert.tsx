"use client";
import { useEffect } from "react";
import styles from "./Alert.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ALERT_CONFIG } from "./alert.config";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  message: string;
  variant?: AlertVariant;
  autoCloseAfter?: number;
  onClose?: () => void;
}

export function Alert({
  message,
  variant = "success",
  autoCloseAfter,
  onClose,
}: AlertProps) {

  useEffect(() => {
    if (!message) return;
    if (!autoCloseAfter || !onClose) return;

    const timer = setTimeout(onClose, autoCloseAfter);

    return () => clearTimeout(timer);
  }, [message, autoCloseAfter, onClose]);

  if (!message) return null;

  const config = ALERT_CONFIG[variant];

  return (
    <div
      role="alert"
      className={`${styles.alert} ${styles[config.styleClass]}`}
    >
      <div
        className={`${styles.marker} ${styles[config.markerClass]}`}
        aria-hidden
      />

      <div className={styles.message}>
        <FontAwesomeIcon
          icon={config.icon}
          className={styles.icon}
        />
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`mr-3`}
          aria-label="Fechar alerta"
        >
          <FontAwesomeIcon
            icon={faXmark}
          />
        </button>
      )}
    </div>
  );
};