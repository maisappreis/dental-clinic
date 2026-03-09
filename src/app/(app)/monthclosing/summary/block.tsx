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
    <div className="flex flex-col justify-between h-full">
      <div>
        <h2 className="font-bold mb-5 text-center">{title}</h2>
      
        {items.map((item) => (
          <div key={item.label} className="flex justify-between my-2 font-medium">
            <span>{item.label}</span>
            <span>{formatValueToBRL(item.value)}</span>
          </div>
        ))}
      </div>

      {total !== undefined && (
        <div className="flex justify-between mt-4 font-bold">
          <span>Total:</span>
          <span>{formatValueToBRL(total)}</span>
        </div>
      )}
    </div>
  );
};