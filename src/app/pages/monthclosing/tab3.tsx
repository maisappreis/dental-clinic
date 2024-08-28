import styles from "./MonthClosing.module.css";

interface ValuesProps {
  id: number;
  label: string;
  value: number;
}

export default function TabThree() {

  const inputs = [
    { id: 1, label: "Banco do Brasil:", value: 2156.5 },
    { id: 2, label: "Dinhero:", value: 3000 },
    { id: 3, label: "PagBank:", value: 2006.5 },
    { id: 4, label: "Alana:", value: 450.5 },
  ];

  const outputs = [
    { id: 1, label: "Contas à pagar:", value: 850 },
    { id: 2, label: "Mirian:", value: 6500 }
  ];

  const sumValues = (array: ValuesProps[]) => {
    return array.reduce((total, input) => total + input.value, 0);
  }

  return (
    <div className="flex-col">
      <div className="flex justify-center w-full">
        <div className={styles.inputs}>
          <h3 className="font-bold mb-4 text-center">Entradas</h3>
          {inputs.map((input) => (
            <div key={input.id} className="flex-col">
              <div className="flex justify-between my-2">
                <span className="mr-4">{input.label}</span>
                <span>R$ {(input.value).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          ))}
          <div className="flex-col">
            <div className="flex justify-between mt-4">
              <h3 className="font-bold">Total:</h3>
              <h3 className="font-bold">
                R$ {(sumValues(inputs)).toFixed(2).replace('.', ',')}
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
                <span>R$ {(input.value).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          ))}
          <div className="flex-col">
            <div className="flex justify-between mt-4">
              <h3 className="font-bold">Total:</h3>
              <h3 className="font-bold">
                R$ {(sumValues(outputs)).toFixed(2).replace('.', ',')}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <div className={`flex ${styles.box}`}>
          <h3 className="font-bold">
            Saldo: R$ {(sumValues(inputs) - sumValues(outputs)).toFixed(2).replace('.', ',')}
          </h3>
        </div>
      </div>
    </div>
  )
}