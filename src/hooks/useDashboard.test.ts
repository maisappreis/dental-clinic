import { renderHook, act } from "@testing-library/react";
import { useDashboard } from "./useDashboard";
import { DashboardService } from "@/services/dashboard.service";

jest.mock("@/services/dashboard.service");

describe("useDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const initialData = {
    most_performed_procedures: {
      labels: [],
      data: [],
    },
    number_of_procedures: {
      labels: [],
      data: [],
    },
    monthly_profit: {
      labels: [],
      data: [],
    },
    revenue_versus_expense:{
      labels: [],
      data: {
        revenue: [],
        expense: [],
      }
    }
  };

  it("initializes with provided data and loading true", () => {
    const { result } = renderHook(() => useDashboard(initialData));

    expect(result.current.dataChart).toEqual(initialData);
    expect(result.current.isLoading).toBe(true);
  });

  it("fetches dashboard data successfully", async () => {
    const mockData = {
      revenue: [100],
      expenses: [50],
      profit: [50],
      labels: ["Jan"],
    };

    (DashboardService.list as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useDashboard(initialData));

    await act(async () => {
      await result.current.fetchDataChart();
    });

    expect(DashboardService.list).toHaveBeenCalled();
    expect(result.current.dataChart).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles error and still stops loading", async () => {
    (DashboardService.list as jest.Mock).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useDashboard(initialData));

    await act(async () => {
      try {
        await result.current.fetchDataChart();
      } catch {}
    });

    expect(result.current.isLoading).toBe(false);
  });
});