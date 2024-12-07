"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { apiURL, fetchRevenue, isAuthenticated, configureAxios } from '@/utils/api';
import Tooltip from "@/app/common/tooltip";
import Loading from "@/app/common/loading";
import Modal from "@/app/common/modal";
import RevenueForm from "./form";
import { formatDate } from "@/utils/date";
import { formatValueToBRL } from "@/utils/utils";
import { RevenueProps } from "@/types/revenue";
import Alert from '@/app/common/alert';
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

export default function Table({ columns, data, setRevenue }: TableProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<RevenueProps | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const openNotes = (row: RevenueProps, e: React.MouseEvent): void => {
    setSelectedRow(row);
    setShowTooltip(!showTooltip);
    setTooltipPosition({
      top: e.clientY - 20,
      left: e.clientX - 150,
    });
  }

  const openUpdateModal = (row: RevenueProps): void => {
    setShowUpdateModal(true);
    setModalTitle("Atualizar Receita");
    setSelectedRow(row);
  };

  const openDeleteModal = (row: RevenueProps): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Receita");
    setSelectedRow(row);
  };

  const deleteRevenue = async () => {
    setLoading(true);
    try {
      if (selectedRow && selectedRow.id) {
        await axios.delete(`${apiURL()}/revenue/${selectedRow.id}/`)
        setAlertMessage("Receita excluída com sucesso!");
        const newRevenue = await fetchRevenue();
        setRevenue(newRevenue)
      }
    } catch (error) {
      console.error('Erro ao excluir receita.', error)
      setAlertMessage("Erro ao excluir receita.");
    } finally {
      closeModal();
      setLoading(false);
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

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  if (loading) {
    return (
      <Loading>
        Excluindo...
      </Loading>
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
          <RevenueForm
            selectedRow={selectedRow}
            closeModal={closeModal}
            setRevenue={setRevenue}
            setAlertMessage={setAlertMessage}
          />
        </Modal>
      }
      {showDeleteModal && selectedRow &&
        <Modal title={modalTitle}>
          <h4 className="my-5 text-center">Tem certeza que deseja excluir o valor de
            <strong> {formatValueToBRL(selectedRow.value)} </strong> do paciente
            <strong> {selectedRow.name}</strong>?
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