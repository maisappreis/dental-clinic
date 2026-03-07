"use client";

import styles from "./Pagination.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function generatePages() {
    const pages: (number | "...")[] = [];

    const start = Math.max(1, page - siblingCount);
    const end = Math.min(totalPages, page + siblingCount);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  const pages = generatePages();

  return (
    <div className={styles.pagination}>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={styles.button}
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className={styles.dots}>
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${styles.page} ${
              p === page ? styles.active : ""
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={styles.button}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
};