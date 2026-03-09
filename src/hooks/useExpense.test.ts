import { renderHook, act } from "@testing-library/react";
import { useExpense } from "./useExpense";
import { ExpenseService } from "@/services/expense.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { sortByDate } from "@/utils/sort";

jest.mock("@/services/expense.service");
jest.mock("@/stores/loading.store");
jest.mock("@/stores/alert.store");
jest.mock("@/utils/utils");
jest.mock("@/utils/sort");

describe("useExpense", () => {
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

    (sortByDate as jest.Mock).mockImplementation((data) => data);
  });

  it("fetches expenses", async () => {
    const mockData = [{ id: 1 }];

    (ExpenseService.list as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useExpense());

    await act(async () => {
      await result.current.fetchExpenses();
    });

    expect(result.current.expenses).toEqual(mockData);
  });

  it("creates expense", async () => {
    (ExpenseService.create as jest.Mock).mockResolvedValue({});
    (ExpenseService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useExpense());

    await act(async () => {
      await result.current.create({
        name: "teste",
        date: "2026-01-10",
      } as any);
    });

    expect(ExpenseService.create).toHaveBeenCalled();
    expect(alertShow).toHaveBeenCalledWith({
      message: "Despesa criada com sucesso!",
      variant: "success",
    });
  });

  it("updates expense", async () => {
    const updated = { id: 1 };

    (ExpenseService.update as jest.Mock).mockResolvedValue(updated);
    (ExpenseService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useExpense());

    let response;

    await act(async () => {
      response = await result.current.update({ id: 1, date: "2026-01-10" } as any);
    });

    expect(ExpenseService.update).toHaveBeenCalled();
    expect(response).toEqual(updated);
  });

  it("removes expense", async () => {
    (ExpenseService.remove as jest.Mock).mockResolvedValue({});
    (ExpenseService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useExpense());

    await act(async () => {
      await result.current.remove(1);
    });

    expect(ExpenseService.remove).toHaveBeenCalledWith(1);
    expect(alertShow).toHaveBeenCalledWith({
      message: "Despesa excluida com sucesso!",
      variant: "success",
    });
  });
});