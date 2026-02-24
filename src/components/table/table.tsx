"use client";

import styles from "./Table.module.css";

export interface Column<T> {
  key: string;
  header: string;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
}

export function Table<T>({
  data,
  columns,
  rowKey,
  emptyMessage = "Nenhum resultado encontrado.",
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`${styles[col.align ?? "left"]} th`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={`${styles.empty} td`}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${styles[col.align ?? "left"]} td`}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : col.accessor
                      ? String(row[col.accessor])
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};