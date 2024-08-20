import styles from "./Calendar.module.css";
import Appointments from "./appointments";

const daysOfWeek = [
  { dayWeek: "Seg", day: "18/03" },
  { dayWeek: "Ter", day: "19/03" },
  { dayWeek: "Qua", day: "20/03" },
  { dayWeek: "Qui", day: "21/03" },
  { dayWeek: "Sex", day: "22/03" },
  { dayWeek: "Sáb", day: "23/03" },
];

// TODO: Receive the full name from the backend, and create a function to add a short name.

const appointments = [
  { time: "09:00", patients: ["", "", "Luis Silva", "", "Amanda L.", ""] },
  { time: "10:00", patients: ["", "Renan B.", "", "", "", ""] },
  { time: "11:00", patients: ["", "", "Luis Silva", "", "Amanda L.", ""] },
  { time: "13:00", patients: ["Bianca", "", "Paulo", "", "", ""] },
  { time: "14:00", patients: ["", "", "", "", "", ""] },
  { time: "15:00", patients: ["", "", "Luis Silva", "", "Amanda L.", ""] },
  { time: "16:00", patients: ["", "José", "", "", "Lopes", ""] },
  { time: "17:00", patients: ["", "", "Maisa Preis", "", "André Lopes", ""] },
  { time: "18:00", patients: ["", "", "", "", "Bia", ""] },
]

export default function Calendar() {
  return (
    <div className="content">
      <div className={styles.grid}>
        <div className={`${styles.week} ${styles.time} ${styles.font}`}>Horários</div>
        {daysOfWeek.map((day, index) => (
          <div key={index} className={`${styles.week} ${styles.header} ${styles.font}`}>
            <span>{day.dayWeek}</span>
            <span>{day.day}</span>
          </div>
        ))}
        {appointments.map((appointment) => (
          <Appointments key={appointment.time} time={appointment.time} patients={appointment.patients} />
        ))}
      </div>
    </div>
  )
}