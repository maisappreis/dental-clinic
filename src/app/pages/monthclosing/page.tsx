'use client'
import { useEffect, useState } from 'react';
import styles from "./MonthClosing.module.css";
import Reports from './reports';
import TabOne from './tab1';
import TabTwo from './tab2';
import TabThree from './tab3';
import Modal from "@/app/components/modal";

export default function MonthClosing() {
  let tabContent: React.ReactNode;
  const [selectedTab, setSelectedTab] = useState("reports");
  const [buttonText, setButtonText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [revenueDone, setRevenueDone] = useState(false);
  const [expensesDone, setExpensesDone] = useState(false);
  const [tabsOptions, setTabsOptions] = useState([
    { id: "reports", label: "Relatórios", disabled: false },
    { id: "tab1", label: "Passo 1", disabled: true },
    { id: "tab2", label: "Passo 2", disabled: true },
    { id: "tab3", label: "Passo 3", disabled: true }
  ]);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleButtonClick = () => {
    if (selectedTab === "reports") {
      openModal();
    } else if (selectedTab === "tab1") {
      setSelectedTab("tab2");
    } else if (selectedTab === "tab2") {
      setSelectedTab("tab3");
    } else {
      console.log("Salvar e concluir")
      setSelectedTab("reports");
      disableTabsOptions();
    }
  }

  const openModal: () => void = () => {
    setShowModal(true);
    setModalTitle("Fechamento de caixa referente ao mês Agosto/2024");
  };

  const closeModal = () => {
    setShowModal(false);
    setRevenueDone(false);
    setExpensesDone(false);
  };

  const isConfirmed = revenueDone && expensesDone;

  const onConfirmationClick = () => {
    setShowModal(false);
    setSelectedTab("tab1");

    const updatedTabsOptions = tabsOptions.map(tab => ({
      ...tab,
      disabled: false
    }));
  
    setTabsOptions(updatedTabsOptions);
  }

  const disableTabsOptions = () => {
    const initialTabsOptions = tabsOptions.map(tab => ({
      ...tab,
      disabled: tab.id !== "reports"
    }));
    setTabsOptions(initialTabsOptions);
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
          <button
            key={tab.id}
            className={`${styles.tab} ${selectedTab === tab.id ? styles.selected : ""}`}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tabContent}
      </div>
      <div className="flex justify-end w-full align-bottom mt-3">
        <button className="btn green size-fit" onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
      {showModal &&
        <Modal title={modalTitle}>
          <div className="flex form-item">
            <input id="revenue" name="revenue" type="checkbox" className="form-radio"
              checked={revenueDone} onChange={(e) => {
                const checked = (e.target as HTMLInputElement).checked;
                setRevenueDone(checked);
              }}
            />
            <label htmlFor="has-installments" className="form-label">
              Confirmo que todas as receitas do mês passado, Agosto, foram cadastras.
            </label>
          </div>
          <div className="flex form-item">
            <input id="expense" name="expense" type="checkbox" className="form-radio"
              checked={expensesDone} onChange={(e) => {
                const checked = (e.target as HTMLInputElement).checked;
                setExpensesDone(checked);
              }}
            />
            <label htmlFor="has-installments" className="form-label">
              Confirmo que todas as despesas do mês seguinte, Setembro, foram cadastras.
            </label>
          </div>
          <div className="flex justify-around mt-4">
            <button className="btn green size" disabled={!isConfirmed} onClick={onConfirmationClick}>
              Confirmo
            </button>
            <button onClick={closeModal} className="btn red size">
              Cancelar
            </button>
          </div>
        </Modal>
      }
    </div>
  )
}