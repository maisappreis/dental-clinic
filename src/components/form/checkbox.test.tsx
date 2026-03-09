import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "@/components/form/checkbox";

describe("Checkbox Component", () => {
  it("renders the checkbox", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Checkbox label="Accept terms" />);

    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("is checked when checked prop is true", () => {
    render(<Checkbox checked />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("calls onChange when clicked", () => {
    const handleChange = jest.fn();

    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("renders error message", () => {
    render(<Checkbox error="Required field" />);

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets aria-invalid when error exists", () => {
    render(<Checkbox error="Invalid value" />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("associates error message with aria-describedby", () => {
    render(<Checkbox error="Invalid value" />);

    const checkbox = screen.getByRole("checkbox");
    const error = screen.getByText("Invalid value");

    expect(checkbox).toHaveAttribute("aria-describedby", error.id);
  });
});