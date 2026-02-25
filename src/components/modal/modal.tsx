"use client";

import { ReactNode, useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface SectionProps {
  children: ReactNode;
}

type ModalComponent = React.FC<ModalProps> & {
  Header: React.FC<SectionProps>;
  Body: React.FC<SectionProps>;
  Footer: React.FC<SectionProps>;
};

export const Modal: ModalComponent = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }: SectionProps) => (
  <header className={styles.header}>{children}</header>
);

Modal.Body = ({ children }: SectionProps) => (
  <div className={styles.body}>{children}</div>
);

Modal.Footer = ({ children }: SectionProps) => (
  <footer className={styles.footer}>{children}</footer>
);

Modal.displayName = "Modal";
Modal.Header.displayName = "Modal.Header";
Modal.Body.displayName = "Modal.Body";
Modal.Footer.displayName = "Modal.Footer";