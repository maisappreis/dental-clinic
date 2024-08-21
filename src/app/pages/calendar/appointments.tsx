import styles from "./Calendar.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface AppointmentsProps {
  time: string;
  patients: string[];
}

export default function Appointments({ time, patients }: AppointmentsProps) {
  return (
    <>
      <div className={`${styles.schedule} ${styles.blue} ${styles.text}`}>{time}</div>
      {patients.map((patient, index) => (
        <button key={index} className={`${styles.schedule} ${styles.graylight}`}>
          <div className="flex justify-center">
            <p className={`${styles.text}`}>{patient}</p>
            {/* {patient ?
              <FontAwesomeIcon icon={faCircleInfo} className={styles.info} />
              : <span></span>
            } */}
          </div>
        </button>
      ))}
    </>
  );
}