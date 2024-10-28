import styles from "./styles/Search.module.css";
import { ChangeEvent } from "react";

interface SearchProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export default function Search({ search, onSearchChange }: SearchProps) {

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <input
      className={styles.search}
      type="text"
      placeholder="Pesquisar nomes separados por vírgula..."
      value={search}
      onChange={handleSearchChange}
    />
  )
}