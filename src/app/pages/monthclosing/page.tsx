'use client'
import { useEffect, useState, ChangeEvent } from 'react';
import styles from "./MonthClosing.module.css";
import Reports from './reports';
import TabOne from './tab1';
import TabTwo from './tab2';
import TabThree from './tab3';
import Modal from "@/app/common/modal";
import Loading from "@/app/common/loading";
import { RevenueProps } from '@/types/revenue';
import { MonthClosingProps } from '@/types/monthClosing';
import { months, years } from "@/assets/data"
import { getCurrentYear, getCurrentMonth, getNextMonthName } from "@/utils/date"
import { fetchMonthClosing } from '@/utils/api';

interface DataMonthClosing {
  revenue: RevenueProps[];
  setRevenue: (newRevenue: RevenueProps[]) => void;
  monthClosing: MonthClosingProps[];
  setMonthClosing: (newRevenue: MonthClosingProps[]) => void;
}

export default function MonthClosing(
  { revenue, setRevenue, monthClosing, setMonthClosing }: DataMonthClosing
) {
  let tabContent: React.ReactNode;
  const [selectedTab, setSelectedTab] = useState<string>("reports");
  const [buttonText, setButtonText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [revenueDone, setRevenueDone] = useState<boolean>(false);
  const [expensesDone, setExpensesDone] = useState<boolean>(false);
  const [selectedNumberMonth, setSelectedNumberMonth] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [year, setYear] = useState<number>(Number(getCurrentYear()));
  const [orderedRevenue, setOrderedRevenue] = useState<RevenueProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
      setLoading(true);
      const monthClosingData = await fetchMonthClosing(year);
      setMonthClosing(monthClosingData);
      setSelectedTab("reports");
      setLoading(false);
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
  
  
      const updatedRevenue = revenue.map(item => {
  
        let releaseDate = new Date(item.date);
  
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

  const orderRevenue = (filteredRevenue: RevenueProps[]) => {
    if (filteredRevenue && filteredRevenue.length > 0) { 
      const priorityPayments = ["Débito", "Crédito à vista", "Crédito à prazo"];

      const prioritizedRevenue = filteredRevenue.filter(item => 
        priorityPayments.includes(item.payment)
      );
      
      const otherRevenue = filteredRevenue.filter(item => 
        !priorityPayments.includes(item.payment)
      );

      prioritizedRevenue.sort((a, b) => {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
      });

      const sortedRevenue = [...prioritizedRevenue, ...otherRevenue];
      setOrderedRevenue(sortedRevenue);
    }
  };

  const handleYearChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = Number(event.target.value);
    setYear(selectedYear);

    setLoading(true);
    const monthClosingData = await fetchMonthClosing(selectedYear);
    setMonthClosing(monthClosingData);
    setLoading(false);
  };

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
      tabContent = <TabTwo selectedMonthClosing={selectedMonthClosing} orderedRevenue={orderedRevenue}
        setSelectedMonthClosing={setSelectedMonthClosing} />;
      break;
    case "tab3":
      tabContent = <TabThree selectedMonthClosing={selectedMonthClosing} />;
      break;

    default:
      tabContent = <Reports monthClosingList={monthClosing} setSelectedMonthClosing={setSelectedMonthClosing}
        setSelectedTab={setSelectedTab} disableTabForward={disableTabForward} filterRevenue={filterRevenue} />;
  }

  if (loading) {
    return (
      <Loading>
        Carregando...
      </Loading>
    );
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
      {selectedTab === "reports" &&
        <div className="flex">
          <label htmlFor="year">Ano:</label>
          <select
            className={styles.select}
            id="year"
            name="year"
            value={year}
            onChange={handleYearChange}
            required
            aria-label="year"
          >
            <option disabled value="">Ano:</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      }
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
              Confirmo que todas as <strong>receitas de {selectedMonth}</strong> foram cadastras.
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
              Confirmo que todas as <strong>despesas de {getNextMonthName(selectedMonth)}</strong> foram cadastras.
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