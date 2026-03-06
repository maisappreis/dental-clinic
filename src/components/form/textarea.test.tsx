import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "@/components/form/textarea";

describe("Textarea Component", () => {
  it("renders the textarea", () => {
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Textarea label="Description" />);

    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("sets the textarea value", () => {
    render(<Textarea value="Hello world" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Hello world");
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();

    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "New text" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("New text");
  });

  it("renders error message", () => {
    render(<Textarea error="Required field" />);

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets aria-invalid when error exists", () => {
    render(<Textarea error="Invalid value" />);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("associates error message with aria-describedby", () => {
    render(<Textarea error="Invalid value" />);

    const textarea = screen.getByRole("textbox");
    const error = screen.getByText("Invalid value");

    expect(textarea).toHaveAttribute("aria-describedby", error.id);
  });
});