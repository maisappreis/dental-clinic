import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/app/common/button";
import '@testing-library/jest-dom';

describe("Button Component", () => {
  
  it("renders the button with the correct text and icon", () => {
    render(<Button onClick={() => {}}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("calls onClick when button is clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /Click Me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders the button in a disabled state", () => {
    render(<Button onClick={() => {}} disabled={true}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toBeDisabled();
  });

});
