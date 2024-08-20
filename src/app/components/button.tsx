'use client';

// import React, { useState, useEffect } from "react";
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
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
          {children}
        </button>
    </div>
  );
};

// export default function Button({ onClick, disabled, children }: ButtonProps) {
  // const [clientDisabled, setClientDisabled] = useState(disabled);

  // useEffect(() => {
  //   setClientDisabled(disabled);
  // }, [disabled]);

//   return (
//     <div>
//         <button
//           className={`${styles.button} ${clientDisabled ? styles.disabled : styles.green}`}
//           onClick={onClick}
//           disabled={clientDisabled}
//         >
//           <FontAwesomeIcon icon={faPlus} className={styles.icon} />
//           {children}
//         </button>
//     </div>
//   );
// };

