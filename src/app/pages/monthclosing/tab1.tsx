import { formatDate } from "@/utils/date";

export default function TabOne() {

  const columns: { key: string; name: string; }[] = [
    { key: "date", name: "Data" },
    { key: "name", name: "Nome" },
    { key: "payment", name: "Pagamento" },
    { key: "installments", name: "Parcelas" },
    { key: "grossValue", name: "Valor Bruto" },
    { key: "netValue", name: "Valor Líquido" },
  ];

  const data = [
    { id: 1, date: "2024-08-23", name: "João", payment: "Débito", installments: 0, grossValue: 250 },
    { id: 2, date: "2024-08-24", name: "Maria", payment: "Crédito à vista", installments: 0, grossValue: 200 },
    { id: 3, date: "2024-08-25", name: "José", payment: "Débito", installments: 0, grossValue: 350 },
    { id: 4, date: "2024-08-26", name: "Alfredo", payment: "Crédito à prazo", installments: 3, grossValue: 500 },
    { id: 5, date: "2024-08-27 ", name: "Cruses", payment: "Débito", installments: 0, grossValue: 300 },
    { id: 6, date: "2024-08-27 ", name: "Cruses", payment: "Débito", installments: 0, grossValue: 300 },
    { id: 7, date: "2024-08-27 ", name: "Cruses", payment: "Débito", installments: 0, grossValue: 300 },
  ]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('name', name)
    console.log('value', value)

    // let newValue = value;
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: newValue,
    // }));
  };

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
                      {column.key === 'grossValue' ?
                        `R$ ${parseFloat(row[column.key]).toFixed(2).replace('.', ',')}`
                        : column.key === 'date' ?
                          formatDate(row[column.key])
                          : column.key === 'netValue' ?
                            <input id="net-value" name="net-value" type="number" className="form-input"
                              onChange={handleInputChange} min="0.001" step="0.001" required />
                            : row[column.key]}
                    </td>
                  ))}
                  <td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          : <div className="no-data">Nenhum resultado encontrado.</div>
        }
      </div>
    </div>
  )
}