"use client";

import React from "react";
import styles from "../MonthClosing.module.css";
import { SummaryBlock } from "@/app/(app)/monthclosing/summary/block";
import { MessageCard } from "@/components/message/message";
import { formatValueToBRL } from "@/utils/utils";
import { buildMonthClosingSummary } from "@/app/(app)/monthclosing/domain/summaryUtils";
import { useMonthClosingFlow } from "@/app/(app)/monthclosing/provider";


export default function Summary() {
  const { selectedMonthClosing } = useMonthClosingFlow();

  if (!selectedMonthClosing) {
    return (
      <MessageCard 
        title="Nenhum relatório de fechamento de caixa foi selecionado."
        subtitle="Volte para a aba Relatórios para selecionar."
        variant="error"
      />
    );
  };

  const data = buildMonthClosingSummary(selectedMonthClosing);

  const balanceColor =
    data.balance >= 0 ? styles.green : styles.red;

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className={`${styles.summary} flex-1`}>
          <SummaryBlock
            title="Resumo"
            items={data.summary} />
        </div>

        <div className={`${styles.inputs} flex-1`}>
          <SummaryBlock
            title="Entradas"
            items={data.inputs}
            total={data.totalInputs}
          />
        </div>

        <div className={`${styles.outputs} flex-1`}>
          <SummaryBlock
            title="Saídas"
            items={data.outputs}
            total={data.totalOutputs}
          />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <h3 className={`font-bold text-2xl ${balanceColor}`}>
          SALDO: {formatValueToBRL(data.balance)}
        </h3>
      </div>
    </div>
  );
};