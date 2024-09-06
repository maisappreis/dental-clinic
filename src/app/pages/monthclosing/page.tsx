'use client'
import { useEffect, useState } from 'react';
import styles from "./MonthClosing.module.css";
import Reports from './reports';
import TabOne from './tab1';
import TabTwo from './tab2';
import TabThree from './tab3';
import Modal from "@/app/components/modal";
import { RevenueList, RevenueProps } from '@/types/revenue';
import { MonthClosingList, MonthClosingProps } from '@/types/monthClosing';
import { months, years } from "@/assets/data"
import { getCurrentYear, getCurrentMonth, getNextMonthName } from "@/utils/date"
import { fetchMonthClosing } from '@/utils/api';

interface DataMonthClosing {
  revenue: RevenueList;
  setRevenue: (newRevenue: RevenueProps[]) => void;
  monthClosing: MonthClosingList;
  setMonthClosing: (newRevenue: MonthClosingProps[]) => void;
}

export default function MonthClosing(
  { revenue, setRevenue, monthClosing, setMonthClosing }: DataMonthClosing
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
  const [orderedRevenue, setOrderedRevenue] = useState<RevenueList>([]);
  const [tabsOptions, setTabsOptions] = useState([
    { id: "reports", label: "Relatórios", disabled: false },
    { id: "tab1", label: "Passo 1", disabled: true },
    { id: "tab2", label: "Passo 2", disabled: true },
    { id: "tab3", label: "Resumo", disabled: true }
  ]);
  const [selectedMonthClosing, setSelectedMonthClosing] = useState({
    id: 0,
    reference: "",
    month: 0,
    year: 0,
    bank_value: 0,
    cash_value: 0,
    card_value: 0,
    card_value_next_month: 0,
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
      setSelectedTab("tab2");
    } else if (selectedTab === "tab2") {
      disableTabForward();
      setSelectedTab("tab3");
    } else {
      const monthClosingData = await fetchMonthClosing();
      setMonthClosing(monthClosingData);
      setSelectedTab("reports");
      disableTabsOptions();
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
    setSelectedMonthClosing({
      id: 0,
      reference: `${selectedMonth} ${selectedYear}`, // TODO: será que é necessário um useEffect
      month: selectedNumberMonth,                   // para o setSelectedYear e Month?
      year: parseInt(selectedYear, 10),       // não poderia ser uma função chamada aqui?
      bank_value: 0,
      cash_value: 0,
      card_value: 0,
      card_value_next_month: 0,
      gross_revenue: 0,
      net_revenue: 0,
      expenses: 0,
      profit: 0,
      other_revenue: 0,
      balance: 0
    });

    filterRevenue(selectedNumberMonth, parseInt(selectedYear, 10));
    disableTabForward();
    setSelectedTab("tab1");
  }

  const disableTabsOptions = () => {
    const initialTabsOptions = tabsOptions.map(tab => ({
      ...tab,
      disabled: tab.id !== "reports"
    }));
    setTabsOptions(initialTabsOptions);
  };

  const disableTabForward = () => {
    const currentTabIndex = tabsOptions.findIndex(tab => tab.id === selectedTab) + 1;
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

  const filterRevenue = (selectedNumberMonth: number, selectedYear: number) => {
    if (revenue && revenue.length > 0) {
      const currentMonth = selectedNumberMonth;
      const currentYear = selectedYear
  
      const addDaysToDate = (dateStr: string, days: number) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date;
      };
  
      const updatedRevenue = revenue.map(item => {
        const isCredit = item.payment === "Crédito à vista" || item.payment === "Crédito à prazo";
  
        let releaseDate = new Date(item.date);
        if (isCredit) {
          releaseDate = addDaysToDate(item.date, 30);
        }
  
        return {
          ...item,
          release_date: releaseDate.toISOString().slice(0, 10),
        };
      });
      setRevenue(updatedRevenue);
  
      const filteredRevenue = updatedRevenue.filter(item => {
        const releaseMonth = parseInt(item.release_date.slice(5, 7));
        const releaseYear = parseInt(item.release_date.slice(0, 4));
  
        return releaseMonth === currentMonth && releaseYear === currentYear;
      });
  
      orderRevenue(filteredRevenue);
    }
  }

  const orderRevenue = (filteredRevenue: RevenueList) => {
    if (filteredRevenue && filteredRevenue.length > 0) { 
      const priorityPayments = ["Débito", "Crédito à vista", "Crédito à prazo"];

      const prioritizedRevenue = filteredRevenue.filter(item => 
        priorityPayments.includes(item.payment)
      );
      
      const otherRevenue = filteredRevenue.filter(item => 
        !priorityPayments.includes(item.payment)
      );

      prioritizedRevenue.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      const sortedRevenue = [...prioritizedRevenue, ...otherRevenue];
      setOrderedRevenue(sortedRevenue);
    }
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
      tabContent = <Reports monthClosingList={monthClosing} setSelectedMonthClosing={setSelectedMonthClosing}
        setSelectedTab={setSelectedTab} disableTabForward={disableTabForward} filterRevenue={filterRevenue} />;
      break;
    case "tab1":
      tabContent = <TabOne orderedRevenue={orderedRevenue} setRevenue={setRevenue} />;
      break;
    case "tab2":
      tabContent = <TabTwo revenue={revenue} selectedMonthClosing={selectedMonthClosing}
        setSelectedMonthClosing={setSelectedMonthClosing} />;
      break;
    case "tab3":
      tabContent = <TabThree selectedMonthClosing={selectedMonthClosing} />;
      break;

    default:
      tabContent = <Reports monthClosingList={monthClosing} setSelectedMonthClosing={setSelectedMonthClosing}
        setSelectedTab={setSelectedTab} disableTabForward={disableTabForward} filterRevenue={filterRevenue} />;
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
        <button className="btn blue size-fit" onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
      {showModal &&
        <Modal title={modalTitle}>
          <div className="flex form-item">
            <select id="month" name="month" className="form-select mr-4"
              value={selectedMonth} onChange={handleInputChange} required>
              <option value="" disabled>Selecione:</option>
              {months.slice(0, 12).map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
            <select id="year" name="year" className="form-select"
              value={selectedYear} onChange={handleInputChange} required>
              <option value="" disabled>Selecione:</option>
              {years.slice(0, 12).map((option, i) => (
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
              Confirmo que todas as receitas do <strong>{selectedMonth}</strong> foram cadastras.
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
              Confirmo que todas as despesas <strong>{getNextMonthName(selectedMonth)}</strong> foram cadastras.
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