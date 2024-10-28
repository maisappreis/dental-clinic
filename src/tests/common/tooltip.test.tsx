
import { render, screen } from "@testing-library/react";
import Tooltip from "@/app/common/tooltip";
import "@testing-library/jest-dom";

describe("Tooltip Component", () => {
  it("renders the tooltip with the correct position and content", () => {
    const tooltipContent = "This is a tooltip!";
    const topPosition = 100;
    const leftPosition = 200;

    render(
      <Tooltip top={topPosition} left={leftPosition}>
        {tooltipContent}
      </Tooltip>
    );

    const tooltipElement = screen.getByText(tooltipContent);
    expect(tooltipElement).toBeInTheDocument();

    expect(tooltipElement).toHaveStyle(`top: ${topPosition}px`);
    expect(tooltipElement).toHaveStyle(`left: ${leftPosition}px`);
  });
});
