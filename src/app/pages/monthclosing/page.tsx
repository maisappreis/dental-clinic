'use client'
import { useEffect, useState } from 'react';
import styles from "./MonthClosing.module.css";
import Reports from './reports';
import TabOne from './tab1';
import TabTwo from './tab2';
import TabThree from './tab3';
import Modal from "@/app/components/modal";
import Alert from '@/app/components/alert';
import { RevenueList, RevenueProps } from '@/types/revenue';
import { MonthClosingList } from '@/types/monthClosing';
import { months, years } from "@/assets/data"
import { getCurrentYear, getCurrentMonth } from "@/utils/date"
import axios from "axios";
import { fetchMonthClosing, apiURL, isAuthenticated, configureAxios } from '@/utils/api';

interface DataMonthClosing {
  revenue: RevenueList;
  setRevenue: (newRevenue: RevenueProps[]) => void;
  monthClosing: MonthClosingList;
}

export default function MonthClosing(
  { revenue, setRevenue, monthClosing }: DataMonthClosing
) {
  let tabContent: React.ReactNode;
  const [selectedTab, setSelectedTab] = useState("reports");
  const [buttonText, setButtonText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [revenueDone, setRevenueDone] = useState(false);
  const [expensesDone, setExpensesDone] = useState(false);
  const [selectedNumberMonth, setSelectedNumberMonth] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [alertMessage, setAlertMessage] = useState('');
  const [filteredRevenue, setFilteredRevenue] = useState<RevenueList>([]);
  const [tabsOptions, setTabsOptions] = useState([
    { id: "reports", label: "Relatórios", disabled: false },
    { id: "tab1", label: "Passo 1", disabled: true },
    { id: "tab2", label: "Passo 2", disabled: true },
    { id: "tab3", label: "Passo 3", disabled: true }
  ]);
  const [selectedMonthClosing, setSelectedMonthClosing] = useState({
    id: 0,
    reference: "",
    month: 0,
    year: 0,
    bank_value: 0,
    cash_value: 0,
    card_value: 0,
    gross_revenue: 0,
    net_revenue: 0,
    expenses: 0,
    profit: 0,
    other_revenue: 0,
    balance: 0
  });

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleButtonClick = async () => {
    if (selectedTab === "reports") {
      openModal();
    } else if (selectedTab === "tab1") {
      disableTabForward();
      await updateRevenue();
      setSelectedTab("tab2");
    } else if (selectedTab === "tab2") {
      disableTabForward();
      
      if (selectedMonthClosing.id === 0) {
        await createMonthClosing();
      } else {
        await updateMonthClosing();
      }
      setSelectedTab("tab3");
    } else {
      await fetchMonthClosing();
      setSelectedTab("reports");
      disableTabsOptions();
    }
  }

  const updateRevenue = async () => {
    try {
      const updatedNetValues = revenue.map(item => ({
        id: item.id,
        net_value: item.net_value
      }));

      await axios.put(`${apiURL()}/update-net-values/`, updatedNetValues)
      setAlertMessage("Receita atualizada com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar receita.', error)
      setAlertMessage("Erro ao atualizar receita.");
    }
  }

  const createMonthClosing = async () => {
    try {
      await axios.post(`${apiURL()}/month_closing/create/`, selectedMonthClosing)
      setAlertMessage("Dados salvos com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar os dados.', error)
      setAlertMessage("Erro ao salvar os dados.");
    }
  }

  const updateMonthClosing = async () => {
    try {
      const response = await axios.patch(`${apiURL()}/month_closing/${selectedMonthClosing.id}/`, selectedMonthClosing);
      setSelectedMonthClosing(response.data);

      setAlertMessage("Dados salvos com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar os dados.', error)
      setAlertMessage("Erro ao salvar os dados.");
    }
  }

  const openModal: () => void = () => {
    setShowModal(true);
    setModalTitle("Fechamento de caixa referente ao mês:");
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
    setSelectedMonthClosing({
      id: 0,
      reference: `${selectedMonth} ${selectedYear}`,
      month: selectedNumberMonth,
      year: parseInt(selectedYear, 10),
      bank_value: 0,
      cash_value: 0,
      card_value: 0,
      gross_revenue: 0,
      net_revenue: 0,
      expenses: 0,
      profit: 0,
      other_revenue: 0,
      balance: 0
    });

    disableTabForward();
  }

  const disableTabsOptions = () => {
    const initialTabsOptions = tabsOptions.map(tab => ({
      ...tab,
      disabled: tab.id !== "reports"
    }));
    setTabsOptions(initialTabsOptions);
  };

  const disableTabForward = () => {
    const currentTabIndex = tabsOptions.findIndex(tab => tab.id === selectedTab) + 1 ;   
    const updatedTabsOptions = tabsOptions.map((tab, index) => ({
      ...tab,
      disabled: index > currentTabIndex
    }));
  
    setTabsOptions(updatedTabsOptions);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "year") setSelectedYear(value);
    if (name === "month") {
      setSelectedMonth(value);
      setSelectedNumberMonth(months.indexOf(value) + 1)
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  useEffect(() => {
    if (revenue && revenue.length > 0) {
      const currentMonth = selectedMonthClosing.month;
      const currentYear = selectedMonthClosing.year;

      const currentRevenueMonth = revenue.filter(item => {
        const month = parseInt(item.date.slice(5, 7));
        const year = parseInt(item.date.slice(0, 4));

        return month === currentMonth && year === currentYear;
      })

      setFilteredRevenue(currentRevenueMonth)
    }
  }, [revenue, selectedMonthClosing, setFilteredRevenue])

  useEffect(() => {
    switch (selectedTab) {
      case "reports":
        setButtonText("Novo Fechamento");
        break;
      case "tab1":
        setButtonText("Salvar");
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

  useEffect(() => {
    const currentYear = getCurrentYear();
    const currentMonth = getCurrentMonth();

    if (currentMonth === "Janeiro") {
      setSelectedMonth("Dezembro");
      setSelectedNumberMonth(12);
      const currentYearIndex = years.indexOf(currentYear);
      if (currentYearIndex > 0) {
        setSelectedYear(years[currentYearIndex - 1]);
      } else {
        setSelectedYear(years[years.length - 2]);
      }
    } else {
      setSelectedYear(currentYear);
      const currentMonthIndex = months.indexOf(currentMonth);
      if (currentMonthIndex > 0) {
        setSelectedMonth(months[currentMonthIndex - 1]);
        setSelectedNumberMonth(currentMonthIndex);
      } else {
        setSelectedMonth(months[months.length - 2]);
        setSelectedNumberMonth(1);
      }
    }
  }, [setSelectedMonth])

  switch (selectedTab) {
    case "reports":
      tabContent = <Reports monthClosingList={monthClosing} setSelectedMonthClosing={setSelectedMonthClosing} setSelectedTab={setSelectedTab} disableTabForward={disableTabForward} />;
      break;
    case "tab1":
      tabContent = <TabOne revenue={filteredRevenue} setRevenue={setRevenue} />;
      break;
    case "tab2":
      tabContent = <TabTwo revenue={revenue} selectedMonthClosing={selectedMonthClosing} setSelectedMonthClosing={setSelectedMonthClosing} />;
      break;
    case "tab3":
      tabContent = <TabThree selectedMonthClosing={selectedMonthClosing} />;
      break;

    default:
      tabContent = <Reports monthClosingList={monthClosing} setSelectedMonthClosing={setSelectedMonthClosing} setSelectedTab={setSelectedTab} disableTabForward={disableTabForward} />;
  }

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
            <select id="month" name="month" className="form-select mr-4"
              value={selectedMonth} onChange={handleInputChange} required>
              <option value="" disabled>Selecione:</option>
              {months.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
            <select id="year" name="year" className="form-select"
              value={selectedYear} onChange={handleInputChange} required>
              <option value="" disabled>Selecione:</option>
              {years.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex form-item">
            <input id="revenue" name="revenue" type="checkbox" className="form-radio"
              checked={revenueDone} onChange={(e) => {
                const checked = (e.target as HTMLInputElement).checked;
                setRevenueDone(checked);
              }}
            />
            <label htmlFor="has-installments" className="form-label">
              Confirmo que todas as receitas do <strong>mês passado</strong> foram cadastras.
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
              Confirmo que todas as despesas <strong>deste mês</strong> foram cadastras.
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
      <Alert message={alertMessage} />
    </div>
  )
}