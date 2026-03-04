"use client";

import React from "react";
import styles from "./Summary.module.css";
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

  return (
    <div className="flex-col">
      <div className="flex justify-center w-full">
        <div className={styles.summary}>
          <SummaryBlock title="Resumo" items={data.summary} />
        </div>

        <div className={styles.inputs}>
          <SummaryBlock
            title="Entradas"
            items={data.inputs}
            total={data.totalInputs}
          />
        </div>

        <div className={styles.outputs}>
          <SummaryBlock
            title="Saídas"
            items={data.outputs}
            total={data.totalOutputs}
          />
        </div>
      </div>

      <div className="flex justify-center w-full mt-4">
        <div className={`flex ${styles.box}`}>
          <h3 className="font-bold">
            Saldo consultório:{" "}
            {formatValueToBRL(data.balance)}
          </h3>
        </div>
      </div>
    </div>
  );
};