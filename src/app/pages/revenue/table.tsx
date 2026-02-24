"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { apiURL, fetchRevenue, isAuthenticated, configureAxios } from '@/utils/api';
import { Tooltip } from "@/components/tooltip/tooltip";
import { Loading } from "@/components/loading/loading";
import Modal from "@/app/common/modal";
import RevenueForm from "./form";
import { formatDate } from "@/utils/date";
import { formatValueToBRL } from "@/utils/utils";
import { Revenue } from "@/types/revenue";
import { useAlertStore } from "@/stores/alert.store";
import { Button } from "@/components/button/button";
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
  const [selectedRow, setSelectedRow] = useState<Revenue | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const alert = useAlertStore.getState();

  const openNotes = (row: Revenue, e: React.MouseEvent): void => {
    setSelectedRow(row);
    setShowTooltip(!showTooltip);
    setTooltipPosition({
      top: e.clientY - 20,
      left: e.clientX - 150,
    });
  }

  const openUpdateModal = (row: Revenue): void => {
    setShowUpdateModal(true);
    setModalTitle("Atualizar Receita");
    setSelectedRow(row);
  };

  const openDeleteModal = (row: Revenue): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Receita");
    setSelectedRow(row);
  };

  const deleteRevenue = async () => {
    setIsLoading(true);
    try {
      if (selectedRow && selectedRow.id) {
        await axios.delete(`${apiURL()}/revenue/${selectedRow.id}/`)

        alert.show({
          message: "Receita excluída com sucesso!",
          variant: "success",
        });
        const newRevenue = await fetchRevenue();
        setRevenue(newRevenue)
      }
    } catch (error) {
      console.error('Erro ao excluir receita.', error)

      alert.show({
        message: "Erro ao excluir receita.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
  }

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  if (isLoading) {
    return (
      <Loading
        label="Excluindo..."
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
                        <Tooltip content={selectedRow ? selectedRow.notes : null} placement="bottom">
                          <span style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon
                              icon={faCircleInfo}
                              className="table-icon"
                              onClick={(e) => openNotes(row, e)}
                            />
                          </span>
                        </Tooltip>
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
      </div>
      {showUpdateModal && selectedRow &&
        <Modal title={modalTitle}>
          <RevenueForm
            selectedRow={selectedRow}
            closeModal={closeModal}
            setRevenue={setRevenue}
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
            <Button
              label="Excluir"
              variant="danger"
              size="md"
              onClick={deleteRevenue}
            />
            <Button
              label="Cancelar"
              variant="secondary"
              size="md"
              onClick={closeModal}
            />
          </div>
        </Modal>
      }
    </div >
  )
}