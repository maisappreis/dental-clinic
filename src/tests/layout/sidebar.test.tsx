import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "@/app/layout/sidebar";
import { faChartLine, faCalendar, faHandHoldingDollar, faMoneyBillTransfer, faBook } from "@fortawesome/free-solid-svg-icons";

describe("Sidebar Component", () => {
  const mockOnOptionClick = jest.fn();

  beforeEach(() => {
    render(<Sidebar onOptionClick={mockOnOptionClick} />);
  });

  it("renders all sidebar options", () => {
    const options = [
      { label: "Agenda", icon: faCalendar },
      { label: "Métricas", icon: faChartLine },
      { label: "Receitas", icon: faHandHoldingDollar },
      { label: "Despesas", icon: faMoneyBillTransfer },
      { label: "Caixa Mensal", icon: faBook },
    ];

    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("sets selected option when clicked", () => {
    const revenueOption = screen.getByText("Receitas");
    fireEvent.click(revenueOption);

    expect(revenueOption.parentElement).toHaveClass("selected");
    expect(mockOnOptionClick).toHaveBeenCalledWith("revenue");
  });

  it("updates selected option when a different option is clicked", () => {
    const expenseOption = screen.getByText("Despesas");
    fireEvent.click(expenseOption);

    expect(expenseOption.parentElement).toHaveClass("selected");
    expect(mockOnOptionClick).toHaveBeenCalledWith("expense");
  });
});
