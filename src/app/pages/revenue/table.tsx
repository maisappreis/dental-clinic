"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "@/app/components/tooltip"
import Modal from "@/app/components/modal";
import RevenueForm from "./form";
import { formatDate } from "@/utils/date";
import { apiBase, fetchRevenue } from '@/utils/api';
import Alert from '@/app/components/alert'
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
  setRevenue: (newRevenue: any[]) => void;
}

interface RowProps {
  id: number;
  date: string;
  name: string;
  cpf: string;
  nf: string;
  procedure: string;
  payment: string;
  installments: number;
  value: number;
  notes: string;
}

export default function Table({ columns, data, setRevenue }: TableProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedRow, setSelectedRow] = useState<RowProps | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

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
    setModalTitle("Atualizar Receita");
    setSelectedRow(row);
  };

  const openDeleteModal = (row: RowProps): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Receita");
    setSelectedRow(row);
  };


  const deleteRevenue = async () => {
    try {
      if (selectedRow && selectedRow.id) {
        await axios.delete(`${apiBase}/revenue/${selectedRow.id}/`, {
          withCredentials: true
        })
        setAlertMessage("Receita excluída com sucesso!");
        const newRevenue = await fetchRevenue();
        setRevenue(newRevenue)

        setTimeout(() => {
          closeModal();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao excluir receita.', error)
      setAlertMessage("Erro ao excluir receita.");
    }
  }

  const closeModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
  }

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

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
                        : column.key === 'nf' ?
                          <div>
                            {
                              (row[column.key] ?
                                <FontAwesomeIcon icon={faCheck} className="table-icon" /> :
                                <FontAwesomeIcon icon={faXmark} className="table-icon" />
                              )
                            }
                          </div>
                          : column.key === 'date' ?
                            formatDate(row[column.key])
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
          <RevenueForm selectedRow={selectedRow} closeModal={closeModal} setRevenue={setRevenue} />
        </Modal>
      }
      {showDeleteModal && selectedRow &&
        <Modal title={modalTitle}>
          <h4 className="my-5 text-center">Tem certeza que deseja excluir o valor de
            <strong> R$ {selectedRow.value.toFixed(2).replace('.', ',')} </strong>
            do paciente <strong>{selectedRow.name}</strong>?
          </h4>
          <div className="flex justify-around">
            <button onClick={deleteRevenue} className="btn red size">
              Excluir
            </button>
            <button onClick={closeModal} className="btn red size blue">
              Cancelar
            </button>
          </div>
        </Modal>
      }
      <Alert message={alertMessage} />
    </div >
  )
}