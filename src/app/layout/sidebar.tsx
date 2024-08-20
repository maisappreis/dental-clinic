import Logotype from "./logotype";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCalendar, faHandHoldingDollar, faMoneyBillTransfer, faBook } from '@fortawesome/free-solid-svg-icons';
import style from "./styles/Sidebar.module.css";

// export default function Sidebar() {
export default function Sidebar({ onOptionClick }: {onOptionClick: (option: string) => void}) {
  const handleOptionClick = (option: string) => {
    onOptionClick(option);
  };

  return (
      <aside className={style.sidebar}>
        <Logotype />
        <ul>
          <li className={style.option} onClick={() => handleOptionClick("calendar")}>
            <FontAwesomeIcon icon={faCalendar} className={style.icon}/>
            <span className={style.text}>Agenda</span>
          </li>
          <li className={style.option} onClick={() => handleOptionClick("dashboard")}>
            <FontAwesomeIcon icon={faChartLine} className={style.icon} />
            <span className={style.text}>Métricas</span>
          </li>
          <li className={style.option} onClick={() => handleOptionClick("revenue")}>
            <FontAwesomeIcon icon={faHandHoldingDollar} className={style.icon}/>
            <span className={style.text}>Receitas</span>
          </li>
          <li className={style.option} onClick={() => handleOptionClick("expense")}>
            <FontAwesomeIcon icon={faMoneyBillTransfer} className={style.icon}/>
            <span className={style.text}>Despesas</span>
          </li>
          <li className={style.option} onClick={() => handleOptionClick("monthEndClosing")}>
            <FontAwesomeIcon icon={faBook} className={style.icon}/>
            <span className={style.text}>Caixa Mensal</span>
          </li>
        </ul>
    </aside >
  )
}