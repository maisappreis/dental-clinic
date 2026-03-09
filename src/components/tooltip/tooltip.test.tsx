import { render, screen, fireEvent } from "@testing-library/react";
import { Tooltip } from "@/components/tooltip/tooltip";

const mockRect = {
  top: 100,
  left: 200,
  bottom: 150,
  right: 250,
  width: 50,
  height: 50,
};

beforeAll(() => {
  HTMLElement.prototype.getBoundingClientRect = jest.fn(() => mockRect as DOMRect);
});

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Tooltip text" open={false} onOpenChange={jest.fn()}>
        <button>Trigger</button>
      </Tooltip>
    );

    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("calls onOpenChange on mouse enter", () => {
    const onOpenChange = jest.fn();

    render(
      <Tooltip content="Tooltip text" open={false} onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText("Trigger"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange on mouse leave", () => {
    const onOpenChange = jest.fn();

    render(
      <Tooltip content="Tooltip text" open={true} onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseLeave(screen.getByText("Trigger"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("toggles on click", () => {
    const onOpenChange = jest.fn();

    render(
      <Tooltip content="Tooltip text" open={false} onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.click(screen.getByText("Trigger"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders tooltip when open", () => {
    render(
      <Tooltip content="Tooltip text" open={true} onOpenChange={jest.fn()}>
        <button>Trigger</button>
      </Tooltip>
    );

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();
  });

  it("does not render tooltip when closed", () => {
    render(
      <Tooltip content="Tooltip text" open={false} onOpenChange={jest.fn()}>
        <button>Trigger</button>
      </Tooltip>
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("applies placement class", () => {
    render(
      <Tooltip
        content="Tooltip text"
        open={true}
        placement="bottom"
        onOpenChange={jest.fn()}
      >
        <button>Trigger</button>
      </Tooltip>
    );

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toMatch(/bottom/);
  });
});