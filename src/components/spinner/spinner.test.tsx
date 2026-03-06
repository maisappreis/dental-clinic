import { render, screen } from "@testing-library/react";
import { Spinner } from "@/components/spinner/spinner";

describe("Spinner Component", () => {
  it("renders spinner", () => {
    const { container } = render(<Spinner centered={false} />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toBeInTheDocument();
  });

  it("applies default size", () => {
    const { container } = render(<Spinner centered={false} />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveStyle({
      width: "40px",
      height: "40px",
    });
  });

  it("applies custom size", () => {
    const { container } = render(<Spinner size={60} centered={false} />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveStyle({
      width: "60px",
      height: "60px",
    });
  });

  it("renders centered container with text when centered is true", () => {
    render(<Spinner centered={true} />);

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it("does not render loading text when centered is false", () => {
    render(<Spinner centered={false} />);

    expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
  });
});