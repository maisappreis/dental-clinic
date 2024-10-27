import { render, screen, fireEvent } from "@testing-library/react";
import StatusFilter from "@/app/components/statusFilter";
import "@testing-library/jest-dom";

describe("StatusFilter Component", () => {
  const mockOnStatusChange = jest.fn();

  beforeEach(() => {
    render(
      <StatusFilter statusPayment="" onStatusChange={mockOnStatusChange} />
    );
  });

  it("renders the select element with correct options", () => {
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);

    expect(options[1]).toHaveTextContent("À pagar");
    expect(options[2]).toHaveTextContent("Pago");
    expect(options[3]).toHaveTextContent("Todos");
  });

  it("calls onStatusChange with the selected status when an option is selected", () => {
    const selectElement = screen.getByRole("combobox");

    fireEvent.change(selectElement, { target: { value: "Pago" } });

    expect(mockOnStatusChange).toHaveBeenCalledWith({
      selectedStatus: "Pago",
    });
  });

});
