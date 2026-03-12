import { renderHook, act } from "@testing-library/react";
import { useMonthClosing } from "./useMonthClosing";
import { MonthClosingService } from "@/services/monthClosing.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";

jest.mock("@/services/monthClosing.service");
jest.mock("@/stores/loading.store");
jest.mock("@/stores/alert.store");

describe("useMonthClosing", () => {
  const show = jest.fn();
  const hide = jest.fn();
  const alertShow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLoadingStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ show, hide })
    );

    (useAlertStore.getState as jest.Mock) = jest.fn().mockReturnValue({
      show: alertShow,
    });
  });

  it("fetches month closing data", async () => {
    const mockData = [{ id: 1, month: "Janeiro", year: 2025 }];

    (MonthClosingService.list as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useMonthClosing());

    await act(async () => {
      await result.current.fetchMonthClosing(2025);
    });

    expect(MonthClosingService.list).toHaveBeenCalledWith(2025);
    expect(result.current.monthClosing).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it("updates month closing", async () => {
    const response = { id: 1 };

    (MonthClosingService.update as jest.Mock).mockResolvedValue(response);

    const { result } = renderHook(() => useMonthClosing());

    let res;

    await act(async () => {
      res = await result.current.update({ id: 1 } as any);
    });

    expect(show).toHaveBeenCalledWith("Salvando dados...");
    expect(MonthClosingService.update).toHaveBeenCalled();
    expect(alertShow).toHaveBeenCalledWith({
      message: "Dados salvos com sucesso!",
      variant: "success",
    });
    expect(res).toEqual(response);
  });

  it("updates net values", async () => {
    (MonthClosingService.updateNetValues as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useMonthClosing());

    await act(async () => {
      await result.current.updateNetValues([{ id: 1, net_value: 100 }] as any);
    });

    expect(show).toHaveBeenCalledWith("Atualizando valores líquidos...");
    expect(MonthClosingService.updateNetValues).toHaveBeenCalled();
    expect(alertShow).toHaveBeenCalledWith({
      message: "Valores líquidos atualizados com sucesso!",
      variant: "success",
    });
  });
});