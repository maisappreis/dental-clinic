"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button/button";
import { MessageCard } from "@/components/message/message";
import { RatesForm } from "@/app/(app)/monthclosing/tab1/form/form";
import { TabOneTable } from "@/app/(app)/monthclosing/tab1/table/table";
import { useMonthClosing } from "@/hooks/useMonthClosing";
import { orderRevenue, calculateNetRevenue } from  "@/app/(app)/monthclosing/domain/tab1Utils";
import { useMonthClosingFlow } from "@/app/(app)/monthclosing/provider/provider";
import { Revenue } from '@/types/revenue';
import { Rates } from "@/types/monthClosing";


export default function TabOne() {
  const [revenueData, setRevenueData] = useState<Revenue[]>([]);
  const [rates, setRates] = useState({
    debit: 1.09,
    cashCredit: 3,
    installmentCredit: 3.4,
  });

  const router = useRouter();

  const { closingRevenue } = useMonthClosingFlow();
  const { updateNetValues } = useMonthClosing();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number) => {
    const { value } = e.target;

    setRevenueData((prevData) =>
      prevData.map((item, index) =>
        index === rowIndex
          ? { ...item, net_value: parseFloat(value) }
          : item
      )
    );
  };

  const saveRevenue = async () => {
    const payload = revenueData.map(({ id, net_value, date }) => ({
      id,
      net_value,
      date,
    }));

    await updateNetValues(payload);
  };

  const onRateChange = (rates: Rates) => {
    setRates(rates);
    setRevenueData(prev => calculateNetRevenue(prev, rates));
  };

  useEffect(() => {
    if (!closingRevenue.length) return;

    const ordered = orderRevenue(closingRevenue);
    setRevenueData(
      ordered.some(r => r.net_value > 0)
        ? ordered
        : calculateNetRevenue(ordered, rates)
    );
  }, [closingRevenue, rates]);

  if (!revenueData || revenueData.length === 0) {
    return (
      <MessageCard 
        title="Nenhum relatório de fechamento de caixa foi selecionado."
        subtitle="Volte para a aba Relatórios para selecionar."
        variant="error"
      />
    );
  };

  return (
    <>
      <RatesForm value={rates} onChange={onRateChange} />

     <TabOneTable
        data={revenueData}
        actions={{
          onInputChange: handleInputChange
        }}
      />

      <div className="flex justify-end gap-3 mt-3">
        <Button
          label="Salvar"
          variant="primary"
          size="lg"
          onClick={saveRevenue}
        />
        <Button
          label="Avançar"
          size="lg"
          onClick={() => router.push("/monthclosing/tab2")}
        />
      </div>
    </>
  );
};