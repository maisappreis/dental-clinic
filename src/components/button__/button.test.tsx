import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/button__/button";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

describe("Button Component", () => {
  it("renders the label", () => {
    render(<Button label="Click me" />);

    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("renders icon when provided", () => {
    render(<Button label="Save" icon={faCheck} />);

    const icon = document.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();

    render(<Button label="Submit" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when disabled prop is true", () => {
    render(<Button label="Disabled" disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables button when loading", () => {
    render(<Button label="Submit" isLoading />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading text when isLoading is true", () => {
    render(<Button label="Submit" isLoading />);

    expect(screen.getByText("Carregando…")).toBeInTheDocument();
  });

  it("does not show original label when loading", () => {
    render(<Button label="Submit" isLoading />);

    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<Button label="Danger" variant="danger" />);

    const button = screen.getByRole("button");
    expect(button.className).toMatch(/danger/);
  });

  it("applies size class", () => {
    render(<Button label="Large" size="lg" />);

    const button = screen.getByRole("button");
    expect(button.className).toMatch(/lg/);
  });
});