import { useState } from "react";
import Logotype from "./logotype";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCalendar, faHandHoldingDollar, faMoneyBillTransfer, faBook } from '@fortawesome/free-solid-svg-icons';
import style from "./styles/Sidebar.module.css";


export default function Sidebar({ onOptionClick }: {onOptionClick: (option: string) => void}) {
  const [selectedOption, setSelectedOption] = useState<string>("revenue");

  const handleOptionClick = (option: string) => {
    onOptionClick(option);
    setSelectedOption(option);
  };

  const options = [
    { id: "calendar", icon: faCalendar, label: "Agenda" },
    { id: "dashboard", icon: faChartLine, label: "Métricas" },
    { id: "revenue", icon: faHandHoldingDollar, label: "Receitas" },
    { id: "expense", icon: faMoneyBillTransfer, label: "Despesas" },
    { id: "monthEndClosing", icon: faBook, label: "Caixa Mensal" }
  ];

  return (
    <aside className={style.sidebar}>
      <Logotype />
      <ul>
        {options.map(option => (
          <li
            key={option.id} 
            className={`${style.option} ${selectedOption === option.id ? style.selected : ""}`} 
            onClick={() => handleOptionClick(option.id)}
          >
            <FontAwesomeIcon 
              icon={option.icon} 
              className={`${style.icon} ${selectedOption === option.id ? style.selectedIcon : ""}`} 
            />
            <span className={style.text}>{option.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );

  // return (
  //     <aside className={style.sidebar}>
  //       <Logotype />
  //       <ul>
  //         <li className={`${style.option} ${selectedOption === "calendar" ? style.selected : ""}`}
  //           onClick={() => handleOptionClick("calendar")}>
  //           <FontAwesomeIcon icon={faCalendar} className={style.icon}/>
  //           <span className={style.text}>Agenda</span>
  //         </li>
  //         <li className={`${style.option} ${selectedOption === "dashboard" ? style.selected : ""}`}
  //           onClick={() => handleOptionClick("dashboard")}>
  //           <FontAwesomeIcon icon={faChartLine} className={style.icon} />
  //           <span className={style.text}>Métricas</span>
  //         </li>
  //         <li className={`${style.option} ${selectedOption === "revenue" ? style.selected : ""}`}
  //           onClick={() => handleOptionClick("revenue")}>
  //           <FontAwesomeIcon icon={faHandHoldingDollar} className={style.icon}/>
  //           <span className={style.text}>Receitas</span>
  //         </li>
  //         <li className={`${style.option} ${selectedOption === "expense" ? style.selected : ""}`}
  //           onClick={() => handleOptionClick("expense")}>
  //           <FontAwesomeIcon icon={faMoneyBillTransfer} className={style.icon}/>
  //           <span className={style.text}>Despesas</span>
  //         </li>
  //         <li className={`${style.option} ${selectedOption === "monthEndClosing" ? style.selected : ""}`}
  //           onClick={() => handleOptionClick("monthEndClosing")}>
  //           <FontAwesomeIcon icon={faBook} className={style.icon}/>
  //           <span className={style.text}>Caixa Mensal</span>
  //         </li>
  //       </ul>
  //   </aside >
  // )
}