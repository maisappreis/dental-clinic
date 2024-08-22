"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "@/app/components/tooltip"
import Modal from "@/app/components/modal";
import RevenueForm from "@/app/forms/revenueForm";

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
  searchedNames: String[];
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

const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export default function Table({ columns, data, searchedNames }: TableProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
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
    installments: 0,
    value: 0,
    notes: ""
  });

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      const dateA: Date = new Date(a.date);
      const dateB: Date = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    if (searchedNames.length === 0) {
      setFilteredData(sorted);
    } else {
      const filterData = sorted.filter(item => {
        return searchedNames.some(element => {
          const searchedFieldName = element.toLowerCase();
          const listedFieldName = item.name.toLowerCase();
          return listedFieldName.includes(searchedFieldName);
        });
      });
      setFilteredData(filterData);
    }
  }, [data, searchedNames]);

  const openNotes = (e: React.MouseEvent) => {
    setShowTooltip(!showTooltip)
    setTooltipPosition({
      top: e.clientY - 20,
      left: e.clientX - 150,
    });
  }

  const openUpdateModal = (row: RowProps): void => {
    setShowUpdateModal(true);
    setModalTitle("Atualizar Receita");
    setSelectedRow(row);
    // console.log('row', row)
  };

  const openDeleteModal = (row: RowProps): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Receita");
    setSelectedRow(row);
    // console.log('row', row)
  };

  const handleSubmit = (formData: any) => {
    setFormData(formData);
    setShowUpdateModal(false);
  };

  const updateRevenue = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
    console.log('Dados do formulário recebidos >> updateRevenue:', data);
  }

  const deleteRevenue = () => {
    console.log('Deletar receita...')
  }

  const closeModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
  }

  return (
    <div>
      <div className="table-overflow">
        {filteredData.length > 0 ?
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
              {filteredData.map((row: any, rowIndex: number) => (
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
                              : column.key === 'status' ?
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
                        <FontAwesomeIcon icon={faCircleInfo} className="table-icon" onClick={openNotes} />
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
      {showTooltip && (
        <Tooltip top={tooltipPosition.top} left={tooltipPosition.left}>
          Teste nde exempo
        </Tooltip>
      )}
      {showUpdateModal && selectedRow &&
        <Modal title={modalTitle}>
          <RevenueForm selectedRow={selectedRow} onSubmit={handleSubmit} formRef={formRef} />
          <div className="flex justify-around">
            <button onClick={updateRevenue} className="btn green size">
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
    </div >
  )
}