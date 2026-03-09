import { render, screen, fireEvent } from "@testing-library/react";
import { Search } from "@/components/search/search";

describe("Search Component", () => {
  it("renders the search input", () => {
    render(<Search value="" onValueChange={() => {}} />);

    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
  });

  it("renders with default placeholder", () => {
    render(<Search value="" onValueChange={() => {}} />);

    expect(screen.getByPlaceholderText(/Pesquisar.../i)).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(
      <Search
        value=""
        placeholder="Search items"
        onValueChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText(/Search items/i)).toBeInTheDocument();
  });

  it("sets the input value", () => {
    render(<Search value="test" onValueChange={() => {}} />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("test");
  });

  it("calls onValueChange when typing", () => {
    const handleChange = jest.fn();

    render(<Search value="" onValueChange={handleChange} />);

    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "hello" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("hello");
  });

  it("applies custom className", () => {
    render(
      <Search
        value=""
        className="custom-class"
        onValueChange={() => {}}
      />
    );

    const input = screen.getByRole("searchbox");
    expect(input.className).toMatch(/custom-class/);
  });
});