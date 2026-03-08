import { render, screen } from "@testing-library/react";
import { MonthClosingProvider, useMonthClosingFlow } from "./provider";
import { act } from "react";

function TestComponent() {
  const {
    selectedMonthClosing,
    closingRevenue,
    mode,
    setSelectedMonthClosing,
    setClosingRevenue,
    setMode,
  } = useMonthClosingFlow();

  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="revenue-length">{closingRevenue.length}</span>
      <span data-testid="has-closing">
        {selectedMonthClosing ? "yes" : "no"}
      </span>

      <button
        onClick={() =>
          setSelectedMonthClosing({
            id: 1,
            bank_value: 1,
            cash_value: 1,
            card_value: 1,
            card_value_next_month: 1,
          } as any)
        }
      >
        setClosing
      </button>

      <button
        onClick={() =>
          setClosingRevenue([
            { id: 1, net_value: 100 } as any,
          ])
        }
      >
        setRevenue
      </button>

      <button onClick={() => setMode("edit")}>
        setMode
      </button>
    </div>
  );
}

describe("MonthClosingProvider", () => {
  it("provides default values", () => {
    render(
      <MonthClosingProvider>
        <TestComponent />
      </MonthClosingProvider>
    );

    expect(screen.getByTestId("mode").textContent).toBe("create");
    expect(screen.getByTestId("revenue-length").textContent).toBe("0");
    expect(screen.getByTestId("has-closing").textContent).toBe("no");
  });

  it("updates selectedMonthClosing", () => {
    render(
      <MonthClosingProvider>
        <TestComponent />
      </MonthClosingProvider>
    );

    act(() => {
      screen.getByText("setClosing").click();
    });

    expect(screen.getByTestId("has-closing").textContent).toBe("yes");
  });

  it("updates closingRevenue", () => {
    render(
      <MonthClosingProvider>
        <TestComponent />
      </MonthClosingProvider>
    );

    act(() => {
      screen.getByText("setRevenue").click();
    });

    expect(screen.getByTestId("revenue-length").textContent).toBe("1");
  });

  it("updates mode", () => {
    render(
      <MonthClosingProvider>
        <TestComponent />
      </MonthClosingProvider>
    );

    act(() => {
      screen.getByText("setMode").click();
    });

    expect(screen.getByTestId("mode").textContent).toBe("edit");
  });
});