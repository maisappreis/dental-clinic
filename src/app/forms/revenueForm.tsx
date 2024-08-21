import React from "react";
import Autocomplete from "@/app/components/autocomplete"


export default function RevenueForm() {
  const procedureOptions = ['Restauração', 'Profilaxia', 'Clareamento'];
  const paymentOptions = ['Dinheiro', 'PIX', 'Débito', 'Crédito à vista', 'Crédito à prazo', 'Transferência', 'Cheque'];
  const installmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const handleSelect = (option: string) => {
    console.log('selected option:', option)
  }

  return (
    <>
      <form className="form-area">
        <div className="flex form-item">
          <label htmlFor="name" className="form-label">Nome:</label>
          <input id="name" type="text" className="form-input" required />
        </div>
        <div className="flex form-item">
          <label htmlFor="date" className="form-label">Data:</label>
          <input id="date" type="date" className="form-input" required />
        </div>
        <div className="flex form-item">
          <label className="form-label">Com nota fiscal?</label>
          <input id="nf" type="radio" className="form-radio" value="Não" required />
          <label htmlFor="nf" className="form-label">Não</label>
          <input id="nf" type="radio" className="form-radio" value="Sim" required />
          <label htmlFor="nf" className="form-label">Sim</label>
        </div>
        {/* Se Sim, mostra o input de CPF */}
        <div className="flex form-item">
          <label htmlFor="date" className="form-label">CPF:</label>
          <input id="date" type="text" className="form-input" />
        </div>

        <div className="flex form-item">
          <label htmlFor="procedure" className="form-label">Procedimento:</label>
          <Autocomplete options={procedureOptions} onSelect={handleSelect} />
        </div>
        <div className="flex form-item">
          <label htmlFor="payment" className="form-label">Pagamento:</label>
          <Autocomplete options={paymentOptions} onSelect={handleSelect} />
        </div>
        {/* Se Crédito à prazo, mostra o input Parcelado */}
        <div className="flex form-item">
          <label htmlFor="installment" className="form-label">Parcelado em:</label>
          {/* <input id="installment" type="number" className="form-input" /> */}
          <select id="installment" className="form-select">
            {installmentOptions.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex form-item">
          <label htmlFor="value" className="form-label">Valor:</label>
          <input id="value" type="number" className="form-input" />
        </div>
        <div className="flex form-item">
          <label htmlFor="notes" className="form-label">Notas:</label>
          <textarea id="notes" className="form-textarea" />
        </div>
      </form>
    </>
  )
}