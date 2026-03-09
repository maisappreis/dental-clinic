import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "@/components/alert/alert";
import "@testing-library/jest-dom";

describe("Alert Component", () => {

  it("renders the alert message", () => {
    render(<Alert message="Test message" />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("does not render when message is empty", () => {
    const { container } = render(<Alert message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders close button when onClose is provided", () => {
    const onClose = jest.fn();

    render(<Alert message="Error" onClose={onClose} />);

    const button = screen.getByRole("button", { name: /fechar alerta/i });
    expect(button).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();

    render(<Alert message="Error" onClose={onClose} />);

    const button = screen.getByRole("button", { name: /fechar alerta/i });
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});