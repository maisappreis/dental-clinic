import { render, screen, fireEvent } from "@testing-library/react";
import Search from "@/app/components/search";
import "@testing-library/jest-dom";

describe("Search Component", () => {
  const onSearchChangeMock = jest.fn();

  it("renders the search input with the correct placeholder and value", () => {
    const searchValue = "John Doe";
    render(<Search search={searchValue} onSearchChange={onSearchChangeMock} />);

    const inputElement = screen.getByPlaceholderText(/pesquisar nomes separados por vírgula/i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(searchValue);
  });

  it("calls onSearchChange when input value changes", () => {
    render(<Search search="" onSearchChange={onSearchChangeMock} />);

    const inputElement = screen.getByPlaceholderText(/pesquisar nomes separados por vírgula/i);
    fireEvent.change(inputElement, { target: { value: "Jane Doe" } });
    expect(onSearchChangeMock).toHaveBeenCalledWith("Jane Doe");
  });
});
