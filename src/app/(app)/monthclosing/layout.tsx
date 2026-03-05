"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./MonthClosing.module.css";
import { MonthClosingProvider } from "@/app/(app)/monthclosing/provider";

const TABS = [
  { label: "Relatórios", path: "/monthclosing/reports/" },
  { label: "Passo 1", path: "/monthclosing/tab1/" },
  { label: "Passo 2", path: "/monthclosing/tab2/" },
  { label: "Resumo", path: "/monthclosing/summary/" },
];

export default function MonthClosingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <MonthClosingProvider>
      <div className="app-content">
        <div className={styles.tabs}>
          {TABS.map((tab) => {
            const isActive = pathname === tab.path;

            return (
              <button
                key={tab.path}
                className={`${styles.tab} ${
                  isActive ? styles.selected : ""
                }`}
                onClick={() => router.push(tab.path)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </MonthClosingProvider>
  );
};