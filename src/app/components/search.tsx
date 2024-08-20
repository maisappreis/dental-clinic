"use client";
import styles from "./styles/Search.module.css";
import React, { useState, ChangeEvent } from "react";

interface SearchProps {
  updateSearchNames: (names: string[]) => void
}

export default function Search({updateSearchNames}: SearchProps) {
  const [search, setSearch] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    if (event.target.value === "") updateSearchNames([]);
  };

  const applySearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event as React.KeyboardEvent<HTMLInputElement>).key === 'Enter') {
      const searchedNames = search.split(",").map(value => value.trim())
      updateSearchNames(searchedNames)
    }
  };

  return (
    <input className={styles.search} type="text"
      placeholder="Pesquisar nomes separados por vírgula..."
      value={search}
      onChange={handleChange}
      onKeyDown={applySearch}
    />
  )
}