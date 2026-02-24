"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: TooltipPlacement;
  offset?: number;
}

export function Tooltip({
  content,
  children,
  open,
  onOpenChange,
  placement = "top",
  offset = 8,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const positions = {
      top: {
        top: rect.top - offset,
        left: rect.left + rect.width / 2,
      },
      bottom: {
        top: rect.bottom + offset,
        left: rect.left + rect.width / 2,
      },
      left: {
        top: rect.top + rect.height / 2,
        left: rect.left - offset,
      },
      right: {
        top: rect.top + rect.height / 2,
        left: rect.right + offset,
      },
    };

    setCoords(positions[placement]);
  }, [open, placement, offset]);

  return (
    <>
      <span
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={() => onOpenChange(true)}
        onMouseLeave={() => onOpenChange(false)}
        onClick={() => onOpenChange(!open)}
        style={{ display: "inline-flex", cursor: "pointer" }}
      >
        {children}
      </span>

      {open && coords &&
        createPortal(
          <div
            role="tooltip"
            className={`${styles.tooltip} ${styles[placement]}`}
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};