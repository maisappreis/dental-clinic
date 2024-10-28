import { render, screen } from "@testing-library/react";
import Logotype from "@/app/layout/logotype";

describe("Logotype Component", () => {
  it("renders the tooth icon with correct style", () => {
    render(<Logotype />);

    const iconElement = screen.getByRole("img", { hidden: true });
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveStyle({ color: "rgb(134, 202, 254)" });
  });
});