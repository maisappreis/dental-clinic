"use client";

import React, { forwardRef, TextareaHTMLAttributes, useId } from "react";
import styles from "./css/Form.module.css";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  value?: string | number;
  error?: string;
  onChange?: (value: string) => void;
}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(
  { label, value, error, id, onChange, ...rest },
  ref
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        className={`${styles.textarea} ${error ? styles.error : ""}`}
        value={value ?? ""}
        aria-invalid={!!error}
        aria-describedby={errorId}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />

      {error && (
        <span id={errorId} className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
});