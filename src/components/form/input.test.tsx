import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/form/input";

describe("Input Component", () => {
  it("renders the input", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Name" />);

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("sets the input value", () => {
    render(<Input value="John" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("John");
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Jane" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("Jane");
  });

  it("renders error message", () => {
    render(<Input error="Required field" />);

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets aria-invalid when error exists", () => {
    render(<Input error="Invalid value" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("associates error message with aria-describedby", () => {
    render(<Input error="Invalid value" />);

    const input = screen.getByRole("textbox");
    const error = screen.getByText("Invalid value");

    expect(input).toHaveAttribute("aria-describedby", error.id);
  });
});