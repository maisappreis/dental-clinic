import styles from './styles/Button.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Button({ onClick, disabled, children }: ButtonProps) {
  return (
    <div>
      <button
        className={`${styles.button} ${disabled ? styles.disabled : styles.green}`}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex justify-center">
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
          <div className={`${styles.text}`}>{children}</div>
        </div>
      </button>
    </div>
  );
};
