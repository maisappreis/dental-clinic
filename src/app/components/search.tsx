// "use client";
import styles from "./styles/Search.module.css";
import React, { ChangeEvent } from "react";

interface SearchProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export default function Search({ search, onSearchChange }: SearchProps) {

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchedNames = event.target.value;
    onSearchChange(searchedNames)
  };

  return (
    <input className={styles.search} type="text"
      placeholder="Pesquisar nomes separados por vírgula..."
      value={search}
      onChange={handleSearchChange}
    />
  )
}