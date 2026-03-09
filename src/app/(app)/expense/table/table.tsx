"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Table, Column } from "@/components/table/table";
import { Pagination } from "@/components/pagination/pagination";
import { Tooltip } from "@/components/tooltip__/tooltip";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/utils/date";
import { formatValueToBRL } from "@/utils/utils";
import { Expense } from "@/types/expense";

interface ExpenseTableActions {
  onConfirmStatus: (row: Expense) => void;
  onOpenUpdate: (row: Expense) => void;
  onOpenDelete: (row: Expense) => void;
}

interface ExpenseTableProps {
  data: Expense[];
  actions: ExpenseTableActions;
}

export function ExpenseTable({ data, actions }: ExpenseTableProps) {
  const columns = createColumns(actions);
  const [tooltipRowId, setTooltipRowId] = useState<number | null>(null);

  const { page, setPage } = usePagination();

  const pageSize = 30;

  const paginatedData = data.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function createColumns(actions: ExpenseTableActions): Column<Expense>[] {
    return [
      {
        key: "year",
        header: "Ano",
        align: "center",
        accessor: "year",
      },
      {
        key: "month",
        header: "Mês",
        align: "center",
        accessor: "month",
      },
      {
        key: "name",
        header: "Conta",
        align: "center",
        accessor: "name",
      },
      {
        key: "installments",
        header: "Parcelas",
        align: "center",
        accessor: "installments",
      },
      {
        key: "date",
        header: "Data de Venc.",
        align: "center",
        accessor: "date",
        render: (row) => formatDate(row.date),
      },
      {
        key: "value",
        header: "Valor",
        align: "center",
        render: (row) => formatValueToBRL(row.value),
      },
      {
        key: "is_paid",
        header: "Status",
        align: "center",
        render: (row) => {
          const statusClass = row.is_paid
            ? "t-status t-paid"
            : "t-status t-pay";

          return (
            <button
              className={statusClass}
              onClick={() => actions.onConfirmStatus(row)}
            >
              {row.is_paid ? "Pago" : "À pagar"}
            </button>
          );
        },
      },
      {
        key: "actions",
        header: "",
        align: "right",
        render: (row) => {
          const isTooltipOpen = tooltipRowId === row.id;

          return (
            <div className="flex justify-end">
              {row.notes && (
                <Tooltip
                  content={row.notes}
                  placement="bottom"
                  open={isTooltipOpen}
                  onOpenChange={(open) =>
                    setTooltipRowId(open ? row.id : null)
                  }
                >
                  <span style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      className="table-icon"
                      onClick={() => openNotes(row)}
                    />
                  </span>
                </Tooltip>
              )}

              <FontAwesomeIcon
                icon={faPenToSquare}
                className="table-icon"
                onClick={() => actions.onOpenUpdate(row)}
              />

              <FontAwesomeIcon
                icon={faTrashCan}
                className="table-icon"
                onClick={() => actions.onOpenDelete(row)}
              />
            </div>
          );
        },
      }
    ];
  };

  const openNotes = (row: Expense) => {
    setTooltipRowId((prev) => (prev === row.id ? null : row.id));
  };

  return (
    <>
      <Table
        data={paginatedData}
        columns={columns}
        rowKey={(row) => row.id}
      />

      <Pagination
        page={page}
        totalPages={Math.ceil(data.length / pageSize)}
        onPageChange={setPage}
      />
    </>
  );
};