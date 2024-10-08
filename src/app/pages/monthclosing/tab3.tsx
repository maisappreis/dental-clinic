import styles from "./MonthClosing.module.css";
import { MonthClosingProps } from '@/types/monthClosing';
import { formatValueToBRL } from "@/utils/utils";

interface ValuesProps {
  id: number;
  label: string;
  value: number;
}

export default function TabThree({ selectedMonthClosing }: { selectedMonthClosing: MonthClosingProps }) {

  const summary = [
    { id: 1, label: "Receita Bruta:", value: selectedMonthClosing.gross_revenue },
    { id: 2, label: "Receita Líquida:", value: selectedMonthClosing.net_revenue },
    { id: 3, label: "Despesas:", value: selectedMonthClosing.expenses },
    { id: 4, label: "Lucro Mirian:", value: selectedMonthClosing.profit },
  ]

  const inputs = [
    { id: 1, label: "Banco do Brasil:", value: selectedMonthClosing.bank_value },
    { id: 2, label: "Dinheiro:", value: selectedMonthClosing.cash_value },
    { id: 3, label: "Cartão:", value: selectedMonthClosing.card_value -  selectedMonthClosing.card_value_next_month},
    { id: 4, label: "Dra. Alana:", value: selectedMonthClosing.other_revenue },
  ];

  const outputs = [
    { id: 1, label: "Despesas:", value: selectedMonthClosing.expenses },
    { id: 2, label: "Dra. Mirian:", value: selectedMonthClosing.profit }
  ];

  const sumValues = (array: ValuesProps[]) => {
    if (array && array.length > 0) {
      return array.reduce((total, input) => total + input.value, 0);
    } else {
      return 0
    }
  }

  return (
    <div className="flex-col">
      <div className="flex justify-center w-full">
        <div className={`${styles.summary}`}>
          <h3 className="font-bold mb-4 text-center">Resumo</h3>
          {summary.map((item) => (
            <div key={item.id} className="flex-col">
              <div className="flex justify-between my-2">
                <span className="mr-4">{item.label}</span>
                <span>{formatValueToBRL(item.value)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.inputs}>
          <h3 className="font-bold mb-4 text-center">Entradas</h3>
          {inputs.map((input) => (
            <div key={input.id} className="flex-col">
              <div className="flex justify-between my-2">
                <span className="mr-4">{input.label}</span>
                <span>{formatValueToBRL(input.value)}</span>
              </div>
            </div>
          ))}
          <div className="flex-col">
            <div className="flex justify-between mt-4">
              <h3 className="font-bold">Total:</h3>
              <h3 className="font-bold">
                {formatValueToBRL(sumValues(inputs))}
              </h3>
            </div>
          </div>
        </div>

        <div className={styles.outputs}>
          <h3 className="font-bold mb-4 text-center">Saídas</h3>
          {outputs.map((input) => (
            <div key={input.id} className="flex-col">
              <div className="flex justify-between my-2">
                <span className="mr-4">{input.label}</span>
                <span>{formatValueToBRL(input.value)}</span>
              </div>
            </div>
          ))}
          <div className="flex-col">
            <div className="flex justify-between mt-4">
              <h3 className="font-bold">Total:</h3>
              <h3 className="font-bold">
                {formatValueToBRL(sumValues(outputs))}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mt-4">
        <div className={`flex ${styles.box}`}>
          <h3 className="font-bold">
            Saldo consultório: {formatValueToBRL(sumValues(inputs) - sumValues(outputs))}
          </h3>
        </div>
      </div>
    </div>
  )
}