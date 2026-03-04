"use client";

import React, { forwardRef, InputHTMLAttributes, useId } from "react";
import styles from "./css/Checkbox.module.css";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked"> {
  label?: React.ReactNode;
  checked?: boolean;
  error?: string;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(function Checkbox(
  { label, checked = false, error, id, onChange, ...rest },
  ref
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const errorId = error ? `${checkboxId}-error` : undefined;

  return (
    <div className={styles.wrapper}>
      <label htmlFor={checkboxId} className={styles.labelWrapper}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={styles.input}
          onChange={(e) => onChange?.(e.target.checked)}
          {...rest}
        />

        {label && <span className={styles.label}>{label}</span>}
      </label>

      {error && (
        <span id={errorId} className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
});