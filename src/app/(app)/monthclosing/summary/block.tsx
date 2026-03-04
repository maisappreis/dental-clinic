import { formatValueToBRL } from "@/utils/utils";

export function SummaryBlock({
  title,
  items,
  total,
}: {
  title: string;
  items: { label: string; value: number }[];
  total?: number;
}) {
  return (
    <div>
      <h3 className="font-bold mb-4 text-center">{title}</h3>

      {items.map((item) => (
        <div key={item.label} className="flex justify-between my-2">
          <span>{item.label}</span>
          <span>{formatValueToBRL(item.value)}</span>
        </div>
      ))}

      {total !== undefined && (
        <div className="flex justify-between mt-4 font-bold">
          <span>Total:</span>
          <span>{formatValueToBRL(total)}</span>
        </div>
      )}
    </div>
  );
};