"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./Search.module.css";

interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onValueChange: (value: string) => void;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ value, onValueChange, placeholder = "Pesquisar...", className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="search"
        role="searchbox"
        value={value}
        placeholder={placeholder}
        className={`${styles.search} ${className ?? ""}`}
        onChange={(e) => onValueChange(e.target.value)}
        {...props}
      />
    );
  }
);

Search.displayName = "Search";