import styles from "./Tab2.module.css";
import { formatValueToBRL } from "@/utils/utils";

type SummaryVariant = "default" | "positive" | "negative";

export function SummaryRow({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: SummaryVariant;
}) {
  const colorClass =
    variant === "positive"
      ? styles.green
      : variant === "negative"
      ? styles.red
      : "";

  return (
    <div className="flex justify-between my-2">
      <span className={`font-bold ${colorClass}`}>
        {label}:
      </span>
      <span className={`font-bold ${colorClass}`}>
        {formatValueToBRL(value)}
      </span>
    </div>
  );
};