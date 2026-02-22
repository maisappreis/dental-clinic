"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { formatDate, getNextMonth, getMonthAndYear } from "@/utils/date";
import { apiURL, fetchExpenses, isAuthenticated, configureAxios } from '@/utils/api';
import { ExpenseProps } from "@/types/expense";
import { formatValueToBRL } from "@/utils/utils";
import Tooltip from "@/app/common/tooltip"
import Modal from "@/app/common/modal";
import ExpenseForm from "./form";
import { Loading } from "@/components/Loading/Loading";
import { useAlertStore } from "@/stores/alert.store";
import axios from "axios";

interface Data {
  [key: string]: any;
}

interface Columns {
  key: string;
  name: string;
}

interface TableProps {
  columns: Columns[];
  data: Data[];
  setExpenses: (newExpenses: any[]) => void;
}

export default function Table({ columns, data, setExpenses }: TableProps) {
  const [statusClasses, setStatusClasses] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<ExpenseProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showAlert } = useAlertStore();

  const openNotes = (row: ExpenseProps, e: React.MouseEvent): void => {
    setSelectedRow(row);
    setShowTooltip(!showTooltip);
    setTooltipPosition({
      top: e.clientY - 20,
      left: e.clientX - 150,
    });
  }

  const openConfirmationModal = (row: ExpenseProps): void => {
    setSelectedRow(row);

    let title = "";

    if (row.is_paid) {
      title = "Marcar como à pagar?";
    } else {
      title = "Marcar como pago?";
    }

    setModalTitle(title);
    setShowConfirmationModal(true);
  }

  const changePaymentStatus = async () => {
    if (selectedRow) await updateExpense(selectedRow)
    setShowConfirmationModal(false);
  }

  const openUpdateModal = (row: ExpenseProps): void => {
    setShowUpdateModal(true);
    setModalTitle("Atualizar Despesa");
    setSelectedRow(row);
  };

  const openDeleteModal = (row: ExpenseProps): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Despesa");
    setSelectedRow(row);
  };

  const updateExpense = async (row: ExpenseProps) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`${apiURL()}/expense/${row.id}/`, {
        is_paid: !row.is_paid
      })
      showAlert({
        message: "Despesa atualizada com sucesso!",
        variant: "success",
        autoCloseAfter: 2000,
      });

      const isPaid = response.data.is_paid;
      const hasInstallments = response.data.installments !== "";

      if (isPaid && !hasInstallments) {
        await createNextMonthExpense(row);
      } else {
        const newExpense = await fetchExpenses();
        setExpenses(newExpense)
      }
    } catch (error) {
      console.error('Erro ao atualizar despesa.', error)
      showAlert({
        message: "Erro ao atualizar despesa.",
        variant: "error",
        autoCloseAfter: 2000,
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  }

  const createNextMonthExpense = async (row: ExpenseProps) => {
    setIsLoading(true);
    try {
      const selectedRowClone = {...row}
      const nextMonthDate = getNextMonth(selectedRowClone.date);
      const [month, year] = getMonthAndYear(nextMonthDate);

      selectedRowClone.date = nextMonthDate;
      selectedRowClone.is_paid = false;
      selectedRowClone.month = month;
      selectedRowClone.year = parseInt(year);

      await axios.post(`${apiURL()}/expense/create/`, selectedRowClone)

      showAlert({
        message: "Despesa do mês seguinte criada com sucesso!",
        variant: "success",
        autoCloseAfter: 2000,
      });

      const newExpense = await fetchExpenses();
      setExpenses(newExpense);
    } catch (error) {
      console.error('Erro ao criar despesa do mês seguinte.', error)

      showAlert({
        message: "Erro ao criar despesa do mês seguinte.",
        variant: "error",
        autoCloseAfter: 2000,
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  }

  const deleteExpense = async () => {
    setIsLoading(true);
    try {
      if (selectedRow && selectedRow.id) {
        await axios.delete(`${apiURL()}/expense/${selectedRow.id}/`)

        showAlert({
          message: "Despesa excluída com sucesso!",
          variant: "success",
          autoCloseAfter: 2000,
        });
        const newExpense = await fetchExpenses();
        setExpenses(newExpense)
      }
    } catch (error) {
      console.error('Erro ao excluir despesa.', error)

      showAlert({
        message: "Erro ao excluir despesa.",
        variant: "error",
        autoCloseAfter: 2000,
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setShowConfirmationModal(false);
  }

  useEffect(() => {
    const classes = data.map(row =>
      `t-status ${row.is_paid ? 't-paid' : 't-pay'}`
    );
    setStatusClasses(classes);
  }, [data]);

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  if (isLoading) {
    return (
      <Loading
        label="Salvando..."
      />
    );
  }

  return (
    <div>
      <div className="table-overflow">
        {data.length > 0 ?
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.name}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.key === 'value' ?
                        `${formatValueToBRL(row[column.key])}`
                        : column.key === 'date' ?
                          formatDate(row[column.key])
                          : column.key === 'is_paid' ?
                            <button
                              className={statusClasses[rowIndex]}
                              onClick={() => openConfirmationModal(row)}
                            >
                              {row[column.key] ? "Pago" : "À pagar"}
                            </button>
                            : row[column.key]}
                    </td>
                  ))}
                  <td>
                    <div>
                      {row['notes'] !== "" &&
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="table-icon"
                          onClick={(e) => openNotes(row, e)}
                        />
                      }
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="table-icon"
                        onClick={() => openUpdateModal(row)}
                      />
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="table-icon"
                        onClick={() => openDeleteModal(row)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          : <div className="no-data">Nenhum resultado encontrado.</div>
        }
      </div >
      {showTooltip && selectedRow && (
        <Tooltip top={tooltipPosition.top} left={tooltipPosition.left}>
          {selectedRow.notes}
        </Tooltip>
      )}
      {showUpdateModal && selectedRow &&
        <Modal title={modalTitle}>
          <ExpenseForm
            selectedRow={selectedRow}
            closeModal={closeModal}
            setExpenses={setExpenses}
          />
        </Modal>
      }
      {showDeleteModal && selectedRow &&
        <Modal title={modalTitle}>
          <h4 className="my-5 text-center">Tem certeza que deseja excluir o valor de
            <strong>{formatValueToBRL(selectedRow.value)}
            </strong> referente a despesa de <strong>{selectedRow.name}</strong>?
          </h4>
          <div className="flex justify-around">
            <button onClick={deleteExpense} className="btn red size">
              Excluir
            </button>
            <button onClick={closeModal} className="btn size blue">
              Cancelar
            </button>
          </div>
        </Modal>
      }
      {showConfirmationModal && selectedRow &&
        <Modal title={modalTitle}>
          <div className="flex justify-around mt-3">
            <button onClick={changePaymentStatus} className="btn green size">
              Confirmar
            </button>
            <button onClick={closeModal} className="btn red size">
              Cancelar
            </button>
          </div>
        </Modal>
      }
    </div >
  )
}