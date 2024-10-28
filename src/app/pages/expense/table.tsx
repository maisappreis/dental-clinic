"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "@/app/common/tooltip"
import Modal from "@/app/common/modal";
import ExpenseForm from "./form";
import { formatDate, getNextMonth, getMonthAndYear } from "@/utils/date";
import { apiURL, fetchExpenses, isAuthenticated, configureAxios } from '@/utils/api';
import Alert from '@/app/common/alert'
import axios from "axios";
import { ExpenseProps } from "@/types/expense";
import { formatValueToBRL } from "@/utils/utils";

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedRow, setSelectedRow] = useState<ExpenseProps | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

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
    try {
      const response = await axios.patch(`${apiURL()}/expense/${row.id}/`, {
        is_paid: !row.is_paid
      })
      setAlertMessage("Despesa atualizada com sucesso!");

      const isPaid = response.data.is_paid;
      const hasInstallments = response.data.installments !== "";

      if (isPaid && !hasInstallments) {
        await createNextMonthExpense(row);
      } else {
        const newExpense = await fetchExpenses();
        setExpenses(newExpense)
      }

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar despesa.', error)
      setAlertMessage("Erro ao atualizar despesa.");
    }
  }

  const createNextMonthExpense = async (row: ExpenseProps) => {
    try {
      const selectedRowClone = {...row}
      const nextMonthDate = getNextMonth(selectedRowClone.date);
      const [month, year] = getMonthAndYear(nextMonthDate);

      selectedRowClone.date = nextMonthDate;
      selectedRowClone.is_paid = false;
      selectedRowClone.month = month;
      selectedRowClone.year = parseInt(year);

      await axios.post(`${apiURL()}/expense/create/`, selectedRowClone)
      setAlertMessage("Despesa do mês seguinte criada com sucesso!");
      const newExpense = await fetchExpenses();
      setExpenses(newExpense);

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar despesa do mês seguinte.', error)
      setAlertMessage("Erro ao criar despesa do mês seguinte.");
    }
  }

  const deleteExpense = async () => {
    try {
      if (selectedRow && selectedRow.id) {
        await axios.delete(`${apiURL()}/expense/${selectedRow.id}/`)
        setAlertMessage("Despesa excluída com sucesso!");
        const newExpense = await fetchExpenses();
        setExpenses(newExpense)

        setTimeout(() => {
          closeModal();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao excluir despesa.', error)
      setAlertMessage("Erro ao excluir despesa.");
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
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

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
                        <FontAwesomeIcon icon={faCircleInfo} className="table-icon" onClick={(e) => openNotes(row, e)} />
                      }
                      <FontAwesomeIcon icon={faPenToSquare} className="table-icon" onClick={() => openUpdateModal(row)} />
                      <FontAwesomeIcon icon={faTrashCan} className="table-icon" onClick={() => openDeleteModal(row)} />
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
          <ExpenseForm selectedRow={selectedRow} closeModal={closeModal} setExpenses={setExpenses} />
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
      <Alert message={alertMessage} />
    </div >
  )
}