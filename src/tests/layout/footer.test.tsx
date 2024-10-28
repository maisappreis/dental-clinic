import { render, screen } from "@testing-library/react";
import Footer from "@/app/layout/footer";

jest.mock("next/font/google", () => ({
  Dancing_Script: () => ({ className: "dancing" }),
}));

describe("Footer Component", () => {
  it("renders the correct text with heart icon and name", () => {
    render(<Footer />);

    const heartIcon = screen.getByRole("img", { hidden: true });
    expect(heartIcon).toBeInTheDocument();
    expect(heartIcon).toHaveClass("red");

    const nameElement = screen.getByText("Maisa");
    expect(nameElement).toBeInTheDocument();
    expect(nameElement).toHaveClass("dancing");
    expect(nameElement).toHaveStyle({ color: "red", fontSize: "20px" });
  });
});