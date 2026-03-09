import { renderHook, act } from "@testing-library/react";
import { useProfit } from "./useProfit";
import { ProfitService } from "@/services/profit.service";
import { useLoadingStore } from "@/stores/loading.store";

jest.mock("@/services/profit.service");
jest.mock("@/stores/loading.store");

describe("useProfit", () => {
  const show = jest.fn();
  const hide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLoadingStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ show, hide })
    );
  });

  it("starts with default profit state", () => {
    const { result } = renderHook(() => useProfit());

    expect(result.current.profit).toEqual({
      profit: [],
      labels: [],
    });
  });

  it("fetches profit data", async () => {
    const mockData = {
      profit: [1000, 2000],
      labels: ["Jan", "Fev"],
    };

    (ProfitService.list as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useProfit());

    await act(async () => {
      await result.current.fetchProfit();
    });

    expect(ProfitService.list).toHaveBeenCalled();
    expect(result.current.profit).toEqual(mockData);
  });

  it("keeps loading lifecycle even if request fails", async () => {
    (ProfitService.list as jest.Mock).mockRejectedValue(new Error("error"));

    const { result } = renderHook(() => useProfit());

    await act(async () => {
      try {
        await result.current.fetchProfit();
      } catch {}
    });

    expect(result.current.isLoading).toBe(false);
  });
});