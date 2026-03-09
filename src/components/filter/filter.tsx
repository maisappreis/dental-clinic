import React, { ChangeEvent } from "react";
import styles from "./Filter.module.css";

export interface FilterOption<T extends string | number = string> {
  label: string;
  value: T;
}

interface FilterProps<T extends string | number = string> {
  value: T;
  options: FilterOption<T>[];
  placeholder?: string;
  onChange: (value: T) => void;
}

export function Filter<T extends string | number>({
  value,
  options,
  placeholder = "Selecione",
  onChange,
}: FilterProps<T>) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as T);
  };

  return (
    <div className={styles.filter}>
      <select
        className={styles.select}
        value={value}
        onChange={handleChange}
      >
        <option disabled value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}