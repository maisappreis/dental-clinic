"use client";

import { useEffect, useState } from "react";
import styles from "../MonthClosing.module.css";
import { Button } from "@/components/button/button";
import { Select } from "@/components/form/select";
import { Spinner } from "@/components/spinner/spinner";
import { MessageCard } from "@/components/message/message";
import { CashClosingModal } from "@/app/(app)/monthclosing/reports/modal";
import { years } from "@/constants/date";
import { getCurrentYear } from "@/utils/date"
import { useMonthClosing } from "@/hooks/useMonthClosing";
import { useMonthClosingStart } from "@/hooks/useMonthClosingStart";
import { MonthClosing, CashClosingConfirmation } from "@/types/monthClosing";


export default function Reports() {
  const [year, setYear] = useState<number>(Number(getCurrentYear()));
  const [showModal, setShowModal] = useState<boolean>(false);

  const { monthClosing, fetchMonthClosing, isLoading } = useMonthClosing([]);
  const { startFromExisting, startNew } = useMonthClosingStart();

  const startNewReport = (data: CashClosingConfirmation) => {
    setShowModal(false);

    startNew({
      id: 0,
      reference: `${data.month} ${data.year}`,
      month: data.monthNumber,
      year: Number(data.year),
      bank_value: 0,
      cash_value: 0,
      card_value: 0,
      card_value_next_month: 0,
      gross_revenue: 0,
      net_revenue: 0,
      expenses: 0,
      profit: 0,
      other_revenue: 0,
      balance: 0,
    });
  };

  const openExistingReport = (report: MonthClosing) => {
    startFromExisting(report);
  };

  const openModal = async () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    fetchMonthClosing(year);
  }, [fetchMonthClosing, year]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {isLoading && <Spinner />}

      <div className="flex justify-left w-full flex-wrap gap-3">
        {!isLoading && monthClosing.length > 0 && (
          monthClosing.map((report) => (
            <div
              key={report.id}
              className={styles.report}
              onClick={() => openExistingReport(report)}
            >
              {report.reference}
            </div>
          ))
        )}

        {!isLoading && monthClosing.length === 0 && (
          <div className="w-full">
            <MessageCard 
              title="Nenhum relatório de fechamento de caixa encontrado neste ano."
              subtitle="Tente selecionar outro ano."
              variant="error"
            />
          </div>
          
        )}
      </div>

      <div className="flex justify-between items-end">
        <div className="w-40">
          <Select
            label="Ano:"
            value={year}
            options={years.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={(year) => {
              setYear(Number(year));
            }}
          />
        </div>

        <Button
          label="Novo Fechamento"
          variant="primary"
          size="lg"
          onClick={openModal}
        />
      </div>

      <CashClosingModal
        open={showModal}
        onConfirmation={startNewReport}
        onClose={closeModal}
      />
    </div>
  );
};