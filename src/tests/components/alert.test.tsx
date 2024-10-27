import { render, screen } from "@testing-library/react";
import Alert from "@/app/components/alert";
import '@testing-library/jest-dom';

describe("Alert Component", () => {
  it("does not render when message is empty", () => {
    const { container } = render(<Alert message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the alert with success style when message does not contain 'erro'", () => {
    render(<Alert message="Atualizada com sucesso!" />);

    const alert = screen.getByText("Atualizada com sucesso!");
    expect(alert).toBeInTheDocument();
  });

  it("renders the alert with error style when message contains 'erro'", () => {
    render(<Alert message="Erro ao atualizar" />);

    const alert = screen.getByText("Erro ao atualizar");
    expect(alert).toBeInTheDocument();
  });
  
});
