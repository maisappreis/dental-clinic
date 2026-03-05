import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/Sidebar.module.css";

export function Logotype() {
  return (
    <div className="flex justify-center mt-5">
      <FontAwesomeIcon
        icon={faTooth}
        className={styles.logoicon}
      />
    </div>
  );
};