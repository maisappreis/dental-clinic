interface RateInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function RateInput({ id, label, value, onChange }: RateInputProps) {
  return (
    <div className="flex">
      <label htmlFor={id} className="form-label mb-1">
        {label}
      </label>

      <input
        id={id}
        name={id}
        type="number"
        className="form-input"
        value={value}
        min="0"
        step="0.001"
        onChange={onChange}
      />
    </div>
  );
};