import { renderHook, act } from "@testing-library/react";
import { useMonthClosingStart } from "./useMonthClosingStart";
import { useRouter } from "next/navigation";
import { useRevenue } from "@/hooks/useRevenue";
import { useMonthClosingFlow } from "@/app/(app)/monthclosing/provider/provider";
import { filterRevenue } from "@/utils/filter";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useRevenue");
jest.mock("@/app/(app)/monthclosing/provider/provider");
jest.mock("@/utils/filter");

describe("useMonthClosingStart", () => {
  const push = jest.fn();
  const fetchRevenue = jest.fn();
  const setSelectedMonthClosing = jest.fn();
  const setClosingRevenue = jest.fn();
  const setMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push });

    (useRevenue as jest.Mock).mockReturnValue({
      revenue: [{ id: 1 }],
      fetchRevenue,
    });

    (useMonthClosingFlow as jest.Mock).mockReturnValue({
      setSelectedMonthClosing,
      setClosingRevenue,
      setMode,
    });

    (filterRevenue as jest.Mock).mockReturnValue([{ id: 1 }]);
  });

  it("starts from existing report", async () => {
    const report = { month: "Janeiro", year: 2025 };

    const { result } = renderHook(() => useMonthClosingStart());

    await act(async () => {
      await result.current.startFromExisting(report as any);
    });

    expect(setMode).toHaveBeenCalledWith("edit");
    expect(setSelectedMonthClosing).toHaveBeenCalledWith(report);
    expect(setClosingRevenue).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/monthclosing/tab1");
  });

  it("starts new report", async () => {
    const report = { month: "Fevereiro", year: 2025 };

    const { result } = renderHook(() => useMonthClosingStart());

    await act(async () => {
      await result.current.startNew(report as any);
    });

    expect(setMode).toHaveBeenCalledWith("create");
    expect(setSelectedMonthClosing).toHaveBeenCalledWith(report);
    expect(setClosingRevenue).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/monthclosing/tab1");
  });

  it("fetches revenue when revenue list is empty", async () => {
    (useRevenue as jest.Mock).mockReturnValue({
      revenue: [],
      fetchRevenue,
    });

    fetchRevenue.mockResolvedValue([{ id: 2 }]);

    const { result } = renderHook(() => useMonthClosingStart());

    await act(async () => {
      await result.current.startNew({ month: "Março", year: 2025 } as any);
    });

    expect(fetchRevenue).toHaveBeenCalled();
  });
});