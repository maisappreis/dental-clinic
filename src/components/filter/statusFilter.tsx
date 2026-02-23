"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import styles from "./Filter.module.css";

export interface SelectOption<T extends string | number = string> {
  label: string;
  value: T;
}

interface StatusFilterProps<T extends string | number>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  value: T;
  options: SelectOption<T>[];
  onValueChange: (value: T) => void;
}

export const StatusFilter = forwardRef(
  <T extends string | number>(
    { value, options, onValueChange, className, ...props }: StatusFilterProps<T>,
    ref: React.Ref<HTMLSelectElement>
  ) => {
    return (
      <select
        ref={ref}
        className={`${styles.select} ${className ?? ""}`}
        value={value}
        onChange={(e) => onValueChange(e.target.value as T)}
        {...props}
      >
        {options.map(({ label, value }) => (
          <option key={String(value)} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }
);

StatusFilter.displayName = "StatusFilter";