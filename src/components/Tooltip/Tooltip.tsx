"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  offset?: number;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  offset = 8,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

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
  }, [placement, offset]);

  return (
    <>
      <span
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={() => setCoords((c) => c)}
      >
        {children}
      </span>

      {coords &&
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
}