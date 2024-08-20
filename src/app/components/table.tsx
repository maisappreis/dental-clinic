"use client";
import React, { useState, useEffect } from "react";
import styles from './styles/Table.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCircleInfo, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

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

const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export default function Table({ columns, data, searchedNames }: TableProps) {
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [statusClasses, setStatusClasses] = useState<string[]>([]);

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

  useEffect(() => {
    const classes = filteredData.map(row => 
      `${styles.status} ${row.status ? styles.paid : styles.pay}`
    );
    setStatusClasses(classes);
  }, [filteredData]);

  return (
    <div>
      <div>
        {filteredData.length > 0 ?
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                {columns.map((column) => (
                  <th className={styles.th} key={column.key}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row: any, rowIndex: number) => (
                <tr className={styles.tr} key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td className={styles.td} key={colIndex}>
                      {column.key === 'value' ?
                        `R$ ${parseFloat(row[column.key]).toFixed(2).replace('.', ',')}`
                        : column.key === 'actions' ?
                          <div>
                            <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.icon} />
                            <FontAwesomeIcon icon={faTrashCan} className={styles.icon} />
                          </div>
                          : column.key === 'nf' ?
                            <div>
                              {
                                (row[column.key] ?
                                  <FontAwesomeIcon icon={faCheck} className={styles.icon} /> :
                                  <FontAwesomeIcon icon={faXmark} className={styles.icon} />
                                )
                              }
                            </div>
                            : column.key === 'date' || column.key === 'dueDate' ?
                              formatDate(row[column.key])
                              : column.key === 'status' ?
                                // <button
                                //   className={`${styles.status} ${row[column.key] ? styles.paid : styles.pay}`}
                                // >
                                //   {row[column.key] ? "Pago" : "À pagar"}
                                // </button>
                                <button
                                  className={statusClasses[rowIndex]}
                                >
                                  {row[column.key] ? "Pago" : "À pagar"}
                                </button>
                                : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          : <div className={styles.none}>Nenhum resultado encontrado.</div>
        }
      </div >
    </div >
  )
}