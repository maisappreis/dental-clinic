import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/pagination/pagination";

describe("Pagination", () => {
  it("does not render when totalPages <= 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders page numbers", () => {
    render(
      <Pagination page={2} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onPageChange when clicking a page", () => {
    const onPageChange = jest.fn();

    render(
      <Pagination page={2} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByText("3"));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange when clicking previous", () => {
    const onPageChange = jest.fn();

    const { container } = render(
      <Pagination page={3} totalPages={5} onPageChange={onPageChange} />
    );

    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[0]);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange when clicking next", () => {
    const onPageChange = jest.fn();

    const { container } = render(
      <Pagination page={3} totalPages={5} onPageChange={onPageChange} />
    );

    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[buttons.length - 1]);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("disables previous button on first page", () => {
    const { container } = render(
      <Pagination page={1} totalPages={5} onPageChange={jest.fn()} />
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons[0]).toBeDisabled();
  });

  it("disables next button on last page", () => {
    const { container } = render(
      <Pagination page={5} totalPages={5} onPageChange={jest.fn()} />
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons[buttons.length - 1]).toBeDisabled();
  });

  it("renders dots when pages are truncated", () => {
    render(
      <Pagination page={5} totalPages={10} onPageChange={jest.fn()} />
    );

    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });
});