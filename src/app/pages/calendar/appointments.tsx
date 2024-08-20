import styles from "./Calendar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface AppointmentsProps {
  time: string;
  patients: string[];
}

export default function Appointments({ time, patients }: AppointmentsProps) {
  return (
    <>
      <div className={`${styles.schedule} ${styles.blue} ${styles.font}`}>{time}</div>
      {patients.map((patient, index) => (
        <button key={index} className={`${styles.schedule} ${styles.graylight}`}>
          <div className="flex justify-between">
            <p className={`flex justify-center w-3/4 ${styles.font}`}>{patient}</p>
            {patient ?
              <FontAwesomeIcon icon={faCircleInfo} className={styles.info} />
              : <span></span>
            }
          </div>
        </button>
      ))}
    </>
  );
}