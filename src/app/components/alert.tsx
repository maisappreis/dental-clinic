import React from "react"
import styles from './styles/Alert.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Alert({ message }: { message: string }) {
  if (!message) return null;

  const isError = message.toLowerCase().includes("erro");
  const alertStyle = isError ? styles.error : styles.success;
  const icon = isError ? faXmark : faCheck;

  return (
    <div className={`${styles.alert} ${alertStyle}`}>
      <div className={`${styles.marker} ${isError ? styles.red : styles.green}`}></div>
      <div className={`flex ${styles.message}`}>
        <FontAwesomeIcon icon={icon} className={styles.icon} />
        {message}
      </div>
    </div>
  );
}