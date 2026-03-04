"use client";

import React from "react";
import { RateInput } from "@/app/(app)/monthclosing/tab1/input";
import { Rates } from "@/types/monthClosing";

interface RatesFormProps {
  value: Rates;
  onChange: (rates: Rates) => void;
};

export function RatesForm({ value, onChange }: RatesFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;

    const parsedValue = inputValue === "" ? 0 : Number(inputValue);

    onChange({
      ...value,
      [name]: parsedValue,
    });
  };

  return (
    <div className="flex justify-between mb-4 gap-6">
      <RateInput
        id="debit"
        label="Débito (%)"
        value={value.debit}
        onChange={handleChange}
      />

      <RateInput
        id="cashCredit"
        label="Crédito à vista (%)"
        value={value.cashCredit}
        onChange={handleChange}
      />

      <RateInput
        id="installmentCredit"
        label="Crédito à prazo (%)"
        value={value.installmentCredit}
        onChange={handleChange}
      />
    </div>
  );
};