"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Table, Column } from "@/components/table/table";
import { Tooltip } from "@/components/tooltip/tooltip";
import { formatDate } from "@/utils/date";
import { formatValueToBRL } from "@/utils/utils";
import { Revenue } from "@/types/revenue";

interface RevenueTableActions {
  onOpenUpdate: (row: Revenue) => void;
  onOpenDelete: (row: Revenue) => void;
}

interface RevenueTableProps {
  data: Revenue[];
  actions: RevenueTableActions;
}

export function RevenueTable({ data, actions }: RevenueTableProps) {
  const columns = createColumns(actions);
  const [tooltipRowId, setTooltipRowId] = useState<number | null>(null);

  function createColumns(actions: RevenueTableActions): Column<Revenue>[] {
    return [
      {
        key: "date",
        header: "Data",
        align: "center",
        accessor: "date",
        render: (row) => formatDate(row.date),
      },
      {
        key: "name",
        header: "Paciente",
        align: "center",
        accessor: "name",
      },
      {
        key: "cpf",
        header: "CPF",
        align: "center",
        accessor: "cpf",
      },
      {
        key: "nf",
        header: "NF",
        align: "center",
        accessor: "nf",
        render: (row) => {
          return (
            <div>
              {
                (row.nf ?
                  <FontAwesomeIcon icon={faCheck} className="table-icon" /> :
                  <FontAwesomeIcon icon={faXmark} className="table-icon" />
                )
              }
            </div>
          )
        }
      },
      {
        key: "procedure",
        header: "Proced.",
        align: "center",
        accessor: "procedure",
      },
      {
        key: "payment",
        header: "Pagamento",
        align: "center",
        accessor: "payment",
      },
      {
        key: "installments",
        header: "Parcelas",
        align: "center",
        accessor: "installments",
      },
      {
        key: "value",
        header: "Valor",
        align: "center",
        render: (row) => formatValueToBRL(row.value),
      },
      {
        key: "actions",
        header: "",
        align: "right",
        render: (row) => {
          const isTooltipOpen = tooltipRowId === row.id;

          return (
            <div>
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

  const openNotes = (row: Revenue) => {
    setTooltipRowId((prev) => (prev === row.id ? null : row.id));
  };

  return (
    <Table
      data={data}
      columns={columns}
      rowKey={(row) => row.id}
    />
  );
};