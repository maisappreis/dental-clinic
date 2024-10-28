import React from 'react';
import styles from './styles/Modal.module.css';

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

export default function Modal({ title, children }: ModalProps) {
  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};