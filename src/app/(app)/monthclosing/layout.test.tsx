import { render, screen, fireEvent } from "@testing-library/react";
import MonthClosingLayout from "./layout";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/app/(app)/monthclosing/provider/provider", () => ({
  MonthClosingProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="provider">{children}</div>
  ),
}));

describe("MonthClosingLayout", () => {
  const { usePathname } = jest.requireMock("next/navigation");

  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renders all tabs", () => {
    usePathname.mockReturnValue("/monthclosing/reports/");

    render(
      <MonthClosingLayout>
        <div>content</div>
      </MonthClosingLayout>
    );

    expect(screen.getByText("Relatórios")).toBeInTheDocument();
    expect(screen.getByText("Passo 1")).toBeInTheDocument();
    expect(screen.getByText("Passo 2")).toBeInTheDocument();
    expect(screen.getByText("Resumo")).toBeInTheDocument();
  });

  it("renders children", () => {
    usePathname.mockReturnValue("/monthclosing/reports/");

    render(
      <MonthClosingLayout>
        <div data-testid="child">content</div>
      </MonthClosingLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("navigates when tab is clicked", () => {
    usePathname.mockReturnValue("/monthclosing/reports/");

    render(
      <MonthClosingLayout>
        <div>content</div>
      </MonthClosingLayout>
    );

    fireEvent.click(screen.getByText("Passo 1"));

    expect(pushMock).toHaveBeenCalledWith("/monthclosing/tab1/");
  });

  it("marks active tab", () => {
    usePathname.mockReturnValue("/monthclosing/tab2/");

    render(
      <MonthClosingLayout>
        <div>content</div>
      </MonthClosingLayout>
    );

    const activeTab = screen.getByText("Passo 2");

    expect(activeTab.className).toContain("selected");
  });
});