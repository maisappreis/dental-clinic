import { render, screen, fireEvent } from "@testing-library/react";
import { Filter } from "@/components/filter/filter";

describe("Filter Component", () => {
  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
  ];

  it("renders placeholder", () => {
    render(
      <Filter
        value=""
        options={options}
        placeholder="Select option"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Select option")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(
      <Filter
        value=""
        options={options}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("sets the selected value", () => {
    render(
      <Filter
        value="b"
        options={options}
        onChange={() => {}}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("b");
  });

  it("calls onChange when selection changes", () => {
    const handleChange = jest.fn();

    render(
      <Filter
        value=""
        options={options}
        onChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "a" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("a");
  });

  it("renders default placeholder when none provided", () => {
    render(
      <Filter
        value=""
        options={options}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Selecione")).toBeInTheDocument();
  });
});