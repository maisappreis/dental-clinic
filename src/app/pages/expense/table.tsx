"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "@/app/components/tooltip"
import Modal from "@/app/components/modal";
import ExpenseForm from "@/app/forms/expenseForm";
import { formatDate } from "@/utils/date";

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
}

interface RowProps {
  id: number;
  year: number;
  month: string;
  name: string;
  installments: string;
  date: string;
  value: number;
  is_paid: boolean;
  notes: string;
}

export default function Table({ columns, data }: TableProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [statusClasses, setStatusClasses] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedRow, setSelectedRow] = useState<RowProps | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    date: "",
    cpf: "",
    nf: "",
    procedure: "",
    payment: "",
    installments: "",
    value: 0,
    notes: ""
  });

  useEffect(() => {
    const classes = data.map(row =>
      `t-status ${row.is_paid ? 't-paid' : 't-pay'}`
    );
    setStatusClasses(classes);
  }, [data]);

  const openNotes = (row: RowProps, e: React.MouseEvent): void => {
    setSelectedRow(row);
    setShowTooltip(!showTooltip);
    setTooltipPosition({
      top: e.clientY - 20,
      left: e.clientX - 150,
    });
  }

  const openUpdateModal = (row: RowProps): void => {
    setShowUpdateModal(true);
    setModalTitle("Atualizar Despesa");
    setSelectedRow(row);
  };

  const openDeleteModal = (row: RowProps): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Despesa");
    setSelectedRow(row);
  };

  const handleSubmit = (formData: any) => {
    setFormData(formData);
    setShowUpdateModal(false);
  };

  const updateExpense = (data: any) => {
    setFormData(data);
    console.log('Dados do formulário recebidos >> updateExpense:', data);
  }

  const deleteExpense = () => {
    console.log('Deletar despesa...')
  }

  const closeModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
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
                        `R$ ${parseFloat(row[column.key]).toFixed(2).replace('.', ',')}`
                        : column.key === 'date' ?
                              formatDate(row[column.key])
                              : column.key === 'is_paid' ?
                                <button
                                  className={statusClasses[rowIndex]}
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
          <ExpenseForm selectedRow={selectedRow} onSubmit={handleSubmit} formRef={formRef} />
          <div className="flex justify-around">
            <button onClick={updateExpense} className="btn green size">
              Salvar
            </button>
            <button onClick={closeModal} className="btn red size">
              Cancelar
            </button>
          </div>
        </Modal>
      }
      {showDeleteModal && selectedRow &&
        <Modal title={modalTitle}>
          <h4 className="my-5 text-center">Tem certeza que deseja excluir o valor de
            <strong> R$ {selectedRow.value.toFixed(2).replace('.', ',')}
            </strong> referente a despesa de <strong>{selectedRow.name}</strong>?
          </h4>
          <div className="flex justify-around">
            <button onClick={deleteExpense} className="btn red size">
              Excluir
            </button>
            <button onClick={closeModal} className="btn red size blue">
              Cancelar
            </button>
          </div>
        </Modal>
      }
    </div >
  )
}