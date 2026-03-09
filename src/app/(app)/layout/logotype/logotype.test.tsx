import { render, screen } from "@testing-library/react";
import { Logotype } from "./logotype";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="logo-icon" />,
}));

describe("Logotype", () => {
  it("renders the logo icon", () => {
    render(<Logotype />);

    expect(screen.getByTestId("logo-icon")).toBeInTheDocument();
  });
});