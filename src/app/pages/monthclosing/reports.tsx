import styles from "./MonthClosing.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function Reports() {

  const reports = [
    { id: "1", label: "Dezembro/2023" },
    { id: "2", label: "Janeiro/2024" },
    { id: "3", label: "Fevereiro/2024" },
    { id: "4", label: "Março/2024" },
    { id: "5", label: "Abril/2024" },
    { id: "6", label: "Maio/2024" },
    { id: "7", label: "Junho/2024" },
    { id: "8", label: "Julho/2024" },
    { id: "9", label: "Agosto/2024" },
    { id: "10", label: "Setembro/2024" }
  ];

  const editReport = (id: string) => {
    console.log('Editar', id)
  }

  const deleteReport = (id: string) => {
    console.log('Excluir', id)
  }

  return (
    <div className="flex justify-left w-full flex-wrap">
      {reports.map((report) => (
        <div
          key={report.id}
          className={styles.box}>
          {report.label}
          <FontAwesomeIcon icon={faPenToSquare} className="ml-3" onClick={() => editReport(report.id)} />
          <FontAwesomeIcon icon={faTrashCan} className="ml-3" onClick={() => deleteReport(report.id)} />
        </div>
      ))}
    </div>
  )
}