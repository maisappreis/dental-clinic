"use client";
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
    { id: "monthClosing", icon: faBook, label: "Caixa Mensal" }
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
}