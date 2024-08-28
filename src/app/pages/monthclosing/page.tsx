'use client'
import { useEffect, useState } from 'react';
import styles from "./MonthClosing.module.css";
import Reports from './reports';
import TabOne from './tab1';
import TabTwo from './tab2';
import TabThree from './tab3';

export default function MonthClosing() {
  let tabContent: React.ReactNode;
  const [selectedTab, setSelectedTab] = useState("reports");
  const [buttonText, setButtonText] = useState("");

  const tabsOptions = [
    { id: "reports", label: "Relatórios" },
    { id: "tab1", label: "Passo 1" },
    { id: "tab2", label: "Passo 2" },
    { id: "tab3", label: "Passo 3" }
  ];

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  switch (selectedTab) {
    case "reports":
      tabContent = <Reports />;
      break;
    case "tab1":
      tabContent = <TabOne />;
      break;
    case "tab2":
      tabContent = <TabTwo />;
      break;
    case "tab3":
      tabContent = <TabThree />;
      break;

    default:
      tabContent = <TabOne />;
  }

  useEffect(() => {
    switch (selectedTab) {
      case "reports":
        setButtonText("Novo Fechamento");
        break;
      case "tab1":
        setButtonText("Avançar");
        break;
      case "tab2":
        setButtonText("Avançar");
        break;
      case "tab3":
        setButtonText("Concluir");
        break;
      default:
        setButtonText("");
    }
  }, [selectedTab]);

  return (
    <div className="content">
      <div className={styles.tabs}>
        {tabsOptions.map(tab => (
          <div
            key={tab.id}
            className={`${styles.tab} ${selectedTab === tab.id ? styles.selected : ""}`}
            onClick={() => handleTabClick(tab.id)}>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {tabContent}
      </div>
      <div className="flex justify-end w-full align-bottom mt-3">
        <button className="btn green size-fit">
          {buttonText}
        </button>
      </div>
    </div>
  )
}