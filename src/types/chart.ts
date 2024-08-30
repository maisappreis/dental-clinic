export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    backgroundColor?: string;
    borderColor?: string;
    data: number[];
  }[];
}

export interface TooltipItem<TType extends ChartData = ChartData> {
  chart: ChartData;
  label: string;
  formattedValue: string;
  raw: number | null | undefined;
  dataIndex: number;
  datasetIndex: number;
  parsed: any;
  element: any;
}

export interface MonthNames {
  "01": string;
  "02": string;
  "03": string;
  "04": string;
  "05": string;
  "06": string;
  "07": string;
  "08": string;
  "09": string;
  "10": string;
  "11": string;
  "12": string;
}