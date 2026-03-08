import { renderHook, act } from "@testing-library/react";
import { useRevenue } from "./useRevenue";
import { RevenueService } from "@/services/revenue.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { sortByDate } from "@/utils/sort";
import { capitalizeFirstLetter } from "@/utils/utils";

jest.mock("@/services/revenue.service");
jest.mock("@/stores/loading.store");
jest.mock("@/stores/alert.store");
jest.mock("@/utils/sort");
jest.mock("@/utils/utils");

describe("useRevenue", () => {
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

    (sortByDate as jest.Mock).mockImplementation((d) => d);
    (capitalizeFirstLetter as jest.Mock).mockImplementation((v) => v);
  });

  it("fetches revenue", async () => {
    const mockData = [{ id: 1 }];

    (RevenueService.list as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useRevenue());

    await act(async () => {
      await result.current.fetchRevenue();
    });

    expect(show).toHaveBeenCalledWith("Carregando receitas...");
    expect(RevenueService.list).toHaveBeenCalled();
    expect(result.current.revenue).toEqual(mockData);
    expect(hide).toHaveBeenCalled();
  });

  it("creates revenue", async () => {
    (RevenueService.create as jest.Mock).mockResolvedValue({});
    (RevenueService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useRevenue());

    await act(async () => {
      await result.current.create({ name: "teste" } as any);
    });

    expect(capitalizeFirstLetter).toHaveBeenCalled();
    expect(RevenueService.create).toHaveBeenCalled();
    expect(alertShow).toHaveBeenCalledWith({
      message: "Receita criada com sucesso!",
      variant: "success",
    });
  });

  it("updates revenue", async () => {
    (RevenueService.update as jest.Mock).mockResolvedValue({});
    (RevenueService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useRevenue());

    await act(async () => {
      await result.current.update({ id: 1, name: "teste" } as any);
    });

    expect(capitalizeFirstLetter).toHaveBeenCalled();
    expect(RevenueService.update).toHaveBeenCalled();
    expect(alertShow).toHaveBeenCalledWith({
      message: "Receita atualizada com sucesso!",
      variant: "success",
    });
  });

  it("removes revenue", async () => {
    (RevenueService.remove as jest.Mock).mockResolvedValue({});
    (RevenueService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useRevenue());

    await act(async () => {
      await result.current.remove(1);
    });

    expect(RevenueService.remove).toHaveBeenCalledWith(1);
    expect(alertShow).toHaveBeenCalledWith({
      message: "Receita excluida com sucesso!",
      variant: "success",
    });
  });
});