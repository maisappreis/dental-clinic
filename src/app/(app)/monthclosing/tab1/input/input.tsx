import styles from "../../MonthClosing.module.css";

interface RateInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function RateInput({ id, label, value, onChange }: RateInputProps) {
  return (
    <div className="flex">
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <input
        id={id}
        name={id}
        type="number"
        className={styles.inputWide}
        value={value}
        min="0"
        step="0.001"
        onChange={onChange}
      />
    </div>
  );
};