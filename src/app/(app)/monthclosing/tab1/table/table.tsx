"use client";

import React from "react";
import { Table, Column } from "@/components/table/table";
import { formatDate } from "@/utils/date";
import { formatValueToBRL } from "@/utils/utils";
import { Revenue } from "@/types/revenue";
import styles from "../../MonthClosing.module.css";

interface TabOneTableActions {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
};

interface TabOneTableProps {
  data: Revenue[];
  actions: TabOneTableActions;
};

export function TabOneTable({ data, actions }: TabOneTableProps) {
  const columns = createColumns(actions);

  function createColumns(actions: TabOneTableActions): Column<Revenue>[] {
    return [
      {
        key: "date",
        header: "Data Pgto",
        align: "center",
        accessor: "date",
        render: (row) => formatDate(row.date),
      },
      {
        key: "release_date",
        header: "Data Liberação",
        align: "center",
        accessor: "release_date",
        render: (row) => formatDate(row.date),
      },
      {
        key: "name",
        header: "Nome",
        align: "center",
        accessor: "name",
      },
      {
        key: "payment",
        header: "Pagamento",
        align: "center",
        accessor: "payment",
        render: (row) => {
          const isHighlighted = 
            ["Débito", "Crédito à vista", "Crédito à prazo"]
            .includes(row.payment);

          return (
            <span
              style={isHighlighted
                ? { color: 'red', fontWeight: 'bold' }
                : undefined}>
              {row.payment}
            </span>
          )
        }
      },
      {
        key: "installments",
        header: "Parcelas",
        align: "center",
        accessor: "installments",
      },
      {
        key: "value",
        header: "Valor Bruto",
        align: "center",
        render: (row) => {
          const isHighlighted = 
            ["Débito", "Crédito à vista", "Crédito à prazo"].includes(row.payment);

          return (
            <span 
              style={isHighlighted
                ? { color: 'red', fontWeight: 'bold' }
                : undefined}>
              {formatValueToBRL(row.value)}
            </span>
          )
        }
      },
      {
        key: "net_value",
        header: "Valor Líq.",
        align: "center",
        render: (row, index) => {
          return (
            <input
              id={`net-value-${index}`}
              name="net-value"
              type="number"
              className={styles.inputThin}
              onChange={(e) => actions.onInputChange(e, index)}
              value={row.net_value}
              min="0.001"
              step="0.001"
              required
            />
          );
        },
      },
    ];
  };

  return (
    <Table
      data={data}
      columns={columns}
      rowKey={(row) => row.id}
      maxHeight="50vh"
    />
  );
};