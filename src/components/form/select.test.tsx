import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "@/components/form/select";

describe("Select Component", () => {
  const options = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ];

  it("renders the select", () => {
    render(<Select options={options} onChange={() => {}} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Select label="Category" options={options} onChange={() => {}} />);

    expect(screen.getByText("Category")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select options={options} onChange={() => {}} />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("sets selected value", () => {
    render(<Select value="2" options={options} onChange={() => {}} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("2");
  });

  it("calls onChange when selection changes", () => {
    const handleChange = jest.fn();

    render(<Select options={options} onChange={handleChange} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "1" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("1");
  });

  it("renders error message", () => {
    render(
      <Select
        options={options}
        onChange={() => {}}
        error="Required field"
      />
    );

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets aria-invalid when error exists", () => {
    render(
      <Select
        options={options}
        onChange={() => {}}
        error="Invalid value"
      />
    );

    const select = screen.getByRole("combobox");

    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("associates error message with aria-describedby", () => {
    render(
      <Select
        options={options}
        onChange={() => {}}
        error="Invalid value"
      />
    );

    const select = screen.getByRole("combobox");
    const error = screen.getByText("Invalid value");

    expect(select).toHaveAttribute("aria-describedby", error.id);
  });
});