"use client";

import React, { forwardRef } from "react";
import styles from "./css/Form.module.css";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange"
  > {
  label?: string;
  value?: string | number;
  options: SelectOption[];
  error?: string;
  onChange: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, value, options, error, onChange, ...rest },
    ref
  ) {
    const id = React.useId();

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          className={`${styles.select} ${error ? "error" : ""}`}
          value={value ?? ""}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        >
          <option value="" disabled>
            Selecione...
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <span
            id={`${id}-error`}
            className={styles.error}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);