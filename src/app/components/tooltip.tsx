import React from "react"
import styles from './styles/Tooltip.module.css';

type TooltipProps = {
  children: React.ReactNode;
  top: number;
  left: number;
};

export default function Tooltip({ children, top, left }: TooltipProps) {
  return (
    <div
      className={styles.tooltip}
      style={{
        position: "absolute",
        top: top,
        left: left,
        transform: "translate(-50%, -100%)",
      }}
    >
      {children}
    </div>
  )
}